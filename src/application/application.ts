import { vec2 } from "gl-matrix";
import { CanvasKeyBoardEvent } from "./event/canvasKeyBoardEvent";
import { CanvasMouseEvent } from "./event/canvasMouseEvent";
import { InputEventType } from "./event/types";
import { Timer, TimerCallback } from '../utils/timer';


export class Application implements EventListenerObject {
    public timers: Timer[];
    private _timerId: number = -1;
    private _fps: number = 0;
    public isFlipYcoord: boolean = false;
    public canvas: HTMLCanvasElement;
    public isSupportMouseMove: boolean = false;
    protected _isMouseDown: boolean = false;
    protected _start: boolean = false;
    protected _requestId: number = -1;
    protected _lastTime: number;
    protected _startTime: number;
    public afterRenderObservable: ((app: Application) => void)[] | null;
    public beforRenderObjservable: ((app: Application) => void)[] | null;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this._isMouseDown = false;
        this.isSupportMouseMove = false;
        this.afterRenderObservable = null;
        this.beforRenderObjservable = null;
        this.timers = [];
        document.oncontextmenu = () => false;
        this.canvas.addEventListener("mousedown", this, false);
        this.canvas.addEventListener("mouseup", this, false);
        this.canvas.addEventListener("mousemove", this, false);
        window.addEventListener("keydown", this, false);
        window.addEventListener("keyup", this, false);
        window.addEventListener("keypress", this, false);
    }

    public get isRun(): boolean {
        return this._start;
    }

    public async run(): Promise<void> {
        this.start();
    }
    public start(): void {
        if (!this._start) {
            this._start = true;
            this._lastTime = -1;
            this._startTime = -1;
            this._requestId = requestAnimationFrame((msec:number): void => this.step(msec));
        }
    }

    public stop(): void {
        if (this._start) {
            this._start = false;
            this._lastTime = -1;
            this._startTime = -1;
            cancelAnimationFrame(this._requestId)
            this._requestId = -1;
        }
    }

    public step(timeStamp: number) {
        if (this._startTime === -1) {
            this._startTime = timeStamp;
        }
        if (this._lastTime === -1) {
            this._lastTime = timeStamp;
        }
        let _elepsadMsec = timeStamp - this._startTime;
        let _intervalMsec = timeStamp - this._lastTime;
        if (_intervalMsec !== 0) {
            this._fps = 1000.0 / _intervalMsec;
        }
        _intervalMsec /= 1000.0;
        this._lastTime = timeStamp;
        this._handleTimers(_intervalMsec);
        this.update(_elepsadMsec,_intervalMsec);
        this.render();
        //callback
        if (this.afterRenderObservable && this.afterRenderObservable.length) {
            this.afterRenderObservable.forEach( f => {
                f(this);
            })
        }
        requestAnimationFrame((_elepsadMsec: number): void => {
            this.step(_elepsadMsec);
        })
    }

    public update(elepsadMsec: number, inervalMsec: number): void {
            
    }

    public render(): void {

    }

    protected viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
        let rect: DOMRect = this.canvas.getBoundingClientRect();
        if (evt.target) {
            let x = evt.clientX - rect.left;
            let y = evt.clientY - rect.top;
            if (this.isFlipYcoord) {
                y = this.canvas.height - y;
            }
            return vec2.fromValues(x, y);
        }else {
            throw new Error("event.target is null");
        }
    }

    private _toCanvasMouseEvent(evt: Event, type: InputEventType): CanvasMouseEvent {
        let _event: MouseEvent = evt as MouseEvent;
        let _button = _event.button;
        if (type === InputEventType.MOUSEDOWN && _event.button === 2) {
            this._isMouseDown = true;
        }else if( type === InputEventType.MOUSEUP && _event.button === 2) {
            this._isMouseDown = false;
        }
        if (this._isMouseDown && type === InputEventType.MOUSEDRAG) {
            _button = 2;
        }
        let _mousePosition: vec2 = this.viewportToCanvasCoordinate(<MouseEvent>evt);
        return new CanvasMouseEvent(_event.altKey, _event.shiftKey, _event.ctrlKey, _button, _mousePosition, type);
    }

    private _toCanvasKeyboardEvent(evt: Event, type: InputEventType) {
        let _event: KeyboardEvent = evt  as KeyboardEvent;
        return new CanvasKeyBoardEvent(_event.altKey, _event.shiftKey, _event.ctrlKey, type, _event.key, _event.keyCode, false);
    }

    public handleEvent(evt: Event): void {
        switch (evt.type) {
            case "mousedown":
                this._isMouseDown = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt, InputEventType.MOUSEDOWN));
                break;
            case "mouseup":
                this._isMouseDown = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt, InputEventType.MOUSEUP));
                break;
            case "mousemove":
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt, InputEventType.MOUSEMOVE));
                }
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt, InputEventType.MOUSEDRAG))
                }
                break;
            case "keypress":
                this.dispatchKeyPress(this._toCanvasKeyboardEvent(evt, InputEventType.KEYPRESS));
                break;
            case "keyDown":
                this.dispatchKeyDown(this._toCanvasKeyboardEvent(evt, InputEventType.KEYDOWN));
                break;
            case "keyup":
                this.dispatchKeyup(this._toCanvasKeyboardEvent(evt, InputEventType.KEYUP));
                break;
            default:
                break;
        }
    }
    /**event dispatch */
    protected dispatchMouseDown(evt: CanvasMouseEvent) {}

    protected dispatchMouseUp(evt: CanvasMouseEvent) {}

    protected dispatchMouseMove(evt: CanvasMouseEvent) {}

    protected dispatchMouseDrag(evt: CanvasMouseEvent) {}

    protected dispatchKeyPress(evt: CanvasKeyBoardEvent) {}

    protected dispatchKeyDown(evt: CanvasKeyBoardEvent) {}

    protected dispatchKeyup(evt: CanvasKeyBoardEvent) {}

    public removeTimer(timerId: number):boolean {
        let found = false;
        for (let i = 0; i < this.timers.length; i++) {
            const timer = this.timers[i];
            if (timer.id === timerId) {
                found = true;
                timer.enabled = false;
                break;
            }
        }
        return found;
    }

    public addTimer(callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data: any = undefined): number {
        let timer: Timer;
        let found: boolean = false;
        for (let i = 0; i < this.timers.length; i++) {
            const timer = this.timers[i];
            if (!timer.enabled) {
                timer.callback = callback;
                timer.callbackData = data;
                timer.timeout = timeout;
                timer.countdown = timeout;
                timer.enabled = true;
                timer.onlyOnce = onlyOnce;
                return timer.id;
            }
        }
        timer = new Timer(callback);
        timer.callbackData = data;
        timer.timeout = timeout;
        timer.countdown = timeout;
        timer.timeout = timeout;
        timer.enabled = true;
        timer.id = ++this._timerId;
        return timer.id;
    }

    private _handleTimers(intervalSec: number): void {
        for (let i = 0; i < this.timers.length; i++) {
            const timer = this.timers[i];
            if (!timer.enabled) {
                continue;
            }
            timer.countdown -= intervalSec;
            if (timer.countdown < 0.0) {
                timer.callback(timer.id, timer.callbackData);
            }
            if (!timer.onlyOnce) {
                timer.countdown = timer.timeout
            }else {
                this.removeTimer(timer.id);
            }
        }
    }
}