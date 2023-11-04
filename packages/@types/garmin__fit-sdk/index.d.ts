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
        
    export type FitFileContent = {
        messages: Messages;
        errors: unknown;
    }
    
    export type Messages = {
        workoutMesgs: WorkoutMessages[];
        workoutStepMesgs: WorkoutStep[];
    }
    
    export type WorkoutMessages = {
        wktName: string[];
    }
    
    export type WorkoutStep = {
        durationValue: number;
        targetValue: number;
        messageIndex: 0;
        durationType: DurationType;
        targetType: TargetType;
        intensity: Intensity;
        durationTime?: number;
        targetHrZone?: HrZones;
    }
    
    export enum DurationType {
        Time = 'time',
        UntilStepsCompleted = 'repeatUntilStepsCmplt',
    }
    
    export enum TargetType {
        Open = 'open',
        HeartRate = 'heartRate',
    }
    
    export enum Intensity {
        Active = 'active',
        Recovery = 'recovery',
    }
    
    export type HrZones = 1 | 2 | 3 | 4 | 5 | 6;
}
  
