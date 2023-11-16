import { HrZones, isHRTargetType, WorkoutStep } from '@fit-converter/fit-sdk';

import { isString } from '@/helpers';

const heartRateToPowerMap: { [K in HrZones]: number }= {
    1: 0.5,
    2: 0.65,
    3: 0.75,
    4: 0.9,
    5: 1.1,
    6: 1.3,
};

/**
 * Convert duration to seconds
 * Falls back to durationValue if durationTime is not set
 * @param step 
 * @returns 
 */
export function convertDuration(step: WorkoutStep) {
    return step.durationTime ?? (step.durationValue ? (step.durationValue / 1000) : undefined);
}

/**
 * Converts workout name to file name with prefix
 * @param workoutName
 * @param prefix
 * 
 */
export function convertFileName(workoutName: string | string[], prefix?: string) {
    return `${prefix ? `${prefix}_` : ''}${getWorkoutNameString(workoutName)
        .replace(/\n/g, '')
        .toLocaleLowerCase()
        .trimEnd()
        .replaceAll(' ', '_')}`;
}

/**
 * Converts workout name for Zwift and prefixes it
 * 
 * @param workoutName
 * @param prefix
 */
export function convertWorkoutName(workoutName: string | string[], prefix?: string) {
    return `${prefix ? `${prefix} ` : ''}${getWorkoutNameString(workoutName).replace(/\n/g, '')}`;
}

/**
 * Converts heart rate zone to power rate
 * @param step
 */
export function convertHRToPowerRate(step: WorkoutStep) {
    if (!isHRTargetType(step)) return;
    return heartRateToPowerMap[step.targetHrZone];
}

/**
 * Returns workout name as string
 * @param workoutName
 */
function getWorkoutNameString(workoutName: string | string[]) {
    return isString(workoutName) ? workoutName : workoutName[0];
}
