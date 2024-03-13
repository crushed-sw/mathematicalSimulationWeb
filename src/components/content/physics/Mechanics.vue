<template>
    <div ref="chartRef"></div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue"
import Plotly from 'plotly.js-dist-min'

let xScope = reactive([-20, 20]);
let yScope = reactive([-20, 20]);

let x = [];
let y = [];
let z = [];

const dz = [];

function reset() {
    x = [];
    y = [];
    z = [];
    const step = 0.1;
    for (let i = xScope[0] + 2; i <= xScope[1]; i += step) {
      for (let j = yScope[0] + 2; j <= yScope[1]; j += step) {
        x.push(i);
        y.push(j);
        z.push(Math.sin(i)-Math.cos(j)); // 隐函数的定义
      }
    }
}



// for (let i = -10; i <= 10; i += 0.1) {
//   const temp = 1 / i;
//     if(!isNaN(temp)) {
//         dx.push(i);
//         dy.push(temp);
//     }
// }

const chartRef = ref();
function dragHandle(data: any){

}

onMounted(() => {
    reset();
    const data = [
        {
            x,
            y,
            z,
            type: 'contour',
            contours: {
                start: 0,
                end: 0,
                size: 1,
                showlines: true
            },
            line: {
                width: 2,
                // color: "red"
            },
            // hovertemplate: 'Value: %{z}<extra></extra>',
            colorscale: [[0, 'rgba(255, 0, 0, 0)'], [1, 'rgba(0, 255, 0, .3)']], // 设置线的颜色
            // colorscale: [[0, 'rgba(0, 0, 0, 0)'], [1, 'rgba(0, 0, 0, 0)']], // 设置线的颜色
            showscale: false
            // mode: 'lines',
        },
        // {
        //     x: dx,
        //     y: dy,
        //     type: 'scatter',
        //     mode: 'lines',
        // }
    ];

    const layout = {
        width: 900,
        height: 900,
        xaxis: {
            showgrid: true,
            scaleanchor: 'y',  // 设置x轴的比例锚点为y轴
            scaleratio: 1,
            range: xScope,
        },
        yaxis: {
            showgrid: true,
            range: yScope,
        },
        dragmode: 'pan',
    };

    const global = {
        scrollZoom: true,
        displayModeBar: false,
    }

    Plotly.newPlot(chartRef.value, data, layout, global);

    chartRef.value.on('plotly_click', function(data: any){
        console.log(data);
    });

    chartRef.value.on('plotly_hover', function(data: any){
        const dataType = data.points[0].data.type;
        // Plotly.restyle(chartRef.value, 'hovertemplate', [['Value: %{x}<extra></extra>']], [data.points[0].data.x]);
        if(dataType === "scatter") {
            // console.log(data.points[0].x, data.points[0].y);
            // Plotly.restyle(chartRef.value, 'hovertemplate', [['Value: %{x}<extra></extra>']], [data.points[0]]);
        } else if(dataType === "contour") {
            if(data.points[0].z < 0.01) {
                // console.log(data.points[0].x, data.points[0].y, data.points[0].z);
            } else {

            }
        }

    });

    console.log(chartRef.value);
    // chartRef.value.on('plotly_relayouting', dragHandle);

    chartRef.value.on('plotly_relayout', (event: any) => {

    xScope[0] = data["xaxis.range[0]"];
    xScope[1] = data["xaxis.range[1]"];
    yScope[0] = data["yaxis.range[0]"];
    yScope[1] = data["yaxis.range[1]"];

    console.log(xScope, yScope);
    reset();
    console.log(123);

    const datas = [
        {
            x,
            y,
            z,
            type: 'contour',
            contours: {
                start: 0,
                end: 0,
                size: 1,
                showlines: true
            },
            line: {
                width: 2,
                // color: "red"
            },
            // hovertemplate: 'Value: %{z}<extra></extra>',
            colorscale: [[0, 'rgba(255, 0, 0, 1)'], [1, 'rgba(0, 0, 0, 1)']], // 设置线的颜色
            showscale: false
            // mode: 'lines',
        },
        // {
        //     x: dx,
        //     y: dy,
        //     type: 'scatter',
        //     mode: 'lines',
        // }
    ];

        const layout = {
        width: 900,
        height: 900,
        xaxis: {
            showgrid: true,
            scaleanchor: 'y',  // 设置x轴的比例锚点为y轴
            scaleratio: 1,
            range: xScope,
        },
        yaxis: {
            showgrid: true,
            range: yScope
        },
        dragmode: 'pan',
    };

    const global = {
        scrollZoom: true,
        displayModeBar: false,
    }



    Plotly.update(chartRef.value, datas, layout, global);

    });
});
</script>

<style lang="scss" scoped>

</style>
