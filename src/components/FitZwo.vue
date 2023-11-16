<script setup lang="ts">
import { ref } from 'vue';

import { useFitZwoStore } from '@/stores/fitzwo';

const errors = ref<string[]>([]);

const fitZwoStore = useFitZwoStore();

async function handleUpload(event: Event) {
    try {
        const files = (event.target as HTMLInputElement).files;
        if (!files?.length) {
            errors.value.push('No file selected');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            await fitZwoStore.parseFitFile(files[i]);
        }
    } catch (error) {
        errors.value.push((error as Error).message);
    }
}

async function handleConvertClick() {
    await fitZwoStore.convertFitToZwo();
    return fitZwoStore.downloadZwoFiles();
}

</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">fit to zwo converter</h1>
            </div>
            <form class="mt-8 space-y-6">
                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file"
                           class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                 aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 20 16">
                                <path stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span class="font-semibold">Click to upload</span> or drag and drop
                            </p>
                        </div>
                        <input id="dropzone-file"
                               type="file"
                               accept=".fit"
                               multiple="true"
                               @change="handleUpload"
                               class="hidden" />
                    </label>
                </div>
                <button class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        @click="handleConvertClick"
                        :disabled="!fitZwoStore.numberOfParsedFiles">Convert</button>
            </form>
            <div v-if="!!fitZwoStore.numberOfParsedFiles">
                <p class="mt-2 text-center text-sm text-gray-600">
                    Successfully uploaded and parsed {{ fitZwoStore.numberOfParsedFiles }} files
                </p>
            </div>
            <div v-if="errors.length">
                <p class="mt-2 text-center text-sm text-red-600">
                    {{ errors.length }} errors occurred
                </p>
                <p v-for="error in errors" v-bind:key="error" class="mt-2 text-center text-sm text-red-600">
                    {{ error }}
                </p>
            </div>
        </div>
    </div>
</template>
@/helpers
