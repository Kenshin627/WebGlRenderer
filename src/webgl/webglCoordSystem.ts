import { vec3 } from "gl-matrix";

export class GLCoordSystem {
    public viewport: number[] = [];
    public axis: vec3;
    public angle: number;
    public pos: vec3;
    public isDrawAxis: boolean;
    public isD3D: boolean;

    public constructor(viewport: number[], pos: vec3 = vec3.fromValues(0, 0, 0), axis: vec3 = vec3.fromValues(0, 1, 0), angle: number = 0, isDrawAxis: boolean = false, isD3D: boolean = false) {
        this.viewport = viewport;
        this.angle = angle;
        this.axis = axis;
        this.pos = pos;
        this.isDrawAxis = isDrawAxis;
        this.isD3D = isD3D;
    }

    public static makeViewPortCoordSystems (width: number, height: number, row: number = 2, column: number = 2): GLCoordSystem[] {
        let coords: GLCoordSystem[] = [];
        let w: number= width / column;
        let h: number = height / row;
        for (let i = 0; i < column; i++) {
           for (let j = 0; j < row; j++) {
               coords.push(new GLCoordSystem( [ i * w, j * h, w, h ]));            
           }            
        }
        return coords;
    }
}