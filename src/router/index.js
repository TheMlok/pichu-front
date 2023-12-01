import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const sensorDetailRoutes = [
    {
        path: '/pages/sensor_detail/:sensorType/:id',
        name: 'sensorDetail',
        component: () => import('@/views/pages/SensorDetailDht22.vue'), // Set a default component
        props: true,
        beforeEnter: (to, from, next) => {
            const sensorType = to.params.sensorType;

            // Determine the component path based on sensor type
            switch (sensorType) {
                case 'dht22':
                    to.component = () => import('@/views/pages/SensorDetailDht22.vue');
                    break;
                case 'bme680':
                    to.component = () => import('@/views/pages/SensorDetailBme680.vue');
                    break;
                case 'tsl2591':
                    to.component = () => import('@/views/pages/SensorDetailTsl2591.vue');
                    break;
                default:
                    // Use a default component or handle unknown types
                    to.component = () => import('@/views/pages/SensorDetailDht22.vue');
            }

            next();
        }
    }
];

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
                ...sensorDetailRoutes
            ]
        }
    ]
});

export default router;
