export enum EGLSLESDataType {
    FLOAT_VEC2 = 0x8B50,
    FLOAT_VEC3,
    FLOAT_VEC4,
    INT_VEC2,
    INT_VEC3,
    INT_VEC4,
    BOOL,
    BOOL_VEC2,
    BOOL_VEC3,
    BOOL_VEC4,
    FLOAT_MAT2,
    FLOAT_MAT3,
    FLOAT_MAT4,
    SAMPLER_2D,
    SAMPLER_CUBE,
    FLOAT = 0x1406,
    INT = 0x1404
}

export class GLAttribInfo {
    public size: number;
    public type: EGLSLESDataType;
    public location: number;
    public constructor(size: number, type: number, loc: number){
        this.size = size;
        this.type = type;
        this.location = loc;
    }
}

export class GLUniformInfo {
    public size: number;
    public type: EGLSLESDataType;
    public location: WebGLUniformLocation;
    public constructor(size: number, type: number, loc: WebGLUniformLocation) {
        this.size = size;
        this.type = type;
        this.location = loc;
    }
}

export interface GLAttribMap {
    [idx: string]: GLAttribInfo
}

export interface GLUniformMap {
    [idx: string]: GLUniformInfo
}