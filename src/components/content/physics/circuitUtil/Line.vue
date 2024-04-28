<template>
    <v-group
        :visible="visible"
        @mouseenter="enter"
        @mouseleave="leave"
        @mousemove="move"
    >
        <v-line
            :points="newPoints.flat()"
            :stroke="'rgba(67, 76, 94, 1)'"
            :strokeWidth="2"
            :hitStrokeWidth="5"
        ></v-line>
        <Point
            v-for="point in newPoints"
            :x="point[0]"
            :y="point[1]"
            :ishover="true"
            :visible="isPointVisible"
        ></Point>
    </v-group>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import Point from "./Point.vue"
import { useDigitCircuitStore } from "@/stores/digitCircuitStore.ts"

const props = defineProps({
    points: {
        type: Array<number>,
        required: true,
    },
    in: {
        type: Number,
        default: -1,
    },
    inId: {
        type: Number,
        default: -1,
    },
    outId: {
        type: Number,
        default: -1,
    },
    inDependence: {
        type: Number,
        default: -1,
    },
    outDependence: {
        type: Number,
        default: -1,
    },
    visible: {
        type: Boolean,
        default: true,
    },
    id: {
        type: Number,
        default: -1,
    }
});

const store = useDigitCircuitStore();
const isPointVisible = ref(false);

const newPoints = computed(() => {
    const beginX = Math.floor((props.points[0] + 10) / 20) * 20;
    const beginY = Math.floor((props.points[1] + 10) / 20) * 20;
    const endX = Math.floor((props.points[2] + 10) / 20) * 20;
    const endY = Math.floor((props.points[3] + 10) / 20) * 20;

    if(beginX === endX || beginY === endY) {
        return [[beginX, beginY], [endX, endY]];
    } else {
        const disX = Math.abs(beginX - endX);
        const disY = Math.abs(beginY - endY);
        if(disX > disY) {
            return [[beginX, beginY], [beginX, endY], [endX, endY]];
        } else {
            return [[beginX, beginY], [endX, beginY], [endX, endY]];
        }
    }
});

function enter(event: any) {
    if(store.drawLine.is) {return;}
    isPointVisible.value = true;
    store.annotation.value = `value: ${props.in}`;
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

watch(() => props.in, () => {
    const inElement = store.getElementInArr(props.inId);
    if(inElement !== undefined) {
        inElement.in[props.inDependence] = props.in;
    }
}, {deep: true});
</script>

<style lang="scss" scoped>

</style>
