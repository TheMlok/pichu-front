<script setup>
import { onMounted, ref, provide } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import GraphsService from '@/service/GraphsService';
import VChart from 'vue-echarts';

const graphsService = new GraphsService();

const sensorData = ref(null);

const optionToday = ref(graphsService.generateOneLineGraphOptions('Air quality percentage', 'Air quality %', 40, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));
const optionYesterday = ref(graphsService.generateOneLineGraphOptions('Yesterday aggregated air quality percentage', 'Air quality %', 40, 100, 'rgb(143,199,3)', 'rgba(143,199,3,0.65)'));

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

<style></style>
