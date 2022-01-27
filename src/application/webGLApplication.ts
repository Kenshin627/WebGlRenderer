import { Application } from "./application";

export class webGLApplication extends Application {
   public gl: WebGLRenderingContext;
   protected canvas2D: HTMLCanvasElement | null = null;
   protected ctx2D: CanvasRenderingContext2D | null = null; 
}