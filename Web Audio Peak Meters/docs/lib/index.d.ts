import { PeakMeterConfig } from './config';
export declare class WebAudioPeakMeter {
    channelCount: number;
    srcNode: AudioNode;
    node?: AudioWorkletNode;
    config: PeakMeterConfig;
    parent?: HTMLElement;
    ticks?: Array<HTMLElement>;
    channelElements?: Array<HTMLElement>;
    bars?: Array<HTMLElement>;
    peakLabels?: Array<HTMLElement>;
    tempPeaks: Array<number>;
    heldPeaks: Array<number>;
    peakHoldTimeouts: Array<number>;
    animationRequestId?: number;
    constructor(src: AudioNode, ele: HTMLElement, options?: {});
    initNode(): Promise<void>;
    handleNodePortMessage(ev: MessageEvent): void;
    paintMeter(): void;
    clearPeak(i: number): void;
    clearPeaks(): void;
    getPeaks(): {
        current: number[];
        maxes: number[];
        currentDB: number[];
        maxesDB: number[];
    };
    cleanup(): void;
}
