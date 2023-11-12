export type ZwoWorkout = {
    workout_file: {
        activitySaveName?: string;
        author?: string;
        author_alias?: string;
        category?: string;
        categoryIndex?: string;
        description?: string;
        durationType?: string;
        entId?: number;
        ftpFemaleOverride?: number;
        ftpMaleOverride?: number;
        ftpOverride?: number;
        name?: string;
        nameImperial?: string;
        nameMetric?: string;
        overrideHash?: number;
        painIndex?: number;
        setFtpAtPercentage?: number;
        ShowCP20?: number;
        Skippable?: number;
        sportType?: string;
        subcategory?: string;
        tags?: Tag[];
        test_details?: TestDetails;
        Tutorial?: number;
        visibleAfterTime?: number;
        visibleOutsidePlan?: number;
        workout: Workout;
        workoutLength?: number;
        WorkoutPlan?: number;
    };
};

export type Tag = {
    $: {
        name: string;
    }
}

export type TestDetails = {
    name: string;
    paceid: number;
    tracking_text_paceid: number;
    tracking_text_post: string;
    tracking_text_pre: string;
}

export type Workout = {
    Cooldown: { $: Cooldown }[];
    FreeRide: { $: FreeRide }[];
    IntervalsT: { $: IntervalsT }[];
    MaxEffort: { $: MaxEffort }[];
    Ramp: { $: Ramp }[];
    RestDay: { $: RestDay }[];
    SolidState: { $: SolidState }[];
    SteadyState: { $: SteadyState }[];
    textEvent: { $: STextEvent }[];
    Warmup: { $: Warmup }[];
}

export type Cooldown = {
    Cadence?: number;
    CadenceHigh?: number;
    CadenceLow?: number;
    CadenceResting?: number;
    Duration?: number;
    EndAtRoadTime?: number;
    Pace?: number;
    Power?: number;
    PowerHigh?: number;
    PowerLow?: number;
    replacement_prescription?: number;
    replacement_verb?: number;
    units?: number;
    Zone?: number;
    gameplayevent?: GameplayEvent[];
    TextEvent?: TextEvent[];
    textEvent?: STextEvent[];
    TextNotification?: TextNotification[];
}

export type FreeRide = {
    Cadence?: number;
    CadenceHigh?: number;
    CadenceLow?: number;
    Duration?: number;
    FailThresholdDuration?: number;
    FlatRoad?: number;
    ftptest?: number;
    Power?: number;
    ramptest?: number;
    show_avg?: number;
    textEvent?: STextEvent[];
}

export type IntervalsT = {
    Cadence?: number;
    CadenceHigh?: number;
    CadenceLow?: number;
    CadenceResting?: number;
    FlatRoad?: number;
    OffDuration?: number;
    OffPower?: number;
    OnDuration?: number;
    OnPower?: number;
    OverUnder?: number;
    pace?: number;
    PowerOffHigh?: number;
    PowerOffLow?: string;
    PowerOffZone?: number;
    PowerOnHigh?: number;
    PowerOnLow?: number;
    PowerOnZone?: number;
    Repeat?: number;
    units?: number;
    TextEvent?: TextEvent[];
    TextNotification?: TextNotification[];
    textEvent?: STextEvent[];
}

export type MaxEffort = {
    Duration?: number;
}

export type Ramp = {
    Cadence?: number;
    CadenceResting?: number;
    Duration?: number;
    pace?: number;
    Power?: number;
    PowerHigh?: number;
    PowerLow?: number;
    show_avg?: number;
    textEvent?: STextEvent[];
}

export type RestDay = {}

export type SolidState = {
    Duration?: number;
    Power?: number;
    textEvent?: STextEvent[];
}

export type SteadyState = {
    Cadence?: number;
    CadenceHigh?: number;
    CadenceLow?: number;
    CadenceResting?: number;
    Duration?: number;
    FailThresholdDuration?: number;
    Forced_Performance_Test?: number;
    forced_performance_test?: number;
    NeverFails?: number;
    OffPower?: number;
    pace?: number;
    Power?: number;
    PowerHigh?: number;
    PowerLow?: number;
    ramptest?: number;
    replacement_prescription?: string;
    replacement_verb?: string;
    show_avg?: number;
    Target?: number;
    Text?: string;
    units?: number;
    Zone?: number;
    TextEvent?: TextEvent[];
    textEvent?: STextEvent[];
}

export type Warmup = {
    Cadence?: number;
    CadenceHigh?: number;
    CadenceLow?: number;
    CadenceResting?: number;
    Duration?: number;
    pace?: number;
    Power?: number;
    PowerHigh?: number;
    PowerLow?: number;
    Quantize?: number;
    replacement_prescription?: number;
    replacement_verb?: number;
    Text?: number;
    units?: number;
    Zone?: number;
    TextEvent?: TextEvent[];
    textEvent?: STextEvent[];
}

export type GameplayEvent = {
    camera?: number;
    duration?: number;
    timeoffset?: number;
    type?: number;
}

export type TextEvent = {
    Duration?: number;
    message?: string;
    TimeOffset?: number;
    timeoffset?: number;
}

export type TextNotification = {
    duration?: number;
    font_size?: number;
    text?: string;
    timeOffset?: number;
    x?: number;
    y?: number;
}

export type STextEvent = {
    distoffset?: number;
    duration?: number;
    message?: string;
    mssage?: string;
    textscale?: number;
    timeoffset?: number;
    y?: number;
}
