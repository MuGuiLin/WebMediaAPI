let yDataForMap = [];
// $('#playButton').on('click', function () {
//     if (audioElement.paused) {
//         stopChart && stopChart();
//     } else {
//         stopChart = setIntervalUsingSetTimeout(renderEcharts, 10);
//     }
// });

const myChart = echarts.init(document.getElementById('echarts'));

// 地图渲染
myChart.showLoading();
let cityJson = [];
let isInitEachartsMap = false;
yDataForMap = [
    { "name": "渝中区", value: 0 },
    { "name": "江北区", value: 0 },
    { "name": "沙坪坝区", value: 0 },
    { "name": "渝北区", value: 0 },
    { "name": "北碚区", value: 0 },
    { "name": "南岸区", value: 0 },
    { "name": "九龙坡区", value: 0 },
    { "name": "巴南区", value: 0 },
    { "name": "大渡口区", value: 0 },
    { "name": "璧山区", value: 0 },
    { "name": "合川区", value: 0 },
    { "name": "铜梁区", value: 0 },
    { "name": "潼南区", value: 0 },
    { "name": "大足区", value: 0 },
    { "name": "荣昌区", value: 0 },
    { "name": "永川区", value: 0 },
    { "name": "江津区", value: 0 },
    { "name": "綦江区", value: 0 },
    { "name": "南川区", value: 0 },
    { "name": "涪陵区", value: 0 },
    { "name": "长寿区", value: 0 },
    { "name": "垫江县", value: 0 },
    { "name": "武隆区", value: 0 },
    { "name": "彭水苗族土家族自治县", value: 0 },
    { "name": "丰都县", value: 0 },
    { "name": "石柱土家族自治县", value: 0 },
    { "name": "忠县", value: 0 },
    { "name": "梁平区", value: 0 },
    { "name": "万州区", value: 0 },
    { "name": "开州区", value: 0 },
    { "name": "云阳县", value: 0 },
    { "name": "奉节县", value: 0 },
    { "name": "黔江区", value: 0 },
    { "name": "巫山县", value: 0 },
    { "name": "巫溪县", value: 0 },
    { "name": "城口县", value: 0 },
    { "name": "秀山土家族苗族自治县", value: 0 },
    { "name": "酉阳土家族苗族自治县", value: 0 },
];
$.get('./js/CQ.json', function (geoJson) {
    myChart.hideLoading();
    cityJson = geoJson;
    stopChart = setIntervalUsingSetTimeout(renderEcharts, 50, 'map');
});
const xDataForRadar = Array(300).fill(1).map((item, index) => ({
    name: index,
    max: 150,
}));

$(($) => {
    $('.playButton').on('click', function () {
        if (audioElement.paused) {
            stopChart && stopChart();
        } else {
            const curType = $(this).data('type');
            if (curPlayingType === curType) {
                stopChart && stopChart();
            }
            const type = curType || 'bar';
            const isPaused = false;
            if (curType === 'manual') {
                stopChart = setIntervalUsingSetTimeout(renderManual, 10, type, !isPaused);
                return;
            }
            stopChart = setIntervalUsingSetTimeout(renderEcharts, 10, type, !isPaused);
        }
    });
});

function getRainbowColorByValue(value) {
    if (!value) {
        return value;
    }
    if (value >= 0 && value <= 20) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.purple,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (value > 20 && value <= 40) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.blue,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (value > 40 && value <= 60) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.cyan,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (value > 60 && value <= 80) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.green,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (value > 80 && value <= 100) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.yellow,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (value > 100 && value <= 120) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.orange,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (value > 120) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.red,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
}

function getRainbowColorByIndex(value, index) {
    if (!value) {
        return value;
    }
    if (index >= 0 && index <= 40) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.purple,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (index > 40 && index <= 80) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.blue,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (index > 80 && index <= 120) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.cyan,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (index > 120 && index <= 160) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.green,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (index > 160 && index <= 200) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.yellow,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (index > 200 && index <= 240) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.orange,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
    if (index > 240) {
        return {
            value: value,
            itemStyle: {
                color: rainbowColors.red,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0, 0.5)'
            }
        };
    }
}

function renderEcharts(type = '') {
    if (!type) {
        return;
    }
    // requestAnimationFrame(renderEcharts);
    // 基于准备好的dom，初始化echarts实例
    // analyzerNode.getByteFrequencyData(frequencyData); // 频域数据
    analyzerNode.getByteTimeDomainData(frequencyData); // 时域数据
    const iData = Array.from(frequencyData);

    const xData = [];
    const yData = [];
    const yDataForNegative = [];
    const yDataForLine = [];
    const threeDBarData = [];
    const filterDataPre = iData.filter((item, index) => index % 3 === 0);
    const filterData = type === 'threeDBar' ? filterDataPre.reverse() : filterDataPre;

    filterData.forEach((item, index) => {
        xData.push(index);

        const sparseItem = item / 2;

        if (type === 'threeDBar') {
            // filterData是342长的一维数组，需转为19*18的二维数组用于3D展示
            threeDBarData.push([index % 19, Math.floor(index / 19), sparseItem])
        } else {
            let yDataItem = '';
            let yDataItemForNegative = '';

            if (getColorType === 'by-value') {
                yDataItem = getRainbowColorByValue(sparseItem);
            }
            if (getColorType === 'by-index') {
                yDataItem = getRainbowColorByIndex(sparseItem, index);
            }
            if (getColorType === 'by-default') {
                yDataItem = {
                    value: sparseItem,
                    itemStyle: {
                        color: '#a90000'
                    }
                };
            }
            if (!getColorType || getColorType === 'ignore') {
                yDataItem = sparseItem;
            }

            yDataItemForNegative = -sparseItem;
            yData.push(yDataItem);
            yDataForNegative.push(yDataItemForNegative);
            yDataForLine.push(sparseItem);
        }
    })

    if (type === 'map') {
        if (!isInitEachartsMap) {
            echarts.registerMap('CQ', cityJson);
            isInitEachartsMap = true;
        }

        filterData.forEach((item, index) => {
            if (index === 0) { yDataForMap[0].value = item; }
            if (index === 8) { yDataForMap[1].value = item; }
            if (index === 16) { yDataForMap[2].value = item; }
            if (index === 24) { yDataForMap[3].value = item; }
            if (index === 32) { yDataForMap[4].value = item; }
            if (index === 40) { yDataForMap[5].value = item; }
            if (index === 48) { yDataForMap[6].value = item; }
            if (index === 56) { yDataForMap[7].value = item; }
            if (index === 64) { yDataForMap[8].value = item; }
            if (index === 72) { yDataForMap[9].value = item; }
            if (index === 80) { yDataForMap[10].value = item; }
            if (index === 88) { yDataForMap[11].value = item; }
            if (index === 96) { yDataForMap[12].value = item; }
            if (index === 104) { yDataForMap[13].value = item; }
            if (index === 112) { yDataForMap[14].value = item; }
            if (index === 120) { yDataForMap[15].value = item; }
            if (index === 128) { yDataForMap[16].value = item; }
            if (index === 136) { yDataForMap[17].value = item; }
            if (index === 144) { yDataForMap[18].value = item; }
            if (index === 152) { yDataForMap[19].value = item; }
            if (index === 160) { yDataForMap[20].value = item; }
            if (index === 168) { yDataForMap[21].value = item; }
            if (index === 176) { yDataForMap[22].value = item; }
            if (index === 184) { yDataForMap[23].value = item; }
            if (index === 192) { yDataForMap[24].value = item; }
            if (index === 200) { yDataForMap[25].value = item; }
            if (index === 208) { yDataForMap[26].value = item; }
            if (index === 216) { yDataForMap[27].value = item; }
            if (index === 224) { yDataForMap[28].value = item; }
            if (index === 232) { yDataForMap[29].value = item; }
            if (index === 240) { yDataForMap[30].value = item; }
            if (index === 248) { yDataForMap[31].value = item; }
            if (index === 256) { yDataForMap[32].value = item; }
            if (index === 264) { yDataForMap[33].value = item; }
            if (index === 270) { yDataForMap[34].value = item; }
            if (index === 278) { yDataForMap[35].value = item; }
            if (index === 286) { yDataForMap[36].value = item; }
            if (index === 300) { yDataForMap[37].value = item; }
        })
    } else {
        isInitEachartsMap = false;
    }

    // 指定图表的配置项和数据
    const typeOptions = {
        bar: {
            title: {
                text: '柱状图'
            },
            tooltip: { show: false },
            color: 'rgb(255,192,203)',
            legend: {
                show: false
            },
            xAxis: {
                data: xData
            },
            yAxis: {
                max: '150'
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: yData,
                    barCategoryGap: '0%',
                }
            ],
            animation: false
        },
        barWithNegative: {
            title: {
                text: '正负相交柱状图'
            },
            tooltip: { show: false },
            xAxis: {
                // type: 'category',
                axisTick: {
                    show: false
                },
                data: xData,
                show: false
            },
            yAxis: {
                max: '150',
                min: '-150',
                show: false
            },
            series: [
                {
                    type: 'bar',
                    stack: 'Total',
                    label: {
                        show: false
                    },
                    data: yData
                },
                {
                    type: 'bar',
                    stack: 'Total',
                    label: {
                        show: false
                    },
                    data: yDataForNegative,
                    barCategoryGap: '0%',
                }
            ],
            animation: false
        },
        line: {
            title: {
                text: '折线图'
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                max: 150,
                interval: 50
            },
            series: [
                {
                    type: 'line',
                    data: yDataForLine,
                    barCategoryGap: '0%',
                }
            ],
            animation: false
        },
        barAndLine: {
            title: {
                text: '折柱混合'
            },
            tooltip: {},
            legend: {
                data: ['']
            },
            xAxis: {
                data: xData
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'line',
                    min: 0,
                    max: 150,
                    interval: 50
                },
                {
                    type: 'value',
                    name: 'bar',
                    min: 0,
                    max: 150,
                    interval: 50
                }
            ],
            series: [
                {
                    name: 'line',
                    type: 'line',
                    data: yDataForLine,
                },
                {
                    name: 'bar',
                    type: 'bar',
                    data: yData,
                    barCategoryGap: '0%',
                }
            ],
            animation: false
        },
        polar: {
            title: {
                text: '极坐标环'
            },
            polar: {
                radius: [30, '80%']
            },
            radiusAxis: {
                type: 'category',
                data: xData
            },
            angleAxis: {
                max: 150,
                startAngle: 75
            },
            tooltip: {},
            series: {
                type: 'bar',
                data: yData,
                coordinateSystem: 'polar',
                barCategoryGap: '0%',
            },
            animation: false
        },
        polarBar: {
            title: {
                text: '极坐标柱状'
            },
            polar: {
                radius: [30, '80%']
            },
            radiusAxis: {
                max: 150
            },
            angleAxis: {
                type: 'category',
                data: xData,
                startAngle: 75
            },
            tooltip: {},
            series: {
                type: 'bar',
                data: yData,
                coordinateSystem: 'polar',
                barCategoryGap: '0%',
            },
            animation: false
        },
        pie: {
            title: {
                text: '饼图'
            },
            tooltip: {},
            legend: {
                data: ['']
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '50%',
                    data: yData,
                    label: {
                        show: false
                    }
                }
            ],
            animation: false
        },
        pieWithNightingale: {
            title: {
                text: '南丁格尔玫瑰图'
            },
            tooltip: {},
            legend: {
                data: ['']
            },
            series: [
                {
                    type: 'pie',
                    radius: [20, 140],
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 5
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    data: yData
                }
            ],
            animation: false
        },
        scatter: {
            title: {
                text: '散点图'
            },
            tooltip: {},
            legend: {
                show: false
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                max: '150',
                interval: 50
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: 10,
                    label: {
                        show: false
                    },
                    data: yData
                }
            ],
            animation: false
        },
        scatterWithBubble: {
            title: {
                text: '气泡图'
            },
            tooltip: {},
            legend: {
                show: false
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                max: '150',
                interval: 50
            },
            series: [
                {
                    type: 'scatter',
                    label: {
                        show: false
                    },
                    data: yData,
                    symbolSize: function (data) {
                        return Math.sqrt(data);
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                    }
                }
            ],
            animation: false
        },
        map: {
            title: {
                text: '地图',
            },
            visualMap: {
                min: 0,
                max: 200,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
            },
            series: [
                {
                    name: '',
                    type: 'map',
                    map: 'CQ',
                    label: {
                        show: false
                    },
                    data: yDataForMap || []
                }
            ]
        },
        radar: {
            title: {
                text: '雷达图'
            },
            radar: {
                // shape: 'circle',
                indicator: xDataForRadar,
                axisName: {
                    show: false
                },
                axisLine: { show: false },
                // splitLine: { show: false }
            },
            series: [
                {
                    type: 'radar',
                    data: [
                        {
                            value: yDataForLine,
                            name: 'music'
                        },
                    ]
                }
            ],
            animation: false
        },
        threeDBar: {
            title: {
                text: '3D柱状'
            },
            tooltip: { show: false },
            visualMap: {
                inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#e0f3f8',
                        '#ffffbf',
                        '#fee090',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026'
                    ]
                }
            },
            xAxis3D: {
                type: 'value'
            },
            yAxis3D: {
                type: 'value'
            },
            zAxis3D: {
                type: 'value',
                max: 150,
                min: 0
            },
            grid3D: {
                environment: '#000',
                show: false,
                axisPointer: {
                    show: false
                },
                postEffect: {
                    enable: true,
                    SSAO: {
                        enable: true,
                        radius: 5
                    }
                },
                light: {
                    main: {
                        intensity: 3
                    },
                    ambientCubemap: {
                        texture: './hdr/pisa.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                }
            },
            series: [
                {
                    type: 'bar3D',
                    data: threeDBarData,
                    barSize: 4,
                    bevelSize: 0.4,
                    bevelSmoothness: 4,
                    shading: 'realistic',
                    realisticMaterial: {
                        roughness: 0.3,
                        metalness: 1
                    },
                    label: {
                        textStyle: {
                            fontSize: 16,
                            borderWidth: 1
                        }
                    },
                    itemStyle: {
                        color: '#ccc'
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    animation: false
                }
            ]
        }
    }

    // 更新数据
    type !== 'threeDBar' && myChart.clear();

    myChart.setOption(typeOptions[type]);
}
// renderEcharts('threeDBar');
// stopChart = setIntervalUsingSetTimeout(renderEcharts, 1000, 'threeDBar', false);

// setInterval(() => { renderEcharts(); }, 10)

