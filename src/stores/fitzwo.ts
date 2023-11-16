import { DurationType, FitFileContent, Intensity, isHRTargetType, parseOneFitFile, WorkoutStep } from '@fit-converter/fit-sdk';
import { ZwoBuilder } from '@fit-converter/zwo-sdk';
import { InputWithSizeMeta } from 'client-zip';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { convertDuration, convertFileName, convertHRToPowerRate, convertWorkoutName } from '@/converters';
import { downloadAsZip, readBuffer } from '@/helpers';

export const useFitZwoStore = defineStore('fitzwo', () => {
    const fitFiles = ref<FitFileContent[]>([]);
    const numberOfParsedFiles = computed(() => fitFiles.value.length);
    const zwoBuilder = ref<ZwoBuilder>();
    const zwoFileContents = ref<InputWithSizeMeta[]>([]);

    /**
     * Parses a .fit file and stores it
     * @param file
     */
    async function parseFitFile(file?: File) {
        try {
            if (!file) return;
            const buffer = await readBuffer(file);
            const readFile = await parseOneFitFile(buffer);
            if (readFile.errors.length) {
                throw new Error(`'Error parsing file' ${readFile.errors.join(', ')}`);
            }
    
            fitFiles.value.push(readFile);    
        } catch (error) {
            throw new Error(`'Error reading file' ${(error as Error).message}`);
        }
    }

    /**
     * Converts all previously uploaded .fit files to .zwo files
     * Throws an error if no files are uploaded
     */
    async function convertFitToZwo() {
        if (!fitFiles.value?.length) {
            throw new Error('Select .fit files first!');
        }
        
        for (const key in fitFiles.value) {
            await convertOne(fitFiles.value[key], key);
        }
    }
    
    /**
     * Converts a single .fit file to .zwo file by parsing it and iterating over the workout steps
     * 
     * @param fitFile
     * @param index
     */
    async function convertOne(fitFile: FitFileContent, index: string) {
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
    
        try {
            fitFile.messages.workoutStepMesgs.forEach(
                (step) => convertWorkout(fitFile.messages.workoutStepMesgs, step),
            );
        
            const input = zwoBuilder.value.buildXML();
            if (!input) return;
    
            const name = `${convertFileName(wktName, `${manufacturer}_${index}`)}.zwo`;
            zwoFileContents.value.push({ name, input });    
        } catch (error) {
            throw Error(`'Error converting files' ${(error as Error).message}`);
        }
    }

    /**
     * Converts a single .fit workout step into a .zwo workout step
     * 
     * @param workout
     * @param step
     */
    function convertWorkout(workout: WorkoutStep[], step: WorkoutStep) {
        switch (step.durationType) {
        case DurationType.Time:
            return convertDurationTypeTime(step);
        case DurationType.Open:
            return convertDurationTypeOpen(step);
        case DurationType.UntilStepsCompleted:
            return convertUntilStepsCompleted(workout, step);
        default:
            throw new Error(`Unsupported duration type ${step.durationType}`);
        }
    }
    
    /**
     * Converts a single .fit workout step with duration type time into a .zwo workout step
     * 
     * @param step
     */
    function convertDurationTypeTime(step: WorkoutStep) {
        switch (step.intensity) {
        case Intensity.Warmup:
            return zwoBuilder.value?.addWarmupWorkout({
                Cadence: 90,
                Power: convertHRToPowerRate(step),
                Duration: convertDuration(step),
            });
        case Intensity.Recovery:
            return zwoBuilder.value?.addSteadyStateWorkout({
                Cadence: 90,
                Power: convertHRToPowerRate(step),
                Duration: convertDuration(step),
            });
        case Intensity.Active:
            if (!isHRTargetType(step)) {
                return zwoBuilder.value?.addFreeRideWorkout({ Duration: convertDuration(step) });
            }
    
            return zwoBuilder.value?.addSteadyStateWorkout({
                Cadence: 90,
                Power: convertHRToPowerRate(step),
                Duration: convertDuration(step),
            });
        }
    }
    
    /**
     * Converts a single .fit workout step with duration type open into a .zwo workout step
     * 
     * @param step
     */
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

    /**
     * Converts a single .fit workout step with duration type until steps completed into a .zwo workout step
     * 
     * @param workout
     * @param step
     */
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

    /**
     * Downloads all converted .zwo files as .zip
     * Throws an error if no files are converted
     */
    function downloadZwoFiles() {
        if (!zwoFileContents.value) throw new Error('First you have to convert the files!');
        return downloadAsZip(zwoFileContents.value);
    }

    return {
        convertFitToZwo,
        downloadZwoFiles,
        parseFitFile,
        numberOfParsedFiles,
    };
});
