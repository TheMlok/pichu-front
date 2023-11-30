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
import GraphsService from '@/service/GraphsService';

const graphsService = new GraphsService();

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

const optionDht22Today = ref(graphsService.generateTempHumidityGraphOptions('Today raw values DHT22', 'Temperature', 'Humidity %', 10, 0, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)'));
const optionDht22Yesterday = ref(graphsService.generateTempHumidityGraphOptions('Yesterday aggregated values DHT22', 'Temperature', 'Humidity %', 10, 0, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)'));
const optionBmeToday = ref(graphsService.generateOneLineGraphOptions('Air quality percentage', 'Air quality %', 40, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));
const optionBmeYesterday = ref(graphsService.generateOneLineGraphOptions('Yesterday aggregated air quality percentage', 'Air quality %', 40, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));

const fetchData = async () => {
    try {
        // DHT22
        // Today data
        const todayDht22Response = await axios.get('http://192.168.0.67/sensors/dht22_data/today/1');

        optionDht22Today.value.series[0].data = todayDht22Response.data.map((item) => item.temperature);
        optionDht22Today.value.series[1].data = todayDht22Response.data.map((item) => item.humidity);
        optionDht22Today.value.xAxis.data = todayDht22Response.data.map((item) => item.measured_at);

        // yesterday aggregated data
        const yesterdayDht22Response = await axios.get('http://192.168.0.67/history/dht22_data/1/yesterday');

        optionDht22Yesterday.value.series[0].data = yesterdayDht22Response.data.map((item) => item.temperature);
        optionDht22Yesterday.value.series[1].data = yesterdayDht22Response.data.map((item) => item.humidity);
        optionDht22Yesterday.value.xAxis.data = yesterdayDht22Response.data.map((item) => item.segment_interval_name);

        // BME680
        // Today data
        const todayBmeResponse = await axios.get('http://192.168.0.67/sensors/bme680_data/today/2');
        optionBmeToday.value.series[0].data = todayBmeResponse.data.map((item) => item.air_quality_percentage);
        optionBmeToday.value.xAxis.data = todayBmeResponse.data.map((item) => item.measured_at);

        // Yesterday aggregated data
        const yesterdayBmeResponse = await axios.get('http://192.168.0.67/history/bme680_data/2/today');
        optionBmeYesterday.value.series[0].data = yesterdayBmeResponse.data.map((item) => item.air_quality_percentage);
        optionBmeYesterday.value.xAxis.data = yesterdayBmeResponse.data.map((item) => item.segment_interval_name);
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
                    <v-chart class="chart" :option="optionDht22Today" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionDht22Yesterday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionBmeToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionBmeYesterday" autoresize />
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
