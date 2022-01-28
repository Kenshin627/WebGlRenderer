export const enum ShaderType {
    VS_SHADER,
    FS_SHADER
}

export class ShaderCompilor {
    static createShader(gl: WebGLRenderingContext | null, type: ShaderType): WebGLShader {
        if (!gl) {
            throw  new Error('can not initial shaderProgram without webGLRenderingContext')
        }
        let shader: WebGLShader | null = null;
        if (type === ShaderType.VS_SHADER) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }else {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        if (shader === null) {
            throw new Error("webgl shader create fail");
        }
        return shader;
    }

    static compilorShader(gl: WebGLRenderingContext, code: string, shader: WebGLShader): boolean {
        gl.shaderSource(shader, code);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return false;
        }
        return true;
    }
}