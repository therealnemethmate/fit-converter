/**
 * This module provides functions for parsing and converting Garmin FIT files.
 * @packageDocumentation
 */

import { Decoder, Stream } from '@garmin/fitsdk';

import { FitFileContent, HrZones, TargetType, WorkoutStep } from './types';

/**
 * Parses a single FIT file and returns its parsed content.
 * @param path - The path to the FIT file to parse.
 * @returns A promise that resolves to the parsed content of the FIT file.
 */
export async function parseOneFitFile(file: Buffer): Promise<FitFileContent> {
    const stream = Stream.fromByteArray(file);
    const decoder = new Decoder(stream);
    return decoder.read();
}

export function isHRTargetType(step: WorkoutStep): step is WorkoutStep & { targetHrZone: HrZones } {
    return step.targetType === TargetType.HeartRate;
}

export * from './types';
