<template>
    <div class="h-full w-full">
        <div ref="chartRef"></div>
        <button @click="clickFunc">点击</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import Plotly from 'plotly.js-dist';

const chartRef = ref();


const data = reactive([
    {
        x: [10, 20, 30, 40, 50, 60],
        y: [10, 20, 30, 40, 50, 60],
        mode: 'lines',
        hoverinfo: 'none'
        // type: 'scatter'
    },
]);

const layout = reactive({
    width: 900,
    height: 900,
    annotations: [
        {
            x: 2,
            y: 2,
            text: 'Custom Annotation',
            showarrow: false,
            ax: 0,
            ay: -40,
            hovertext: 'Custom Hover Text'
        }
    ],
    xaxis: {
        range: [0, 100],
        showticklabels: false,
    },
    yaxis: {
        range: [0, 100],
        showticklabels: false,
    },
});

function clickFunc() {
    data[0].x = [10, 20, 30, 40];
    data[0].y = [10, 20, 40, 60];
    Plotly.update(chartRef.value, data, layout);
}

onMounted(() => {
    Plotly.newPlot(chartRef.value, data, layout);


    chartRef.value.on('plotly_click', function(eventData: any) {
        console.log(123);
    });

    chartRef.value.on('plotly_hover', function(eventData: any) {
      const point = eventData.points[0];
      const x = point.x;
      const y = point.y;

      const annotation = {
        x: x,
        y: y,
        text: 'ddeemmoo',
        showarrow: false,
        xanchor: 'left',
        yanchor: 'bottom'
      };

      Plotly.relayout(chartRef.value, {annotations: [annotation]});
    });

    chartRef.value.on('plotly_unhover', function(eventData: any) {
      Plotly.relayout(chartRef.value, {annotations: []});
    });
});
</script>
