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
}