import { mat4, vec3 } from "gl-matrix";
import { Application } from "./application";
import { MathExtends } from '../math/index'
import vs from '../shaders/shaderSource/default.vertex';
import fs from '../shaders/shaderSource/default.fragment';
import { ShaderCompilor, ShaderType } from "../shaders/shaderCompilor";
import { glProgram } from "../shaders/program";
import { TypedArrayList } from "../utils/dataStruct/typedArrayList";
import { GLHelper } from "../utils/glHelper";

export class BasicWebGLApplication extends Application {
    public gl: WebGLRenderingContext;

    public projectMatrix: mat4;
    public viewMatrix: mat4;
    public viewProjectMatrix: mat4;

    public shader_vs: string;
    public shader_fs: string;
    public vertexShader: WebGLShader;
    public fragmentShader: WebGLShader;
    public program: WebGLProgram;

    public vertices: TypedArrayList<Float32Array>;
    /** interleaved Array */
    public ivbo: WebGLBuffer;
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.shader_vs = vs;
        this.shader_fs = fs;
        this.projectMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.viewProjectMatrix = mat4.create();
        let contextAttributes: WebGLContextAttributes = {
            depth: true,
            stencil: true,
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
            preserveDrawingBuffer: false,
        }
        let ctx: WebGLRenderingContext | null = this.canvas.getContext("webgl2", contextAttributes);
        if (ctx === null) {
            throw new Error("could not create webGLRenderingContext");
        }
        this.gl = ctx;
        mat4.perspective(this.projectMatrix, MathExtends.DegreeToRadian(45), this.canvas.width / this.canvas.height, 0.1 ,100);
        mat4.lookAt(this.viewMatrix, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, -1), vec3.fromValues(0, 1, 0));
        mat4.multiply(this.viewProjectMatrix, this.projectMatrix, this.viewMatrix);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.scissor(0, 0, this.canvas.width, this.canvas.height);
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.vertexShader = ShaderCompilor.createShader(this.gl, ShaderType.VS_SHADER);
        this.fragmentShader = ShaderCompilor.createShader(this.gl, ShaderType.FS_SHADER);

        ShaderCompilor.compilorShader(this.gl, this.shader_vs, this.vertexShader);
        ShaderCompilor.compilorShader(this.gl, this.shader_fs, this.fragmentShader);

        this.program = glProgram.create(this.gl);
        glProgram.link(
            this.gl, 
            this.program, 
            this.vertexShader, 
            this.fragmentShader, 
            () => {console.log(`before link`)}, 
            () => { console.log(`after link`)}
        );

        this.vertices = new TypedArrayList(Float32Array, 6 * 7);
        this.ivbo = GLHelper.createBuffer(this.gl);
    }

    public drawRectByInterleavedVBO(){
        
    }
}