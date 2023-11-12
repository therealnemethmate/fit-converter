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
