export class TypedArrayList<T extends Uint16Array | Uint8Array | Float32Array> {
    private _array: T;
    private _typedArrayConstructor: (new (length: number) => T);
    private _length: number;
    private _capacity: number;

    public capacityChangedCallback: ((arrayList: TypedArrayList<T>) => void) | null = null;

    public constructor(typedArrayConstructor: new (capacity: number) => T, capacity: number = 8, capacityChangedCallback: ((arrayList: TypedArrayList<T>) => void) = null) {
        this._typedArrayConstructor = typedArrayConstructor;
        this.capacityChangedCallback = capacityChangedCallback;
        this._capacity = capacity;
        if (this._capacity === 0) {
            this._capacity = 8;
        }
        this._array = new this._typedArrayConstructor(this._capacity);
        this._length = 0;
    }

    public push(num: number): number {
        if (this._length >= this._capacity) {
            if (this._capacity > 0) {
                this._capacity += this._capacity;
                let oldArray: T = this._array;
                this._array = new this._typedArrayConstructor(this._capacity);
                this._array.set(oldArray);
                this.capacityChangedCallback && this.capacityChangedCallback(this);
            }
        }
        this._array[ this._length ++ ] = num;
        return this._length;
    }

    public subArray(start: number = 0, end: number = this.length): T{
        return this._array.subarray(start, end) as T;
    }

    public slice(start: number = 0, end: number = this.length): T {
        return this._array.slice(start, end) as T;
    }

    public get length(): number {
        return this._length;
    }

    public get capacity(): number {
        return this._capacity;
    }

    public get typeArray(): T {
        return this._array;
    }

    public clear(): void {
        this._length == 0;
    }

    public at(idx: number): number {
        if (idx < 0 || idx >= this.length) {
            throw new Error('索引越界')
        }
        let ret: number = this._array[idx];
        return ret;
    }

}