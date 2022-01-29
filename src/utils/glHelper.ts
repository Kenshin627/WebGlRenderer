import { GLAttribInfo, GLAttribMap, GLUniformInfo, GLUniformMap } from "./types";

export class GLHelper {
    public static printStates(gl: WebGLRenderingContext | null): void {
        if (gl === null) {
            return;
        }
        console.log(`1. isBlendEnable: ${gl.isEnabled(gl.BLEND)}`);
        console.log(`2. isCullFaceEnable: ${gl.isEnabled(gl.CULL_FACE)}`);
        console.log(`3. isDepthTestEnable: ${gl.isEnabled(gl.DEPTH_TEST)}`);
        console.log(`4. isDitherEnable: ${gl.isEnabled(gl.DITHER)}`);
        console.log(`5. isPolygonOffsetFillEnable: ${gl.isEnabled(gl.POLYGON_OFFSET_FILL)}`);
        console.log(`6. isSampleAlphatToCverageEnable: ${gl.isEnabled(gl.SAMPLE_ALPHA_TO_COVERAGE)}`);
        console.log(`7. isSampleCoverageEnable: ${gl.isEnabled(gl.SAMPLE_COVERAGE)}`);
        console.log(`8. isSissorTestEnable: ${gl.isEnabled(gl.SCISSOR_TEST)}`);
        console.log(`9. isStencilTestEnable: ${gl.isEnabled(gl.STENCIL_TEST)}`);    
    }

    public static printWebGLInfo(gl: WebGLRenderingContext | null): void {
        console.log(`1. renderer: ${gl.getParameter(gl.RENDERER)}`);
        console.log(`2. version: ${gl.getParameter(gl.VERSION)}`);
        console.log(`3. vendor: ${gl.getParameter(gl.VENDOR)}`);
        console.log(`4. glsl version: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);
    }

    public static createBuffer(gl: WebGLRenderingContext): WebGLBuffer {
        let buffer: WebGLBuffer | null = gl.createBuffer();
        if (buffer === null) {
            throw new Error("create webgl buffer failed!")
        }
        return buffer;
    }

    public static getProgramActiveAttribs(gl: WebGLRenderingContext, program: WebGLProgram, out: GLAttribMap): void {
        let  attributsCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributsCount; i++) {
           let info: WebGLActiveInfo | null = gl.getActiveAttrib(program, i);
           if (info) {
               out[info.name] = new GLAttribInfo(info.size, info.type, gl.getAttribLocation(program, info.name));
           }
        }
    }

    public static getProgramActiveUniforms(gl: WebGLRenderingContext, program: WebGLProgram, out: GLUniformMap): void {
        let uniformsCount: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformsCount; i++) {
            let info: WebGLActiveInfo | null = gl.getActiveUniform(program, i);
            if (info) {
                let loc: WebGLUniformLocation | null = gl.getUniformLocation(program, info.name);
                if (loc) {
                    out[info.name] = new GLUniformInfo(info.size, info.type, loc);
                }
            }
        }
    }

    public static setViewport(gl: WebGLRenderingContext, v: number[] ): void {
        gl.viewport(v[0], v[1], v[2], v[3]);
    }
}