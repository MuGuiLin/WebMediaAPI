
    // --手搓 start--
    function renderManual() {
        // requestAnimationFrame(renderManual);
        analyzerNode.getByteFrequencyData(frequencyData); // 频域数据
        // analyzerNode.getByteTimeDomainData(frequencyData); // 时域数据
        let canvasHeight = canvas.height;
        let canvasWidth = canvas.width;
        let barWidth = canvasWidth / frequencyData.length;
        let barHeight;
        let x = 0;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        for (let i = 0; i < frequencyData.length; i++) {
            barHeight = frequencyData[i] * 2;
            ctx.fillStyle = 'rgb(80, 50,' + (barHeight + 120) + ')';
            // ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(x, canvasHeight - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    }
    // renderManual();
    // --手搓 end--