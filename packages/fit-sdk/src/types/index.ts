export type FitFileContent = {
    messages: Messages;
    errors: unknown[];
}

export type Messages = {
    workoutMesgs: WorkoutMessages[];
    fileIdMesgs: FileIdMessages[];
    workoutStepMesgs: WorkoutStep[];
}

export type FileIdMessages = {
    garminProduct: string;
    manufacturer: string;
    product: number;
    serialNumber: number;
    timeCreated: Date;
    type: string;
}

export type WorkoutMessages = {
    wktName: string | string[];
}

export type WorkoutStep = {
    durationValue?: number;
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
    Open = 'open',
}

export enum TargetType {
    Open = 'open',
    HeartRate = 'heartRate',
}

export enum Intensity {
    Warmup = 'warmup',
    Active = 'active',
    Recovery = 'recovery',
}

export type HrZones = 1 | 2 | 3 | 4 | 5 | 6;
