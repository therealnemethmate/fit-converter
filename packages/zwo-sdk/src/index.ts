import { Builder } from 'xml2js';

import { Cooldown, FreeRide, IntervalsT, MaxEffort, Ramp, RestDay, SteadyState, STextEvent, Warmup, ZwoWorkout } from './types';

export * from './types';

export class ZwoBuilder {
    private readonly builder: Builder;
    private workout: ZwoWorkout;

    constructor(zwoWorkout: ZwoWorkout) {
        this.builder = new Builder({ headless: true });
        this.workout = zwoWorkout;
    }

    /**
     * Builds the XML string from the workout object.
     * @returns The XML string.
     */
    public buildXML(): string {
        return this.builder.buildObject(this.workout);
    }

    public addWarmupWorkout(warmup: Warmup) {
        this.workout.workout_file.workout.Warmup.push({ $: warmup });
    }

    public addCooldownWorkout(cooldown: Cooldown) {
        this.workout.workout_file.workout.Cooldown.push({ $: cooldown });
    }

    public addSteadyStateWorkout(steadyState: SteadyState) {
        this.workout.workout_file.workout.SteadyState.push({ $: steadyState });
    }

    public addFreeRideWorkout(freeRide: FreeRide) {
        this.workout.workout_file.workout.FreeRide.push({ $: freeRide });
    }

    public addRampWorkout(ramp: Ramp) {
        this.workout.workout_file.workout.Ramp.push({ $: ramp });
    }

    public addMaxEffortWorkout(maxEffort: MaxEffort) {
        this.workout.workout_file.workout.MaxEffort.push({ $: maxEffort });
    }

    public addSTextEvent(textEvent: STextEvent) {
        this.workout.workout_file.workout.textEvent.push({ $: textEvent });
    }

    public addRestDayWorkout(restDay: RestDay) {
        this.workout.workout_file.workout.RestDay.push({ $: restDay });
    }

    public addIntervalsTWorkout(intervalsT: IntervalsT) {
        this.workout.workout_file.workout.IntervalsT.push({ $: intervalsT });
    }
}
