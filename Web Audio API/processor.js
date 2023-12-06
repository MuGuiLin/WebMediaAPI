function countMaxValue(input) {
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
        this.port.postMessage(countMaxValue(inputs[0]));
        return true;
    }
};

try {
    registerProcessor("mu-processor", RandomNoiseProcessor);
} catch (error) {
    console.log('无法注册峰值样本处理器。这可能意味着它已经注册了。', error);
}
