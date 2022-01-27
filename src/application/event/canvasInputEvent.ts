import { InputEventType } from "./types";

export class CanvasInputEvent {
    public altKey: boolean;
    public shiftKey: boolean;
    public ctrlKey: boolean;
    public type: InputEventType;

    public constructor(altKey: boolean, shiftKey: boolean, ctrlKey: boolean, type: InputEventType) {
        this.altKey = altKey;
        this.shiftKey = shiftKey;
        this.ctrlKey = ctrlKey;
        this.type = type;
    }
}