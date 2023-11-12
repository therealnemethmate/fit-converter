declare module '@garmin/fitsdk' {
    export class Decoder {
        constructor(stream: Stream);
        read(): FitFileContent;
    }
    
    export class Stream {
        static fromByteArray(buffer: Buffer): Stream;
        readByte(): number;
        readBytes(length: number): Buffer;
        readUInt8(): number;
        readUInt16(): number;
        readUInt32(): number;
        readUInt64(): number;
        readSInt8(): number;
        readSInt16(): number;
        readSInt32(): number;
        readSInt64(): number;
        readFloat32(): number;
        readFloat64(): number;
        readString(length: number): string;
        readBool(): boolean;
        readBits(count: number): number;
        readByteOffset(): number;
        readBitsLeft(): number;
        seek(offset: number): void;
        skip(offset: number): void;
        atEnd(): boolean;
    }
}
  
