/**
 * This module provides functions for parsing and converting Garmin FIT files.
 * @packageDocumentation
 */

import { Decoder, FitFileContent, Stream } from '@garmin/fitsdk';

/**
 * Parses all FIT files in the specified data folder and returns an array of parsed FIT file contents.
 * @param dir - The path to the data folder containing the FIT files.
 * @returns A promise that resolves to an array of parsed FIT file contents.
 */
/* export async function parseFitFiles(dir = source): Promise<FitFileContent[]> {
    const files = await readdir(dir, { withFileTypes: true });
    const fitFilePaths = files
        .filter((f) => f.name.endsWith('.fit'))
        .map((f) => path.join(dir, f.name));

    return Promise.all(fitFilePaths.map(parseOneFitFile));
} */

/**
 * Converts a single FIT file's training data to a markdown format.
 * @param content - The parsed content of a FIT file.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function convertTraining({ messages, errors }: FitFileContent) {
    const author = '@fit-converter';
    const workoutName = messages.workoutMesgs[0].wktName.join(' | ').replaceAll(/\n/, '');
    console.log(`# ${workoutName}`);
    console.log(`## Author: ${author}`);
}

/**
 * Parses a single FIT file and returns its parsed content.
 * @param path - The path to the FIT file to parse.
 * @returns A promise that resolves to the parsed content of the FIT file.
 */
export async function parseOneFitFile(file: Buffer) {
    const stream = Stream.fromByteArray(file);
    const decoder = new Decoder(stream);
    return decoder.read();
}
