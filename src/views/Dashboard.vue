<script setup>
import { onMounted, ref, provide } from 'vue';

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

const optionDht22Today = ref(graphsService.generateTwoSeriesGraphOptions('Today raw values DHT22', 'Temperature', 'Humidity %', 10, 0, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'bar'));
const optionDht22Yesterday = ref(graphsService.generateTwoSeriesGraphOptions('Yesterday aggregated values DHT22', 'Temperature', 'Humidity %', 10, 0, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'bar'));
const optionBmeToday = ref(graphsService.generateOneLineGraphOptions('Air quality percentage', 'Air quality %', 40, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));
const optionBmeYesterday = ref(graphsService.generateOneLineGraphOptions('Yesterday aggregated air quality percentage', 'Air quality %', 40, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));
const optionBmeMeteoToday = ref(graphsService.generateTwoSeriesGraphOptions('Today BME meteo values', 'Atmospheric pressure', 'Humidity %', 900, 1090, 20, 100, 'rgba(165,22,237,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'line'));
const optionBmePressureToday = ref(graphsService.generateOneLineGraphOptions('Gas resistance today', 'Gas resistance', 0, 0, 'rgb(199,101,3)', 'rgba(199,101,3,0.44)'));

const lightIntensityToday = ref(graphsService.generateOneLineGraphOptions('Light intensity today', 'Lux value', 0, 0, 'rgb(199,196,3)', 'rgba(199,196,3,0.35)'));

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

        // Meteo data
        optionBmeMeteoToday.value.series[0].data = todayBmeResponse.data.map((item) => item.pressure);
        optionBmeMeteoToday.value.series[1].data = todayBmeResponse.data.map((item) => item.humidity);
        optionBmeMeteoToday.value.xAxis.data = todayBmeResponse.data.map((item) => item.measured_at);

        // Pressure
        optionBmePressureToday.value.series[0].data = todayBmeResponse.data.map((item) => item.gas_resistance);
        optionBmePressureToday.value.xAxis.data = todayBmeResponse.data.map((item) => item.measured_at);

        // Yesterday aggregated data
        const yesterdayBmeResponse = await axios.get('http://192.168.0.67/history/bme680_data/2/today');
        optionBmeYesterday.value.series[0].data = yesterdayBmeResponse.data.map((item) => item.air_quality_percentage);
        optionBmeYesterday.value.xAxis.data = yesterdayBmeResponse.data.map((item) => item.segment_interval_name);

        // TSL light
        const todayLight = await axios.get('http://192.168.0.67/sensors/tsl2591_data/today/3');
        lightIntensityToday.value.series[0].data = todayLight.data.map((item) => item.lux);
        lightIntensityToday.value.xAxis.data = todayLight.data.map((item) => item.measured_at);
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
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionBmeMeteoToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionBmePressureToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="lightIntensityToday" autoresize />
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
