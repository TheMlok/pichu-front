export default class GraphsService {
    generateTempHumidityGraphOptions(title, firstSeriesName, secondSeriesName, firstMin, firstMax, secondMin, secondMax, firstLineColor, secondLineColor, areaColor) {
        const yAxis = [
            {
                type: 'value',
                name: firstSeriesName,
                position: 'left',
                min: firstMin
            },
            {
                type: 'value',
                name: secondSeriesName,
                position: 'right',
                min: secondMin,
                max: secondMax
            }
        ];

        if (firstMin !== 0) {
            yAxis[0].min = firstMin;
        }

        if (firstMax !== 0) {
            yAxis[0].min = firstMin;
        }

        if (secondMin !== 0) {
            yAxis[1].min = secondMin;
        }

        if (secondMax !== 0) {
            yAxis[1].max = secondMax;
        }

        return {
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
            yAxis: yAxis,
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

    generateOneLineGraphOptions(title, seriesName, min, max, lineColor, areaColor) {
        return {
            color: lineColor,
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
                        color: areaColor
                    },
                    data: []
                }
            ]
        };
    }
}
