<script setup lang="ts">
import { DurationType, FitFileContent, Intensity, isHRTargetType, parseOneFitFile, WorkoutStep } from '@fit-converter/fit-sdk';
import { ZwoBuilder } from '@fit-converter/zwo-sdk';
import { InputWithSizeMeta } from 'client-zip';
import { ref } from 'vue';

import { downloadAsZip, readBuffer } from '@/utils';

const fitFiles = ref<FitFileContent[]>([]);
const zwoBuilder = ref<ZwoBuilder>();
const zwoFileContents = ref<InputWithSizeMeta[]>([]);

async function handleUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) {
        console.error('No file selected');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (!file) continue;
        const buffer = await readBuffer(file);
        const readFile = await parseOneFitFile(buffer);
        fitFiles.value.push(readFile);
    }
}

async function handleConvertAll() {
    if (!fitFiles.value?.length) {
        console.error('No file uploaded');
        return;
    }

    for (const fitFile of fitFiles.value) {
        const input = await convertOne(fitFile);
        if (!input) continue;
        const name = `${fitFile.messages.workoutMesgs[0].wktName.join('_').toLocaleLowerCase().replaceAll(' ', '_')}.zwo`;
        if (zwoFileContents.value.find((file) => file.name === name)) {
            console.warn('Skipped duplicate file', { name });
            continue;
        }

        zwoFileContents.value.push({ name, input });
    }

    return downloadAsZip(zwoFileContents.value);
}

async function convertOne(fitFile: FitFileContent) {
    if (!fitFile) {
        console.error('No file uploaded');
        return;
    }

    zwoBuilder.value = new ZwoBuilder({ workout_file: {
        name: fitFile.messages.workoutMesgs[0].wktName.join(' | ').replace(/\n/g, ''),
        author: '@fit-converter',
        sportType: 'bike',
        tags: [{
            $: { name: 'from-garmin-fit' },
        }],
        workoutLength: fitFile.messages.workoutStepMesgs.reduce((acc, step) => acc + (step.durationTime || 0), 0),
        workout: {
            Warmup: [],
            SteadyState: [],
            IntervalsT: [],
            Cooldown: [],
            FreeRide: [],
            MaxEffort: [],
            Ramp: [],
            RestDay: [],
            SolidState: [],
            textEvent: [],
        },
    } });

    fitFile.messages.workoutStepMesgs.forEach(iterateWorkout);
    return zwoBuilder.value.buildXML();
}

function convertHRToPowerRate(step: WorkoutStep) {
    if (!isHRTargetType(step)) return;
    switch (step.targetHrZone) {
    case 1:
        return 0.6;
    case 2:
        return 0.7;
    case 3:
        return 0.8;
    case 4:
        return 0.9;
    case 5:
        return 1.1;
    case 6:
        return 1.3;
    }
}

function iterateWorkout(step: WorkoutStep) {
    switch (true) {
    case step.intensity === Intensity.Warmup && step.durationType === DurationType.Time:
        zwoBuilder.value?.addWarmupWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: step.durationTime,
        });
        break;
    case step.intensity === Intensity.Recovery && step.durationType === DurationType.Time:
        zwoBuilder.value?.addSteadyStateWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: step.durationTime,
        });
        break;

    case step.intensity === Intensity.Active && step.durationType === DurationType.Time:
        zwoBuilder.value?.addSteadyStateWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: step.durationTime,
        });
        break;
    case step.intensity === Intensity.Active && step.durationType === DurationType.UntilStepsCompleted:
        zwoBuilder.value?.addSteadyStateWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: step.durationTime,
        });
        break;
    case step.durationType === DurationType.Open:
        zwoBuilder.value?.addFreeRideWorkout({ Duration: step.durationTime });
        break;
    }
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
                        @click="handleConvertAll"
                        :disabled="!fitFiles">Convert</button>
            </form>
            <div v-if="fitFiles.length">
                <p class="mt-2 text-center text-sm text-gray-600">
                    Successfully uploaded {{ fitFiles.length }} files
                </p>
            </div>
        </div>
    </div>
</template>
