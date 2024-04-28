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
        >
        </v-path>

        <v-text
            :x="-46"
            :y="-6"
            :text="'D'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="34"
            :y="14"
            :text="'Q'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="34"
            :y="-26"
            :text="'Q'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="34"
            :y="-2"
            :text="'-'"
            :fontSize="24"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="-12"
            :y="6"
            :text="'CLK'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <Point
            :x="60"
            :y="20"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
        <Point
            :x="60"
            :y="-20"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
        <Point
            :x="-60"
            :y="0"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
        <Point
            :x="0"
            :y="40"
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

const dataValue = "M-50,-30 L50,-30 L50,30 L-50,30 L-50,-30 M-10,30 L0,20 L10,30 M-60,0 L-50,0 M60,20 L50,20 M60,-20 L50,-20 M0,40 L0,30";
const backValue = "M-50,-30 L50,-30 L50,30 L-50,30 L-50,-30"

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


