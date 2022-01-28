import { vec2 } from "gl-matrix";
import { CanvasInputEvent } from "./canvasInputEvent";
import { InputEventType, ButtonType } from "./types";

export class CanvasMouseEvent extends CanvasInputEvent {
    public button: ButtonType;
    public canvasPosition: vec2;
    public constructor(altKey: boolean, shiftKey: boolean, ctrlKey: boolean, button: ButtonType, canvasPosition: vec2, eventType: InputEventType){
        super(altKey, shiftKey, ctrlKey, eventType);
        this.button = button;
        this.canvasPosition = canvasPosition; 
    }   
}