/**
 * This module provides functions for parsing and converting Garmin FIT files.
 * @packageDocumentation
 */

import { Decoder, FitFileContent, Stream } from '@garmin-fit/sdk';
import { open, readdir } from 'fs/promises';
import path from 'path';
import { env } from 'process';

const source = env.DATA_FOLDER ?? './data';

/**
 * Parses all FIT files in the specified data folder and returns an array of parsed FIT file contents.
 * @returns A promise that resolves to an array of parsed FIT file contents.
 */
export async function parseFitFiles() {
    const files = await readdir(source, { withFileTypes: true });
    const fitFilePaths = files
        .filter((f) => f.name.endsWith('.fit'))
        .map((f) => path.join(source, f.name));

    return Promise.all(fitFilePaths.map(parseOneFitFile));
}

/**
 * Converts a single FIT file's training data to a markdown format.
 * @param content - The parsed content of a FIT file.
 */
export async function convertTraining({ messages, errors }: FitFileContent) {
    const author = env.WORKOUT_AUTHOR;
    const workoutName = messages.workoutMesgs[0].wktName.join(' | ').replaceAll(/\n/, '');
    console.log(`# ${workoutName}`);
    console.log(`## Author: ${author}`);
}

/**
 * Parses a single FIT file and returns its parsed content.
 * @param path - The path to the FIT file to parse.
 * @returns A promise that resolves to the parsed content of the FIT file.
 */
async function parseOneFitFile(path: string) {
    const fd = await open(path);
    const buffer = await fd.readFile();
    const stream = Stream.fromByteArray(buffer);
    const decoder = new Decoder(stream);
    return decoder.read();
}
