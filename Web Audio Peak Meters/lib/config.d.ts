export interface PeakMeterConfig {
    vertical: boolean;
    borderSize: number;
    fontSize: number;
    backgroundColor: string;
    tickColor: string;
    labelColor: string;
    gradient: Array<string>;
    dbRangeMin: number;
    dbRangeMax: number;
    dbTickSize: number;
    maskTransition: string;
    audioMeterStandard: string;
    peakHoldDuration: number;
}
export declare const defaultConfig: PeakMeterConfig;
