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
        <v-text
            :x="3"
            :y="-12"
            :text="'+'"
            :fontSize="24"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="-16"
            :y="-14"
            :text="'-'"
            :fontSize="24"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="-10"
            :y="-14"
            :text="'-'"
            :fontSize="24"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
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

const dataValue = "M-40,0 L-20,0 M40,0 L20,0 A20,20,0,1,0,-20,0 A20,20,0,1,0,20,0";
const backValue = "M20,0 A20,20,0,1,0,-20,0 A20,20,0,1,0,20,0";

const isPointVisible = ref(false)

function enter() {
    isPointVisible.value = true;
}

function out() {
    isPointVisible.value = false;
}
</script>

<style lang="scss" scoped>
</style>

