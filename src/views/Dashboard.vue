<script setup>
import { onMounted, ref, provide, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import axios from 'axios';

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

provide(THEME_KEY, 'light');

const { isDarkTheme } = useLayout();

const products = ref(null);

const lineOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

const option = ref({
    title: {
        text: 'Temperature DHT22',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)' // Sem si pak dam ten timestamp taky
    },
    xAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        min: 0, // Set the minimum value of the x-axis
        splitNumber: 10,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        type: 'value',
        nameLocation: 'center',
        nameGap: 50,
        nameTextStyle: {
            fontWeight: 'bold' // Make the xAxis name bold
        },
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Temperature']
    },
    series: [
        {
            name: 'Temperature DHT22',
            type: 'line',
            radius: '55%',
            data: [], // Empty array for the fetched data
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
});

const fetchData = async () => {
    try {
        const response = await axios.get('http://192.168.0.67/sensors/dht22_data/today/1');
        const transformedData = response.data.map((item) => ({
            value: item.temperature,
            name: item.measured_at
        }));

        // Update the series data in the ECharts option
        option.value.series[0].data = transformedData;
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
        <div class="col-12 xl:col-6">
            <div class="card">
                <div class="chart-container">
                    <v-chart class="chart" :option="option" autoresize />
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
