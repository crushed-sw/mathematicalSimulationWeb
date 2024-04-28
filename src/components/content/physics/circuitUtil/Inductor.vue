<template>
    <v-group
        :x="x"
        :y="y"
        @mouseenter="enter"
        @mouseleave="out"
    >
        <v-path
            :data="backValue"
            :fill="'rgba(255, 255, 255, 1)'"
        ></v-path>
        <v-path
            :stroke="'rgba(67, 76, 94, 1)'"
            :strokeWidth="2"
            :data="dataValue"
            :hitStrokeWidth="7"
        ></v-path>
        <Point
            :x="-40"
            :y="0"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
        <Point
            :x="40"
            :y="0"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
    </v-group>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Point from "./Point.vue"

defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    }
});

const dataValue = "M-40,0 L-27.5,0 M40,0 L27.5,0 M-27.5,0 C-24.5,10,-15.5,10,-12.5,0 C-13.5,-10,-15.5,-10,-17.5,0 C-14.5,10,-5.5,10,-2.5,0 C-3.5,-10,-5.5,-10,-7.5,0 C-4.5,10,4.5,10,7.5,0 C6.5,-10,4.5,-10,2.5,0 C5.5,10,15.5,10,18.5,0 C17.5,-10,15.5,-10,13.5,0 C16.5,10,24.5,10,27.5,0";
const backValue = "M-20,-10 L-20,10 L20,10 L20,-10 L-20,-10"

const isPointVisible = ref(false);

function enter() {
    isPointVisible.value = true;
}

function out() {
    isPointVisible.value = false;
}
</script>

<style lang="scss" scoped>
</style>

