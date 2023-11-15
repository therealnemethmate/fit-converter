<script setup lang="ts">
import { DurationType, FitFileContent, Intensity, isHRTargetType, parseOneFitFile, WorkoutStep } from '@fit-converter/fit-sdk';
import { ZwoBuilder } from '@fit-converter/zwo-sdk';
import { InputWithSizeMeta } from 'client-zip';
import { ref } from 'vue';

import { convertDuration, convertFileName, convertWorkoutName, downloadAsZip, readBuffer } from '@/utils';

const fitFiles = ref<FitFileContent[]>([]);
const zwoBuilder = ref<ZwoBuilder>();
const zwoFileContents = ref<InputWithSizeMeta[]>([]);
const errors = ref<string[]>([]);

const heartRateToPowerMap = {
    1: 0.5,
    2: 0.65,
    3: 0.75,
    4: 0.9,
    5: 1.1,
    6: 1.3,
};

async function handleUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) {
        console.error('No file selected');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        try {
            const file = files.item(i);
            if (!file) continue;
            const buffer = await readBuffer(file);
            const readFile = await parseOneFitFile(buffer);
            console.log('readFile', { readFile });

            if (readFile.errors.length) {
                errors.value.push(`'Error parsing file' ${readFile.errors.join(', ')}`);
                continue;
            }

            fitFiles.value.push(readFile);
        } catch (error) {
            errors.value.push(`'Error reading file' ${(error as Error).message}`);
            console.error('Error reading file', { error });
        }
    }
}

async function handleConvertAll() {
    if (!fitFiles.value?.length) {
        console.error('No files parsed');
        return;
    }

    for (const key in fitFiles.value) {
        const fitFile = fitFiles.value[key];
        const wktName = fitFile.messages.workoutMesgs[0].wktName;
        const manufacturer = fitFile.messages.fileIdMesgs[0].manufacturer;
        try {
            const input = await convertOne(fitFile, key);
            if (!input) continue;
            const name = `${convertFileName(wktName, `${manufacturer}_${key}`)}.zwo`;
            zwoFileContents.value.push({ name, input });
        } catch (error) {
            errors.value.push(`'Error converting files' ${(error as Error).message}`);
            console.error('Error converting files', { error });
        }
    }

    await downloadAsZip(zwoFileContents.value);
    if (errors.value.length) {
        alert(`Some errors occurred: ${errors.value.join(', ')}`);
    }
}

async function convertOne(fitFile: FitFileContent, index: string) {
    if (!fitFile) {
        console.error('No file uploaded');
        return;
    }

    const wktName = fitFile.messages.workoutMesgs[0].wktName;
    const manufacturer = fitFile.messages.fileIdMesgs[0].manufacturer.toUpperCase();
    zwoBuilder.value = new ZwoBuilder({ workout_file: {
        name: convertWorkoutName(wktName, `${manufacturer} (${index}):`),
        author: '@fit-converter',
        sportType: 'bike',
        tags: [{ $: { name: '@fit-converter' } }],
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

    fitFile.messages.workoutStepMesgs.forEach(
        (step) => iterateWorkout(fitFile.messages.workoutStepMesgs, step),
    );

    zwoBuilder.value?.concatFreeRideWorkoutsWithoutDuration();
    return zwoBuilder.value.buildXML();
}

function convertHRToPowerRate(step: WorkoutStep) {
    if (!isHRTargetType(step)) return;
    return heartRateToPowerMap[step.targetHrZone];
}

function iterateWorkout(workout: WorkoutStep[], step: WorkoutStep) {
    switch (step.durationType) {
    case DurationType.Time:
        return convertDurationTypeTime(step);
    case DurationType.Open:
        return convertDurationTypeOpen(step);
    case DurationType.UntilStepsCompleted:
        return convertUntilStepsCompleted(workout, step);
    default:
        console.error('Unsupported duration type', { durationType: step.durationType });
    }
}

function convertDurationTypeTime(step: WorkoutStep) {
    switch (true) {
    case step.intensity === Intensity.Warmup:
        zwoBuilder.value?.addWarmupWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: convertDuration(step),
        });
        break;
    case step.intensity === Intensity.Recovery:
        zwoBuilder.value?.addSteadyStateWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: convertDuration(step),
        });
        break;
    case step.intensity === Intensity.Active:
        zwoBuilder.value?.addSteadyStateWorkout({
            Cadence: 90,
            Power: convertHRToPowerRate(step),
            Duration: convertDuration(step),
        });
        break;
    }
}

function convertDurationTypeOpen(step: WorkoutStep) {
    if (step.intensity === Intensity.Recovery) {
        return zwoBuilder.value?.addSteadyStateWorkout({
            // NOTE: garmin suggests 1 min for recovery steps
            Duration: 60,
            Power: convertHRToPowerRate(step),
            Cadence: 90,
        });
    }

    return zwoBuilder.value?.addFreeRideWorkout({ Duration: convertDuration(step) });
}

function convertUntilStepsCompleted(workout: WorkoutStep[], step: WorkoutStep) {
    if (!step.durationValue) return;
    const until = step.messageIndex;
    const from = step.durationValue;
    const repeatTimes = step.targetValue;

    // TODO: use addIntervalsTWorkout instead of this iteration
    // targetValue is the number of times the step should be repeated
    // we iterate one time less, to avoid adding the steps that already added by convertDurationTypeTime
    for (let y = 1; y < repeatTimes; y++) {
        // we stop before the step that has the repeatUntilStepCpltd flag
        for (let i = from; i < until; i++) {
            workout[i].durationType === DurationType.Time
                && convertDurationTypeTime(workout[i]);
            workout[i].durationType === DurationType.Open
                && convertDurationTypeOpen(workout[i]);
        }
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
                    Successfully uploaded and parsed {{ fitFiles.length }} files
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
