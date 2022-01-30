export class GLProgramCreator {
    static create(gl: WebGLRenderingContext): WebGLProgram {
        let program: WebGLProgram | null = gl.createProgram();
        if (!program) {
            throw new Error("create glProgram failed!");
        }
        return program;
    }

    static link(gl: WebGLRenderingContext, program: WebGLProgram, vsShader: WebGLShader, fsShader: WebGLShader, beforeLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null, afterLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void ) | null = null): boolean {
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);
        beforeLink && beforeLink(gl, program);

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            return false;
        }

        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            return false;
        }

        afterLink && afterLink(gl, program);
        return true;
    }
}