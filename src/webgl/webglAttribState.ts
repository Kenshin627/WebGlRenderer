export type GLAttribBits = number;
export type GLAttribBit  = "POSITION_BIT" | "TEXCOORD_BIT" | "TEXCOORD1_BIT" | "TEXCOORD2_BIT" | "NORMAL_BIT" | "TANGENT_BIT" | "COLOR_BIT";
export type GLAttribOffsetMap = {
    [key: string]: number
}

export class GLAttribState {
    /**POSITION */
    public static readonly POSITION_COMPONENT: number = 3;
    public static readonly POSITION_NAME: string = "aPosition";
    public static readonly POSITION_LOCALTION: number = 0;
    public static readonly POSITION_BIT: number = (1 << this.POSITION_LOCALTION);

    /**TEXCOORD */
    public static readonly TEXCOORD_COMPONENT: number = 2;
    public static readonly TEXCOORD_NAME: string = "aTexCoord";
    public static readonly TEXCOORD_LOCALTION: number = 1;
    public static readonly TEXCOORD_BIT: number = (1 << this.TEXCOORD_LOCALTION);

    /**TEXCOORD1 */
    public static readonly TEXCOORD1_COMPONENT: number = 2;
    public static readonly TEXCOORD1_NAME: string = "aTexCoord2";
    public static readonly TEXCOORD1_LOCALTION: number = 2;
    public static readonly TEXCOORD1_BIT: number = (1 << this.TEXCOORD1_LOCALTION);

    /**TEXCOORD2 */
    public static readonly TEXCOORD2_COMPONENT: number = 2;
    public static readonly TEXCOORD2_NAME: string = "aTexCoord3";
    public static readonly TEXCOORD2_LOCALTION: number = 3;
    public static readonly TEXCOORD2_BIT: number = (1 << this.TEXCOORD2_LOCALTION);

    /**NORMAL */
    public static readonly NORMAL_COMPONENT: number = 3;
    public static readonly NORMAL_NAME: string = "aNormal";
    public static readonly NORMAL_LOCALTION: number = 4;
    public static readonly NORMAL_BIT: number = (1 << this.NORMAL_LOCALTION);   
    
    /**TANGENT */
    public static readonly TANGENT_COMPONENT: number = 4;
    public static readonly TANGENT_NAME: string = "aTangent";
    public static readonly TANGENT_LOCALTION: number = 5;
    public static readonly TANGENT_BIT: number = (1 << this.TANGENT_LOCALTION);   
     
    /**COLOR */
    public static readonly COLOR_COMPONENT: number = 4;
    public static readonly COLOR_NAME: string = "aColor";
    public static readonly COLOR_LOCALTION: number = 6;
    public static readonly COLOR_BIT: number = (1 << this.COLOR_LOCALTION);   

    public static readonly FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
    public static readonly UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT;

    public static readonly ATTRIBSTRIDE: string = "STRIDE";
    public static readonly ATTRIBBYTELENGTH: string = "BYTELENGTH";

    public static makeVertexAttribs(useTexcoord: boolean, useTexcoord1: boolean, useTexcoord2: boolean, useNormal: boolean, useTangent: boolean, useColor: boolean){
        let bits: GLAttribBits = GLAttribState.POSITION_BIT;
        useTexcoord && (bits |= GLAttribState.TEXCOORD_BIT);
        useTexcoord1 && (bits |= GLAttribState.TEXCOORD1_BIT);
        useTexcoord2 && (bits |= GLAttribState.TEXCOORD2_BIT);
        useNormal && (bits |= GLAttribState.NORMAL_BIT);
        useTangent && (bits |= GLAttribState.TANGENT_BIT);
        useColor && (bits |= GLAttribState.COLOR_BIT);
        return bits;
    }

    public static hasAttribute(attribBits: GLAttribBits, attribute: GLAttribBit): boolean {
        return (attribBits & GLAttribState[attribute]) !== 0;
    }

    /**交叉存储 */
    public static getInterleavedLayoutOffsetMap(attribBits: GLAttribBits): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {};
        let byteOffset: number = 0;
        if (GLAttribState.hasAttribute(attribBits, "POSITION_BIT")) {
            offsets[GLAttribState.POSITION_NAME] = byteOffset;
            byteOffset += GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD_BIT")) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD1_BIT")) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD2_BIT")) {
            offsets[GLAttribState.TEXCOORD2_NAME] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD2_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "NORMAL_BIT")) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
            byteOffset += GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TANGENT_BIT")) {
            offsets[GLAttribState.TANGENT_NAME] = byteOffset;
            byteOffset += GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "COLOR_BIT")) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
            byteOffset += GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        offsets[this.ATTRIBSTRIDE] = byteOffset;
        offsets[this.ATTRIBBYTELENGTH] = byteOffset;
        return offsets;
    }

    /**
     * 顺序存储
     * "POSITION_BIT" | "TEXCOORD_BIT" | "TEXCOORD1_BIT" | "TEXCOORD2_BIT" | "NORMAL_BIT" | "TANGENT_BIT" | "COLOR_BIT";
     * @param attribBits 
     * @param vertCount 
     */
    public static getSequeueLayoutOffsetMap(attribBits: GLAttribBits, vertCount: number): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {};
        let byteOffset: number = 0;
        if (GLAttribState.hasAttribute(attribBits, "POSITION_BIT")) {
            offsets[GLAttribState.POSITION_NAME] = 0;
            byteOffset += vertCount * GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD_BIT")) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD1_BIT")) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD2_BIT")) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD2_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "NORMAL_BIT")) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TANGENT_BIT")) {
            offsets[GLAttribState.TANGENT_BIT] = byteOffset;
            byteOffset += vertCount * GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "COLOR_BIT")) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        offsets[GLAttribState.ATTRIBSTRIDE] = byteOffset / vertCount;
        offsets[GLAttribState.ATTRIBBYTELENGTH] = byteOffset;
        return offsets;
    }

    /**
     * 分开存储
     * @param attribBits 
     */
    public static getSepratedLayoutAttribOffsetMap(attribBits: GLAttribBits): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {};
        let byteOffset = 0;
        if (GLAttribState.hasAttribute(attribBits, "POSITION_BIT")) {
            offsets[GLAttribState.POSITION_NAME] = byteOffset;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD_BIT")) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD1_BIT")) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD2_BIT")) {
            offsets[GLAttribState.TEXCOORD2_NAME] = byteOffset;
        }
        if (GLAttribState.hasAttribute(attribBits, "NORMAL_BIT")) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
        }
        if (GLAttribState.hasAttribute(attribBits, "TANGENT_BIT")) {
            offsets[GLAttribState.TANGENT_NAME] = byteOffset;
        }
        if (GLAttribState.hasAttribute(attribBits, "COLOR_BIT")) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
        }
        return offsets;
    }

    public static getVertexByteStride(attribBits: GLAttribBits): number {
        let byteOffset: number = 0;
        if (GLAttribState.hasAttribute(attribBits, "POSITION_BIT")) {
            byteOffset += GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD_BIT")) {
            byteOffset += GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD1_BIT")) {
            byteOffset += GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TEXCOORD2_BIT")) {
            byteOffset += GLAttribState.TEXCOORD2_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "NORMAL_BIT")) {
            byteOffset += GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "TANGENT_BIT")) {
            byteOffset += GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasAttribute(attribBits, "COLOR_BIT")) {
            byteOffset += GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        return byteOffset;
    }

    public static setAttribVertexArrayPointer(gl: WebGLRenderingContext, offsetMap: GLAttribOffsetMap): void {
        let stride: number = offsetMap[ GLAttribState.ATTRIBSTRIDE ];
        if ( stride === 0 )
        {
            throw new Error( "vertex Array error!" );
        }

        // sequenced的话stride为0
        if ( stride !== offsetMap[ GLAttribState.ATTRIBBYTELENGTH ] )
        {
            stride = 0;
        }

        if ( stride === undefined )
        {
            stride = 0;
        }

        let offset: number = offsetMap[ GLAttribState.POSITION_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.POSITION_LOCALTION, GLAttribState.POSITION_COMPONENT, gl.FLOAT, false, stride, offset);
        }

        offset = offsetMap[ GLAttribState.TEXCOORD_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TEXCOORD_LOCALTION, GLAttribState.TEXCOORD_COMPONENT, gl.FLOAT, false, stride, offset);
        }

        offset = offsetMap[ GLAttribState.TEXCOORD1_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TEXCOORD1_LOCALTION, GLAttribState.TEXCOORD1_COMPONENT, gl.FLOAT, false, stride, offset);
        }

        offset = offsetMap[ GLAttribState.TEXCOORD2_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TEXCOORD2_LOCALTION, GLAttribState.TEXCOORD2_COMPONENT, gl.FLOAT, false, stride, offset);
        }

        offset = offsetMap[ GLAttribState.NORMAL_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.NORMAL_LOCALTION, GLAttribState.NORMAL_COMPONENT, gl.FLOAT, false, stride, offset);
        }

        offset = offsetMap[ GLAttribState.TANGENT_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TANGENT_LOCALTION, GLAttribState.TANGENT_COMPONENT, gl.FLOAT, false, stride, offset);
        }
   

        offset = offsetMap[ GLAttribState.COLOR_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.COLOR_LOCALTION, GLAttribState.COLOR_COMPONENT, gl.FLOAT, false, stride, offset);
        }
    }

    public static setAttribVertexArrayState(gl: WebGLRenderingContext, attribBits: GLAttribBits, enable: boolean = true): void {
        if (GLAttribState.hasAttribute(attribBits, "POSITION_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.POSITION_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.POSITION_LOCALTION)
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.POSITION_LOCALTION);
        }

        if (GLAttribState.hasAttribute(attribBits,"TEXCOORD_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TEXCOORD_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.TEXCOORD_LOCALTION);
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.TEXCOORD_LOCALTION)
        }

        if (GLAttribState.hasAttribute(attribBits,"TEXCOORD1_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TEXCOORD1_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.TEXCOORD1_LOCALTION);
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.TEXCOORD1_LOCALTION)
        }

        if (GLAttribState.hasAttribute(attribBits,"TEXCOORD2_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TEXCOORD2_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.TEXCOORD2_LOCALTION);
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.TEXCOORD2_LOCALTION)
        }

        if (GLAttribState.hasAttribute(attribBits,"NORMAL_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.NORMAL_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.NORMAL_LOCALTION);
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.NORMAL_LOCALTION)
        }

        if (GLAttribState.hasAttribute(attribBits,"TANGENT_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TANGENT_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.TANGENT_LOCALTION);
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.TANGENT_LOCALTION)
        }

        if (GLAttribState.hasAttribute(attribBits,"COLOR_BIT")) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.COLOR_LOCALTION);
            }else {
                gl.disableVertexAttribArray(GLAttribState.COLOR_LOCALTION);
            }
        }else {
            gl.disableVertexAttribArray(GLAttribState.COLOR_LOCALTION)
        }
    }

    public static isAttribStateValid(attribBits: GLAttribBits): boolean {
        if (!GLAttribState.hasAttribute(attribBits,"POSITION_BIT")) {
            return false;
        }
        if (GLAttribState.hasAttribute(attribBits, "TANGENT_BIT")) {
            if (!GLAttribState.hasAttribute(attribBits, "TEXCOORD_BIT")) {
                return false;
            }
            if (!GLAttribState.hasAttribute(attribBits, "NORMAL_BIT")) {
                return false;
            }
        }
        return true;
    }
}