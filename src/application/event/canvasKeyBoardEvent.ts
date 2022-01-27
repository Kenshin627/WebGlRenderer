import { CanvasInputEvent } from "./canvasInputEvent";
import { InputEventType } from "./types";

export class CanvasKeyBoardEvent extends CanvasInputEvent {
    public key: string;
    public keyCode: number;
    public repeat: boolean;
    public constructor(altKey: boolean, shiftKey: boolean, ctrlKey: boolean, eventType: InputEventType, key: string, keyCode: number, repeat: boolean) {
        super(altKey, shiftKey, ctrlKey,eventType);
        this.key = key;
        this.keyCode = keyCode;
        this.repeat = repeat;
    }
}