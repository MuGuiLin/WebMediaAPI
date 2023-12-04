// processor.js
function peakValues(input) {
    return input.map(channel => {
        let max = 0;
        for (let s = 0; s < channel.length; s++) {
            const sAbs = Math.abs(channel[s]);
            if (sAbs > max) max = sAbs;
        }
        return max;
    });
};

class RandomNoiseProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        this.port.postMessage({ type: 'peaks', input: peakValues(inputs[0]) });
        return true;
    }
};

registerProcessor("mu-processor", RandomNoiseProcessor);