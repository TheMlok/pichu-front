import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/daily_graphs',
                    name: 'dailyGraphs',
                    component: () => import('@/views/pages/DailyGraphs.vue')
                },
                {
                    path: '/pages/locations',
                    name: 'locations',
                    component: () => import('@/views/pages/Locations.vue')
                },
                {
                    path: '/pages/devices',
                    name: 'devices',
                    component: () => import('@/views/pages/Devices.vue')
                },
                {
                    path: '/pages/sensors',
                    name: 'sensors',
                    component: () => import('@/views/pages/Sensors.vue')
                },
                {
                    path: '/pages/sensor_detail/dht22/:id',
                    name: 'sensorsDht',
                    component: () => import('@/views/pages/SensorDetailDht22.vue')
                },
                {
                    path: '/pages/sensor_detail/bme680/:id',
                    name: 'sensorsBme',
                    component: () => import('@/views/pages/SensorDetailBme680.vue')
                },
                {
                    path: '/pages/sensor_detail/tsl2591/:id',
                    name: 'sensorsTsl',
                    component: () => import('@/views/pages/SensorDetailTsl2591.vue')
                }
            ]
        }
    ]
});

export default router;
