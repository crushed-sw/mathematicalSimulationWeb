<template>
    <v-group
        :x="x"
        :y="y"
        @mouseenter="enter"
        @mouseleave="out"
    >
        <v-path
            :data="backValue"
            :fill="'rgba(0, 0, 0, 0)'"
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

const dataValue = "M-40,0 L-24,0 L-20,10 L-12,-10 L-4,10 L4,-10 L12,10 L20,-10 L24,0 L40,0";
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

