// processor.js
function calculateMaxValues(inputBuffer) {
    const channelMaxes = [];
    const { numberOfChannels } = inputBuffer;

    for (let c = 0; c < numberOfChannels; c += 1) {
        channelMaxes[c] = 0.0;
        const channelData = inputBuffer.getChannelData(c);
        for (let s = 0; s < channelData.length; s += 1) {
            if (Math.abs(channelData[s]) > channelMaxes[c]) {
                channelMaxes[c] = Math.abs(channelData[s]);
            }
        }
    }
    return channelMaxes;
};

// 获取样本帧数组中最大值
function peakValues(input) {
    return input.map(channel => {
        let max = 0;
        for (let s = 0; s < channel.length; s++) {
            const sAbs = Math.abs(channel[s]);
            if (sAbs > max) {
                max = sAbs;
            }
        }
        return max;
    });
};

class RandomNoiseProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        console.log(inputs[0], 99999999)
        this.port.postMessage({ type: 'peaks', input: peakValues(inputs[0]) });
        return true;
    }
};

registerProcessor("mu-processor", RandomNoiseProcessor);