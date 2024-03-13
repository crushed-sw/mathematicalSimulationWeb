<template>
    <div v-if="functionStore.focus === -1" class="w-full">
        <SelectButton
            v-model="coordinateValue"
            :options="coordinateOptions"
            aria-labelledby="basic"
        />

        <ToggleButton
            v-model="xAxisCheck"
            onLabel="显示X轴"
            offLabel="隐藏X轴"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />

        <ToggleButton
            v-model="yAxisCheck"
            onLabel="显示Y轴"
            offLabel="隐藏Y轴"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />

        <ToggleButton
            v-model="textCheck"
            onLabel="显示刻度"
            offLabel="隐藏刻度"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />

        <ToggleButton
            v-model="minorScaleCheck"
            onLabel="显示次要刻度线"
            offLabel="隐藏次要刻度线"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />

        <ToggleButton
            v-model="grideCheck"
            onLabel="显示网格"
            offLabel="隐藏网格"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />

        <ToggleButton
            v-model="triangleNumber"
            onLabel="普通"
            offLabel="三角"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />

        <ToggleButton
            v-model="showNumbers"
            onLabel="数值"
            offLabel="符号"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
        />
    </div>
</template>

<script lang="ts" setup>
import SelectButton from 'primevue/selectbutton';
import ToggleButton from 'primevue/togglebutton';
import { useFunctionStore } from "@/stores/functionStore"
import { ref, reactive, watch } from "vue"

const functionStore = useFunctionStore();

const coordinateValue = ref('直角坐标系');
const xAxisCheck = ref(functionStore.canvasConfig.isXAxis);
const yAxisCheck = ref(functionStore.canvasConfig.isYAxis);
const textCheck = ref(functionStore.canvasConfig.isScaleText);
const minorScaleCheck = ref(functionStore.canvasConfig.isMinorAxis);
const grideCheck = ref(functionStore.canvasConfig.isGride);
const showNumbers = ref(functionStore.canvasConfig.showNumbers);
const triangleNumber = ref(functionStore.canvasConfig.triangleNumber);

let prevCoordinate = functionStore.canvasConfig.coordinate;

const coordinateOptions = reactive(['直角坐标系', '极坐标系']);

watch(coordinateValue, () => {
    if(coordinateValue.value === "直角坐标系") {
        functionStore.canvasConfig.coordinate = 1;
        functionStore.canvasConfig.isGride = true;
        prevCoordinate = 1;
        grideCheck.value = true;
    } else if(coordinateValue.value === "极坐标系") {
        functionStore.canvasConfig.coordinate = 2;
        functionStore.canvasConfig.isGride = true;
        prevCoordinate = 2;
        grideCheck.value = true;
    } else {
        functionStore.canvasConfig.coordinate = 0;
        functionStore.canvasConfig.isGride = false;
        grideCheck.value = false;
    }
});

watch(xAxisCheck, (newValue) => {
    functionStore.canvasConfig.isXAxis = newValue;
});

watch(yAxisCheck, (newValue) => {
    functionStore.canvasConfig.isYAxis = newValue;
});

watch(textCheck, (newValue) => {
    functionStore.canvasConfig.isScaleText = newValue;
});

watch(minorScaleCheck, (newValue) => {
    functionStore.canvasConfig.isMinorAxis = newValue;
});

watch(grideCheck, (newValue) => {
    functionStore.canvasConfig.isGride = newValue;
    if(newValue === true) {
        functionStore.canvasConfig.coordinate = prevCoordinate;
        if(prevCoordinate === 1) {
            coordinateValue.value = "直角坐标系";
        } else if(prevCoordinate === 2) {
            coordinateValue.value = "极坐标系";
        }
    } else {
        functionStore.canvasConfig.coordinate = 0;
        coordinateValue.value = "";
    }
});

watch(showNumbers, (newValue) => {
    functionStore.canvasConfig.showNumbers = newValue;
});

watch(triangleNumber, (newValue) => {
    functionStore.canvasConfig.triangleNumber = newValue;
});
</script>

<style lang="scss" scoped>

</style>
