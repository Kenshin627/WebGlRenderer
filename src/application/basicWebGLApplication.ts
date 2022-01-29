import { mat4, vec3 } from "gl-matrix";
import { Application } from "./application";
import { MathExtends } from '../math/index'
import vs from '../shaders/shaderSource/default.vertex';
import fs from '../shaders/shaderSource/default.fragment';
import { ShaderCompilor, ShaderType } from "../shaders/shaderCompilor";
import { glProgram } from "../shaders/program";
import { TypedArrayList } from "../utils/dataStruct/typedArrayList";
import { GLHelper } from "../utils/glHelper";
import { GLAttribMap, GLUniformMap } from "../utils/types";
import { GLCoordSystem } from "../webgl/webglCoordSystem";

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

    public attriMap: GLAttribMap;
    public uniformsMap: GLUniformMap;

    public glCoordSystems: GLCoordSystem[];
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.glCoordSystems = GLCoordSystem.makeViewPortCoordSystems(this.canvas.width, this.canvas.height, 3, 3);
        this.shader_vs = vs;
        this.shader_fs = fs;
        this.projectMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.viewProjectMatrix = mat4.create();
        // this.attriMap 
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
        mat4.lookAt(this.viewMatrix, vec3.fromValues(0, 0, 5), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0) );
        mat4.multiply(this.viewProjectMatrix, this.projectMatrix, this.viewMatrix);
        // this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        // this.gl.scissor(0, 0, this.canvas.width, this.canvas.height);
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

        this.attriMap = {};
        this.uniformsMap = {};
    }

    /**
     * 
     * @param {} mode POINT LINES LINE_LOOP LINE_STRIP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP
     * @param first 
     * @param count 
     */
    public drawRectByInterleavedVBO(mode: GLenum, first: GLint, count: GLsizei): void{
        this.vertices.clear();
        let data: number[];
        if (mode === this.gl.TRIANGLES) {
            data = [
                -0.5, -0.5, 0, 1, 0, 0, 1,
                0.5, -0.5, 0, 0, 1, 0 , 1,
                0.5, 0.5, 0, 0, 0, 1, 1,
                0.5, 0.5, 0, 0, 0, 1, 1,
                -0.5, 0.5, 0, 0, 1, 0, 1,
                -0.5, -0.5, 0, 1, 0, 0, 1
            ]
        }else if(mode === this.gl.TRIANGLE_STRIP) {
            data = [
                -0.5, 0.5, 0, 0, 1, 0, 1,
                -0.5, -0.5, 0, 1, 0, 0, 1,
                0.5, 0.5, 0, 0, 0, 1, 0,
                0.5, -0.5, 0, 0, 1, 0, 1
            ]
        }else {
            data = [
                -0.5, -0.5, 0, 1, 0, 0, 1,
                0.5, -0.5, 0, 0, 1, 0, 1,
                0.5, 0.5, 0, 0, 0, 1, 0,
                -0.5, 0.5, 0, 0, 1, 0, 1,
            ]
        }
        
        if (mode === this.gl.POINTS) {
            
        }

        this.vertices.pushArray(data);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ivbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices.subArray(), this.gl.DYNAMIC_DRAW);
        GLHelper.getProgramActiveAttribs(this.gl, this.program, this.attriMap);
        GLHelper.getProgramActiveUniforms(this.gl, this.program, this.uniformsMap);
        this.gl.vertexAttribPointer(this.attriMap["aPosition"].location, 3, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
        this.gl.vertexAttribPointer(this.attriMap["aColor"].location, 4, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 12);
        this.gl.enableVertexAttribArray(this.attriMap["aPosition"].location);
        this.gl.enableVertexAttribArray(this.attriMap["aColor"].location);

        this.gl.useProgram(this.program);
        let mat = mat4.create();
        mat4.scale(mat, this.viewProjectMatrix, vec3.fromValues(2, 2, 2));

        this.gl.uniformMatrix4fv(this.uniformsMap["uMVPMatrix"].location, false, Array.from(mat.values()));
        this.gl.drawArrays(mode, first, count);

        this.gl.useProgram(null);
        this.gl.disableVertexAttribArray(this.attriMap["aPosition"].location);
        this.gl.disableVertexAttribArray(this.attriMap["aColor"].location);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    public render(): void {
        this.render9Viewports();
        // this.drawRectByInterleavedVBO(0)
    }

    public render9Viewports(): void {
        GLHelper.setViewport( this.gl, this.glCoordSystems[ 0 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.TRIANGLES,0 ,6);

        GLHelper.setViewport( this.gl, this.glCoordSystems[ 1 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.TRIANGLES, 0, 6);

        GLHelper.setViewport( this.gl, this.glCoordSystems[ 2 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.TRIANGLES, 3, 3);

        // 从下到上第二列
        GLHelper.setViewport( this.gl, this.glCoordSystems[ 3 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.TRIANGLE_FAN, 0, 4);

        GLHelper.setViewport( this.gl, this.glCoordSystems[ 4 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.TRIANGLE_STRIP, 0, 4);

        GLHelper.setViewport( this.gl, this.glCoordSystems[ 5 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.POINTS, 0, 4 );

        // 从下到上第三列
        GLHelper.setViewport( this.gl, this.glCoordSystems[ 6 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.LINE_STRIP, 0, 4);

        GLHelper.setViewport( this.gl, this.glCoordSystems[ 7 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.LINE_LOOP, 0, 4);

        GLHelper.setViewport( this.gl, this.glCoordSystems[ 8 ].viewport );
        this.drawRectByInterleavedVBO(this.gl.LINES, 0, 4);
    }
}