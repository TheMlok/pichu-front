<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref } from 'vue';
import axios from 'axios';

const fetchedSensors = ref([]);

const fetchData = async () => {
    try {
        const locations = await axios.get('http://192.168.0.67/sensors');
        fetchedSensors.value = locations.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData(); // Fetch data when the component is mounted
});
</script>

<template>
    <div class="card mt-3">
        <DataTable var="row" :value="fetchedSensors" :rowClass="(data) => `quality-${data.id}`">
            <Column field="icons" header="" class="font-bold" />
            <Column field="id" header="ID" class="font-bold">
                <template #body="{ data }">
                    <router-link :to="`locations/${data?.id}`" style="color: black">
                        {{ data?.id }}
                    </router-link>
                </template>
            </Column>
            <Column field="name" header="Name" class="font-bold" />
            <Column field="sensor_name" header="Sensor name" />
            <Column field="sensor_type" header="Sensor type" class="font-bold" />
            <Column field="device_id" header="Device ID" class="font-bold" />
            <Column field="manufacturer_data" header="Manufacturer data" />
            <Column field="description" header="Description" />
            <Column field="created_at" header="Created at" />
        </DataTable>
    </div>
</template>

<style lang="scss" scoped></style>
