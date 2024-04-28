<template>
    <v-group
        :x="x"
        :y="y"
        @mouseenter="enter"
        @mouseleave="leave"
        @mousemove="move"
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
            :x="-36"
            :y="-26"
            :text="'S'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="-36"
            :y="14"
            :text="'R'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="24"
            :y="-26"
            :text="'Q'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="24"
            :y="12"
            :text="'Q'"
            :fontSize="12"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
        <v-text
            :x="24"
            :y="-3"
            :text="'-'"
            :fontSize="24"
            :fontFamily="'Calibri'"
            :fill="'rgba(67, 76, 94, 1)'"
        ></v-text>
         <Point
            :x="-50"
            :y="20"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
         <Point
            :x="-50"
            :y="-20"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
         <Point
            :x="50"
            :y="20"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
         <Point
            :x="50"
            :y="-20"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
    </v-group>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import Point from "./Point.vue"
import { useDigitCircuitStore } from "@/stores/digitCircuitStore.ts"

const props = defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    S: {
        type: Number,
        default: -1,
    },
    R: {
        type: Number,
        default: -1,
    }
});

let oldQ = 0;

const Q = computed(() => {
    if(props.S == -1 || props.R == -1) {
        return -1;
    }
    if(props.S == 0 && props.R == 0) {
        return oldQ;
    }
    return Number(!props.S || (!!props.R && !!oldQ));
});

const store = useDigitCircuitStore();

const dataValue = "M-40,30 L-40,-30 L40,-30 L40,30 L-40,30 M-50,20 L-40,20 M-50,-20 L-40,-20 M50,20 L40,20 M50,-20 L40,-20";
const backValue = "M-40,30 L-40,-30 L40,-30 L40,30 L-40,30";

const isPointVisible = ref(false);

function enter(event: any) {
    isPointVisible.value = true;
    store.annotation.value = `R: ${props.R}<br />S: ${props.S}<br />Q: ${Q.value}`;
    store.annotation.x = event.evt.layerX;
    store.annotation.y = event.evt.layerY;
    store.annotation.visible = true;
}

function leave() {
    isPointVisible.value = false;
    store.annotation.visible = false;
}

function move(event: any) {
    store.annotation.x = event.evt.layerX;
    store.annotation.y = event.evt.layerY;
}
</script>

<style lang="scss" scoped>
</style>

