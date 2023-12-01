<script setup>
import { onMounted, ref, provide } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import VChart, { THEME_KEY } from 'vue-echarts';
import GraphsService from '@/service/GraphsService';

const graphsService = new GraphsService();

provide(THEME_KEY, 'light');

const sensorData = ref(null);

const optionToday = ref(graphsService.generateTwoSeriesGraphOptions('Today raw values DHT22', 'Temperature', 'Humidity %', 10, 0, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'bar'));
const optionYesterday = ref(graphsService.generateTwoSeriesGraphOptions('Yesterday aggregated values DHT22', 'Temperature', 'Humidity %', 10, 0, 20, 100, 'rgba(237,22,22,0.53)', 'rgba(3,13,199,0.6)', 'rgba(3,13,199,0.16)', 'bar'));

const fetchData = async () => {
    try {
        const route = useRoute(); // Access route object here
        const id = route.params.id; // Retrieve the id

        const sensorResponse = await axios.get(`http://192.168.0.67/sensors/${id}`);
        sensorData.value = sensorResponse.data;

        const todayData = await axios.get(`http://192.168.0.67/sensors/dht22_data/today/${id}`);

        optionToday.value.series[0].data = todayData.data.map((item) => item.temperature);
        optionToday.value.series[1].data = todayData.data.map((item) => item.humidity);
        optionToday.value.xAxis.data = todayData.data.map((item) => item.measured_at);

        const yesterdayData = await axios.get(`http://192.168.0.67/history/dht22_data/${id}/yesterday`);
        optionYesterday.value.series[0].data = yesterdayData.data.map((item) => item.temperature);
        optionYesterday.value.series[1].data = yesterdayData.data.map((item) => item.humidity);
        optionYesterday.value.xAxis.data = yesterdayData.data.map((item) => item.segment_interval_name);
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
    </div>
</template>

<style>
.chart-container {
    width: 100%; /* Set width as needed */
    height: 400px; /* Set height as needed */
}
</style>
