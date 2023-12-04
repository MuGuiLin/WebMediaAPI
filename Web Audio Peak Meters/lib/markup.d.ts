import { PeakMeterConfig } from './config';
export declare function audioClipPath(db: number, dbRangeMin: number, dbRangeMax: number, vertical: boolean): string;
export declare function createContainerDiv(parent: HTMLElement, config: PeakMeterConfig): HTMLElement;
export declare function createTicks(parent: HTMLElement, config: PeakMeterConfig): Array<HTMLElement>;
export declare function createChannelElements(parent: HTMLElement, config: PeakMeterConfig, channelCount: number): Array<HTMLElement>;
export declare function createPeakLabels(parents: HTMLElement[], config: PeakMeterConfig): Array<HTMLElement>;
export declare function createBars(parents: HTMLElement[], config: PeakMeterConfig): Array<HTMLElement>;
export declare function maskSize(floatVal: number, dbRange: number, meterDimension: number): number;
