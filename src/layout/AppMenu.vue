<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import axios from 'axios';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Graphs',
        items: [
            { label: 'Daily graphs', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/formlayout' },
            { label: 'List locations', icon: 'pi pi-fw pi-list', to: '/uikit/formlayout' },
            { label: 'List devices', icon: 'pi pi-fw pi-list', to: '/uikit/formlayout' },
            { label: 'List sensors', icon: 'pi pi-fw pi-list', to: '/uikit/formlayout' }
        ]
    },
    {
        label: 'Locations',
        items: []
    }
]);

// Update the 'Locations' menu items based on the API response
const fetchData = async () => {
    try {
        const locations = await axios.get('http://192.168.0.67/locations');

        model.value[2].items = locations.data.map((location) => ({
            label: location.name,
            icon: 'pi pi-fw pi-list', // Assuming a default icon
            items: [] // You can add sub-items here if needed
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData(); // Fetch data when the component is mounted
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
