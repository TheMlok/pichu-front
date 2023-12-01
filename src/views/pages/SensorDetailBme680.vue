<script setup>
import { onMounted, ref, provide } from 'vue';
import axios from 'axios';

const fetchData = async () => {
    try {
        console.log('blabla');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData(); // Fetch data when the component is mounted
});
</script>

<template>
    <div class="grid"></div>
</template>

<style></style>
