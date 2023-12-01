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
                    path: '/pages/sensor_detail/:id',
                    name: 'sensorDetail',
                    component: () => import('@/views/pages/SensorDetail.vue')
                }
            ]
        }
    ]
});

export default router;
