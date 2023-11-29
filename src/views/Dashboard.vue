<script setup>
import { onMounted, ref, provide, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import axios from 'axios';

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

provide(THEME_KEY, 'light');

const { isDarkTheme } = useLayout();

const products = ref(null);

const lineOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

const optionTemperature = ref({
    title: {
        text: 'Temperature DHT22',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}', // Sem si pak dam ten timestamp taky
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985' // Set the background color for the label
            },
            lineStyle: {
                type: 'dashed' // Set the line style to dashed
            }
        }
    },
    xAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        //min: 0, // Set the minimum value of the x-axis
        splitNumber: 10,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    grid: {
        top: '12%', // Adjust the top padding (percentage or pixel value)
        bottom: '9%', // Adjust the bottom padding (percentage or pixel value)
        left: '60px', // Adjust the left padding (percentage or pixel value)
        right: '40px' // Adjust the right padding (percentage or pixel value)
    },
    series: [
        {
            name: 'Temperature DHT22',
            type: 'line',
            areaStyle: {
                color: 'rgba(3,94,199,0.2)'
            },
            data: [], // Empty array for the fetched data
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
});

const optionHumidity = ref({
    title: {
        text: 'Humidity DHT22',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}', // Sem si pak dam ten timestamp taky
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985' // Set the background color for the label
            },
            lineStyle: {
                type: 'dashed' // Set the line style to dashed
            }
        }
    },
    xAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        //min: 0, // Set the minimum value of the x-axis
        splitNumber: 10,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    grid: {
        top: '12%', // Adjust the top padding (percentage or pixel value)
        bottom: '9%', // Adjust the bottom padding (percentage or pixel value)
        left: '60px', // Adjust the left padding (percentage or pixel value)
        right: '40px' // Adjust the right padding (percentage or pixel value)
    },
    series: [
        {
            name: 'Humidity DHT22',
            type: 'line',
            areaStyle: {
                color: 'rgba(3,94,199,0.2)'
            },
            data: [], // Empty array for the fetched data
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
});

const optionYesterdayTemperature = ref({
    color: ['#37c703', '#ed7e16'],
    title: {
        text: 'Yesterday temperature DHT22',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}', // Sem si pak dam ten timestamp taky
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985' // Set the background color for the label
            },
            lineStyle: {
                type: 'dashed' // Set the line style to dashed
            }
        }
    },
    xAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        data: [],
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        //min: 0, // Set the minimum value of the x-axis
        splitNumber: 10,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        data: [],
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    grid: {
        top: '12%', // Adjust the top padding (percentage or pixel value)
        bottom: '9%', // Adjust the bottom padding (percentage or pixel value)
        left: '60px', // Adjust the left padding (percentage or pixel value)
        right: '40px' // Adjust the right padding (percentage or pixel value)
    },
    series: [
        {
            name: 'Yesterday temperature DHT22',
            type: 'line',
            areaStyle: {
                color: 'rgba(3,94,199,0.2)'
            },
            data: [], // Empty array for the fetched data
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
});

const fetchData = async () => {
    try {
        const todayResponse = await axios.get('http://192.168.0.67/sensors/dht22_data/today/1');
        const yesterdayAggregatedResponse = await axios.get('http://192.168.0.67/history/dht22_data/1/yesterday');

        const transformedTempData = todayResponse.data.map((item) => ({
            value: item.temperature,
            name: item.measured_at
        }));

        const transformedHumData = todayResponse.data.map((item) => ({
            value: item.humidity,
            name: item.measured_at
        }));

        //const transformedYesterdayTempData = yesterdayAggregatedResponse.data.map((item) => ({
        //    value: item.temperature,
        //    name: item.measured_at
        //}));

        //console.log(transformedHumData);

        // Update the series data in the ECharts option
        optionTemperature.value.series[0].data = transformedTempData;
        optionHumidity.value.series[0].data = transformedHumData;
        //optionYesterdayTemperature.value.series[0].data = transformedYesterdayTempData;

        const test = yesterdayAggregatedResponse.data.map((item) => ({
            value: item.temperature,
            name: item.segment_interval_name
        }));

        console.log(test);

        const xAxisData = test.map((item) => item.value); // Extract temperature data from 'value' property
        const yAxisData = test.map((item) => item.name); // Extract segment interval names from 'name' property

        console.log(xAxisData);
        console.log(yAxisData);

        optionYesterdayTemperature.value.series[0].data = test; // segment_interval_name
        optionYesterdayTemperature.value.xAxis.data = xAxisData; // segment_interval_name
        optionYesterdayTemperature.value.yAxis.data = yAxisData; // segment_interval_name

        //optionYesterdayTemperature.value.series[0].data = test.map((item) => [item.value, item.name]);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData(); // Fetch data when the component is mounted
});
</script>

<template>
    <div class="grid">
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionTemperature" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionHumidity" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionYesterdayTemperature" autoresize />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.chart-container {
    width: 100%; /* Set width as needed */
    height: 400px; /* Set height as needed */
}
</style>
