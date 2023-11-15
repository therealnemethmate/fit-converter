import { WorkoutStep } from '@fit-converter/fit-sdk';
import { Buffer } from 'buffer';
import { downloadZip, InputWithSizeMeta } from 'client-zip';

/**
 * Reads a file as buffer
 * @param file 
 * @returns 
 */
export async function readBuffer(file: File) {
    const stream = file.stream();
    const content = await stream.getReader().read();
    return Buffer.from(content.value?.buffer as ArrayBuffer);
}

export async function downloadAsZip(contents: InputWithSizeMeta[]) {
    const blob = await downloadZip(contents).blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fit-converter-zwo.zip';
    link.click();
}

export function convertDuration(step: WorkoutStep) {
    return step.durationTime ?? (step.durationValue ? (step.durationValue / 1000) : undefined);
}

export function convertFileName(workoutName: string | string[], prefix?: string) {
    return `${prefix ? `${prefix}_` : ''}${getWorkoutNameString(workoutName)
        .replace(/\n/g, '')
        .toLocaleLowerCase()
        .trimEnd()
        .replaceAll(' ', '_')}`;
}

export function convertWorkoutName(workoutName: string | string[], prefix?: string) {
    return `${prefix ? `${prefix} ` : ''}${getWorkoutNameString(workoutName).replace(/\n/g, '')}`;
}

function getWorkoutNameString(workoutName: string | string[]) {
    return isString(workoutName) ? workoutName : workoutName[0];
}

function isString(value: unknown): value is string {
    return typeof value === 'string';
}
