export default class GraphsService {
    generateTempHumidityGraphOptions(title, firstSeriesName, secondSeriesName, temperatureMin, humidityMin, humidityMax, firstLineColor, secondLineColor, areaColor) {
        return {
            //color: ['rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)'],
            color: [firstLineColor, secondLineColor],
            title: {
                text: title,
                left: 'center',
                top: 0
            },
            legend: {
                top: 20
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            xAxis: {
                type: 'category',
                nameLocation: 'center',
                data: [],
                nameTextStyle: {
                    fontWeight: 'bold'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: firstSeriesName,
                    position: 'left',
                    min: temperatureMin
                },
                {
                    type: 'value',
                    name: secondSeriesName,
                    position: 'right',
                    min: humidityMin,
                    max: humidityMax
                }
            ],
            grid: {
                top: '12%',
                bottom: '9%',
                left: '60px',
                right: '40px'
            },
            series: [
                {
                    name: firstSeriesName,
                    type: 'bar',
                    yAxisIndex: 0,
                    data: []
                },
                {
                    name: secondSeriesName,
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {
                        color: areaColor
                    },
                    data: []
                }
            ]
        };
    }

    generateOneLineGraphOptions(title, seriesName, min, max) {
        return {
            color: ['rgb(143,199,3)'],
            title: {
                text: title,
                left: 'center',
                top: 0
            },
            legend: {
                top: 20
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            xAxis: {
                type: 'category',
                nameLocation: 'center',
                data: [],
                nameTextStyle: {
                    fontWeight: 'bold'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: seriesName,
                    min: min,
                    max: max
                }
            ],
            grid: {
                top: '12%',
                bottom: '9%',
                left: '60px',
                right: '40px'
            },
            series: [
                {
                    name: seriesName,
                    type: 'line',
                    areaStyle: {
                        color: 'rgba(143,199,3,0.65)'
                    },
                    data: []
                }
            ]
        };
    }
}
