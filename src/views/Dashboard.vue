<script setup>
import { onMounted, ref, provide, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import axios from 'axios';

use([CanvasRenderer, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

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

const optionToday = ref({
    color: ['rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)'],
    title: {
        text: 'Today raw values DHT22',
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
            fontWeight: 'bold' // Make the xAxis name bold
        }
    },
    yAxis: [
        {
            type: 'value',
            name: 'Temperature',
            position: 'left',
            min: 10
        },
        {
            type: 'value',
            name: 'Humidity',
            position: 'right',
            min: 20,
            max: 100
        }
    ],
    grid: {
        top: '12%', // Adjust the top padding (percentage or pixel value)
        bottom: '9%', // Adjust the bottom padding (percentage or pixel value)
        left: '60px', // Adjust the left padding (percentage or pixel value)
        right: '40px' // Adjust the right padding (percentage or pixel value)
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
});

const optionYesterday = ref({
    color: ['rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)'],
    title: {
        text: 'Yesterday aggregated values DHT22',
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
            fontWeight: 'bold' // Make the xAxis name bold
        }
    },
    yAxis: [
        {
            type: 'value',
            name: 'Temperature',
            position: 'left',
            min: 10
        },
        {
            type: 'value',
            name: 'Humidity',
            position: 'right',
            min: 20,
            max: 100
        }
    ],
    grid: {
        top: '12%', // Adjust the top padding (percentage or pixel value)
        bottom: '9%', // Adjust the bottom padding (percentage or pixel value)
        left: '60px', // Adjust the left padding (percentage or pixel value)
        right: '40px' // Adjust the right padding (percentage or pixel value)
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
});

const fetchData = async () => {
    try {
        // Today data
        const todayResponse = await axios.get('http://192.168.0.67/sensors/dht22_data/today/1');

        optionToday.value.series[0].data = todayResponse.data.map((item) => item.temperature);
        optionToday.value.series[1].data = todayResponse.data.map((item) => item.humidity);
        optionToday.value.xAxis.data = todayResponse.data.map((item) => item.measured_at);

        // yesterday aggregated data
        const yesterdayResponse = await axios.get('http://192.168.0.67/history/dht22_data/1/yesterday');

        optionYesterday.value.series[0].data = yesterdayResponse.data.map((item) => item.temperature);
        optionYesterday.value.series[1].data = yesterdayResponse.data.map((item) => item.humidity);
        optionYesterday.value.xAxis.data = yesterdayResponse.data.map((item) => item.segment_interval_name);
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
                    <v-chart class="chart" :option="optionToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionYesterday" autoresize />
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
