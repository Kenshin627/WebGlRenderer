import { GLAttribMap, GLUniformMap } from "../utils/types";
import { GLAttribBits } from "./webglAttribState";
import { ShaderCompilor, ShaderType } from '../shaders/shaderCompilor/index';
import { GLProgramCreator } from '../shaders/program/index';

export class GLProgram {
    /**uniforms */
    public static readonly ModelMatrix: string = "uModelMatrix";
    public static readonly ViewMatrix: string = "uViewMatrix";
    public static readonly MVMatrix: string = "uMVMatrix";
    public static readonly projectMatrix: string = "uProjectMatrix";
    public static readonly MVPMtrix: string = "uMVPMatrix";
    public static readonly NormalMatrix: string = "uNormalMatrix";
    public static readonly Color: string = "uColor";

    public static readonly Sampler: string = "uSampler";
    public static readonly DiffuseSampler: string = "uDiffuseSampler";
    public static readonly NormalSampler: string = "uNormalSampler";
    public static readonly SpecularSampler: string = "uSpecularSampler";
    public static readonly DepthSampler: string = "uDepthSampler";

    public gl: WebGLRenderingContext;
    public name: string;
    private _attribState: GLAttribBits;

    public program: WebGLProgram;
    public vsShader: WebGLShader;
    public fsShader: WebGLShader;

    public attribMap: GLAttribMap;
    public uniformsMap: GLUniformMap;

    public bindCallback:(program: GLProgram) => void | null;
    public unbindCallback: (program: GLProgram) => void | null;
    private _vsShaderDefineStrings: string[] = [];
    private _fsShaderDefineStrings: string[] = [];

    public get attribState(): GLAttribBits {
        return this._attribState;
    }

    public constructor(gl: WebGLRenderingContext, attribState: GLAttribBits, name: string, bindCallback: (program: GLProgram) => void | null = null, unbindCallback: (program: GLProgram) => void | null = null, vsShaderSource: string | null = null, fsShaderSource: string | null = null) {
        this.gl = gl;
        this._attribState = attribState;
        this.name = name;
        this.bindCallback = bindCallback;
        this.unbindCallback = unbindCallback;
        let shader: WebGLShader | null = null;
        try {
            shader = ShaderCompilor.createShader(this.gl, ShaderType.VS_SHADER);
            this.vsShader = shader;
        } catch (error) {
            throw error;
        }

        shader = null;
        try {
            shader = ShaderCompilor.createShader(this.gl, ShaderType.FS_SHADER);
            this.fsShader = shader;
        } catch (error) {
            throw error;
        }
        this.program = GLProgramCreator.create(this.gl);
        this.attribMap = {};
        this.uniformsMap = {};
        if (vsShaderSource !== null && fsShaderSource !== null) {
            this.loadShaders(vsShaderSource, fsShaderSource);
        }
    }

    public loadShaders(vsShaderSource: string, fsShaderSource: string): void {

    }
}