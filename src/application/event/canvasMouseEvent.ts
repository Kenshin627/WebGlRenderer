import { Vector2 } from "../../Math/Vector/Vector2";
import { CanvasInputEvent } from "./canvasInputEvent";
import { InputEventType, ButtonType } from "./types";

export class CanvasMouseEvent extends CanvasInputEvent {
    public button: ButtonType;
    public canvasPosition: Vector2;
    public constructor(altKey: boolean, shiftKey: boolean, ctrlKey: boolean, button: ButtonType, canvasPosition: Vector2, eventType: InputEventType){
        super(altKey, shiftKey, ctrlKey, eventType);
        this.button = button;
        this.canvasPosition = canvasPosition; 
    }   
}