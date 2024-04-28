<template>
    <v-group
        :x="x"
        :y="y"
        @mouseenter="enter"
        @mouseleave="out"
    >
        <v-path
            :fill="'rgba(0, 0, 0, 0)'"
            :data="backValue"
        ></v-path>
        <v-path
            :stroke="'rgba(67, 76, 94, 1)'"
            :strokeWidth="2"
            :data="dataValue"
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

const dataValue = "M-40,0 L-5,0 M40,0 L5,0 M-5,-20 L-5,20 M5,-20 L5,20";
const backValue = "M-5,-20 L5,-20 L5,20 L-5,20 L-5,-20"

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

