<script setup lang="ts">
import { parseOneFitFile } from '@fit-converter/fit-sdk';
import { FitFileContent } from '@fit-converter/fit-sdk';
import { Buffer } from 'buffer';
import { ref } from 'vue';

const fitFile = ref<FitFileContent>();

async function readBuffer(file: File) {
    const stream = file.stream();
    const content = await stream.getReader().read();
    return Buffer.from(content.value?.buffer as ArrayBuffer);
}

async function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
        console.error('No file selected');
        return;
    }

    const buffer = await readBuffer(file);
    fitFile.value = await parseOneFitFile(buffer);
}

async function convertToZwo() {
    if (!fitFile.value) {
        console.error('No file selected');
        return;
    }

    alert('TODO convertToZwo');
}

</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">FitZwo</h1>
            </div>
            <form class="mt-8 space-y-6"
                  action="#"
                  method="POST">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div class="py-4 ">
                        <label for="file-upload"
                               class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload"
                                   name="file-upload"
                                   type="file"
                                   class="sr-only"
                                   @change="handleUpload">
                        </label>
                    </div>
                </div>
                <button class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        @click="convertToZwo" :disabled="!fitFile">Convert</button>
            </form>
            <div>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Workout name: {{ fitFile?.messages.workoutMesgs[0].wktName[0] }}
                </p>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Workout durationTypes: {{ fitFile?.messages.workoutStepMesgs.map((step) => step.durationType).join(', ') }}
                </p>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Workout intensities: {{ fitFile?.messages.workoutStepMesgs.map((step) => step.intensity).join(', ') }}
                </p>
            </div>
        </div>
    </div>
</template>
