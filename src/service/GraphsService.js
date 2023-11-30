export default class GraphsService {
    generateBasicGraphOptions(title, temperatureMin, humidityMin, humidityMax) {
        return {
            color: ['rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)'],
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
                    name: 'Temperature',
                    position: 'left',
                    min: temperatureMin
                },
                {
                    type: 'value',
                    name: 'Humidity',
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
                    name: 'Temperature',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: []
                },
                {
                    name: 'Humidity %',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {
                        color: 'rgba(3,94,199,0.2)'
                    },
                    data: []
                }
            ]
        };
    }
}
