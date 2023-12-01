<script setup>
import { onMounted, ref, provide } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import GraphsService from '@/service/GraphsService';
import VChart, { THEME_KEY } from 'vue-echarts';

provide(THEME_KEY, 'light');

const graphsService = new GraphsService();

const sensorData = ref(null);

const optionToday = ref(graphsService.generateOneLineGraphOptions('Air quality percentage', 'Air quality %', 80, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));
const optionYesterday = ref(graphsService.generateOneLineGraphOptions('Yesterday aggregated air quality percentage', 'Air quality %', 80, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));
const optionMeteoToday = ref(graphsService.generateTwoSeriesGraphOptions('Today BME meteo values', 'Atmospheric pressure', 'Humidity %', 900, 1090, 20, 100, 'rgba(165,22,237,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'line'));
const optionPressureToday = ref(graphsService.generateOneLineGraphOptions('Gas resistance today', 'Gas resistance', 0, 0, 'rgb(199,101,3)', 'rgba(199,101,3,0.44)'));
const optionMeteoYesterday = ref(graphsService.generateTwoSeriesGraphOptions('Yesterday BME meteo values', 'Atmospheric pressure', 'Humidity %', 900, 1090, 20, 100, 'rgba(165,22,237,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'line'));
const optionPressureYesterday = ref(graphsService.generateOneLineGraphOptions('Yesterday gas resistance', 'Gas resistance', 0, 0, 'rgb(199,101,3)', 'rgba(199,101,3,0.44)'));
const optionTempHumToday = ref(graphsService.generateTwoSeriesGraphOptions('Today temperature and humidity values', 'Temperature', 'Humidity %', 10, 50, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'bar'));
const optionTempHumYesterday = ref(graphsService.generateTwoSeriesGraphOptions('Yesterday temperature and humidity values', 'Temperature', 'Humidity %', 10, 50, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'bar'));

// TODO spojit grafy gas_resistance a pressure a pak vlhkost a teplotu
const fetchData = async () => {
    try {
        const route = useRoute(); // Access route object here
        const id = route.params.id; // Retrieve the id

        const sensorResponse = await axios.get(`http://192.168.0.67/sensors/${id}`);
        sensorData.value = sensorResponse.data;

        const todayResponse = await axios.get(`http://192.168.0.67/sensors/bme680_data/today/${id}`);
        optionToday.value.series[0].data = todayResponse.data.map((item) => item.air_quality_percentage);
        optionToday.value.xAxis.data = todayResponse.data.map((item) => item.measured_at);

        const yesterdayResponse = await axios.get(`http://192.168.0.67/history/bme680_data/${id}/yesterday`);
        optionYesterday.value.series[0].data = yesterdayResponse.data.map((item) => item.air_quality_percentage);
        optionYesterday.value.xAxis.data = yesterdayResponse.data.map((item) => item.segment_interval_name);

        optionMeteoToday.value.series[0].data = todayResponse.data.map((item) => item.pressure);
        optionMeteoToday.value.series[1].data = todayResponse.data.map((item) => item.humidity);
        optionMeteoToday.value.xAxis.data = todayResponse.data.map((item) => item.measured_at);

        optionTempHumToday.value.series[0].data = todayResponse.data.map((item) => item.temperature);
        optionTempHumToday.value.series[1].data = todayResponse.data.map((item) => item.humidity);
        optionTempHumToday.value.xAxis.data = todayResponse.data.map((item) => item.measured_at);

        optionTempHumYesterday.value.series[0].data = yesterdayResponse.data.map((item) => item.temperature);
        optionTempHumYesterday.value.series[1].data = yesterdayResponse.data.map((item) => item.humidity);
        optionTempHumYesterday.value.xAxis.data = yesterdayResponse.data.map((item) => item.segment_interval_name);

        // Pressure
        optionPressureToday.value.series[0].data = todayResponse.data.map((item) => item.gas_resistance);
        optionPressureToday.value.xAxis.data = todayResponse.data.map((item) => item.measured_at);

        optionMeteoYesterday.value.series[0].data = yesterdayResponse.data.map((item) => item.pressure);
        optionMeteoYesterday.value.series[1].data = yesterdayResponse.data.map((item) => item.humidity);
        optionMeteoYesterday.value.xAxis.data = yesterdayResponse.data.map((item) => item.segment_interval_name);

        // Pressure
        optionPressureYesterday.value.series[0].data = yesterdayResponse.data.map((item) => item.gas_resistance);
        optionPressureYesterday.value.xAxis.data = yesterdayResponse.data.map((item) => item.segment_interval_name);
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
                <h3 v-if="sensorData">{{ sensorData.name }}</h3>
                <div v-else>Loading...</div>
                <div class="grid">
                    <div class="col-6 xl:col-6">
                        <p v-if="sensorData"><b>Description:</b> {{ sensorData.description }}</p>
                        <div v-else>Loading...</div>
                        <p v-if="sensorData"><b>Sensor name:</b> {{ sensorData.sensor_name }}</p>
                        <div v-else>Loading...</div>
                    </div>

                    <div class="col-6 xl:col-6">
                        <p v-if="sensorData"><b>Manufacturer data:</b> {{ sensorData.manufacturer_data }}</p>
                        <div v-else>Loading...</div>
                        <p v-if="sensorData"><b>Created at:</b> {{ sensorData.created_at }}</p>
                        <div v-else>Loading...</div>
                    </div>
                </div>
            </div>
        </div>
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
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionMeteoToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionMeteoYesterday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionPressureToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionPressureYesterday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionTempHumToday" autoresize />
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="optionTempHumYesterday" autoresize />
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
