<template>
    <v-group
        :x="x"
        :y="y"
        :visible="visible"
        :index="id"
        :rotation="rotate"
        :scaleX="scaleX"
        :scaleY="scaleY"
        @mouseenter="enter"
        @mouseleave="leave"
        @mousemove="move"
        @contextmenu="rigthClick"
        @dblclick="dbclick"
        @click="click"
    >
        <v-path
            :data="backValue"
            :fill="colorStr"
        ></v-path>
        <v-path
            :="valueConfig"
        ></v-path>

        <v-group
            @mousedown="drawLine($event, 'in')"
            @mouseup="drawLineDone($event, 'in')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="inValue"
            ></v-path>
            <Point
                :x="-30"
                :y="0"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>
    </v-group>
</template>

<script lang="ts" setup>
import { useDigitCircuitStore } from "@/stores/digitCircuitStore.ts"
import { ref, computed, watch } from "vue"
import Point from "./Point.vue"

const props = defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    inDependence: {
        type: Array<number>,
        default: [-1, -1, -1],
    },
    outDependence: {
        type: Array<number>,
        default: [-1, -1, -1],
    },
    in: {
        type: Array<number>,
        default: [-1, -1, -1],
    },
    out: {
        type: Array<number>,
        default: [-1, -1, -1],
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    },
    id: {
        type: Number,
        default: -1,
    },
    rotate: {
        type: Number,
        default: 0,
    },
    scaleX: {
        type: Number,
        default: 1,
    },
    scaleY: {
        type: Number,
        default: 1,
    },
});

const store = useDigitCircuitStore();
const isPointVisible = ref(false);
const colorIndex = ref(0);
const selected = ref(false);

const valueConfig = computed(() => {
    if(props.isPreview) {
        return {
            stroke: 'rgba(173, 181, 189, 1)',
            strokeWidth: 4,
            data: dataValue,
            hitStrokeWidth: 7
        }
    } else {
        return {
            stroke: selected.value ? 'rgba(255, 37, 0, 1)' :'rgba(67, 76, 94, 1)',
            strokeWidth: selected.value ? 3 : 2,
            data: dataValue,
            hitStrokeWidth: 7
        }
    }
});

const colorStr = computed(() => {
    if(props.in[0] === 1) {
        if(colorIndex.value === 0) {
            return "rgba(255, 212, 59, 1)"
        } else if(colorIndex.value === 1) {
            return "rgba(240, 82, 82, 1)"
        } else if(colorIndex.value === 2) {
            return "rgba(64, 192, 87, 1)"
        }
    }
    return "rgba(255, 255, 255, 1)"
});

const dataValue = "M25,0 A15,15,0,1,0,-5,0 A15,15,0,1,0,25,0";
const inValue = "M-30,0 L-5,0";
const backValue = "M25,0 A15,15,0,1,0,-5,0 A15,15,0,1,0,25,0"

function enter(event: any) {
    if(props.isPreview) {return;}
    isPointVisible.value = true;
    store.annotation.value = `in: ${props.in[0]}`;
    store.annotation.x = event.evt.layerX;
    store.annotation.y = event.evt.layerY;
    store.annotation.visible = true;
    store.global.hover = props.id;
}

function leave() {
    if(props.isPreview) {return;}
    isPointVisible.value = false;
    store.annotation.visible = false;
    if(store.global.hover === props.id) {store.global.hover = -1;}
}

function move(event: any) {
    if(props.isPreview) {return;}
    store.annotation.x = event.evt.layerX;
    store.annotation.y = event.evt.layerY;
}

function dbclick() {
    colorIndex.value = (colorIndex.value + 1) % 3;
}

function rigthClick(event: any) {
    event.evt.preventDefault();
    store.menu.visible = true;
    store.menu.x = event.evt.layerX;
    store.menu.y = event.evt.layerY;
    store.menu.id = props.id;
}

function click(event: any) {
    if(props.isPreview || event.evt.button !== 0) {return;}
    if(store.global.ctrl) {
        store.global.selected.push(props.id);
    } else {
        store.global.selected = [props.id];
    }
}

function drawLine(event: any, valueStr: string) {
    if(event.evt.button !== 0) {return;}
    store.drawLine.is = true;

    const position = store.blubValues(props.id);
    if(valueStr === "in") {
        store.drawLine.end = position[0];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 0;
    } else {
        store.drawLine.is = false;
    }
}

function drawLineDone(event: any, valueStr: string) {
    if(event.evt.button !== 0) {return;}

    const position = store.blubValues(props.id);
    if(valueStr === "in" && store.drawLine.beginId !== -1) {
        store.drawLine.endId = props.id;
        store.drawLine.end = position[0];
        store.drawLine.endNum = 0;
        store.addLine();
    }

    store.drawLine.is = false;
    store.drawLine.begin = []
    store.drawLine.end = []
    store.drawLine.beginId = -1
    store.drawLine.endId = -1
}

watch(() => store.global.selected, () => {
    if(props.isPreview) {return;}
    if(store.global.selected.includes(props.id)) {
        selected.value = true;
    } else {
        selected.value = false;
    }
}, {deep: true});

watch([() => props.rotate, () => props.scaleX, () => props.scaleY, () => props.x, () => props.y], () => {
    if(props.isPreview) {return;}

    const position = store.blubValues(props.id);
    const inLine = store.getLine(props.inDependence[0]);
    if(inLine !== undefined) {
        inLine.points = [inLine.points[0], inLine.points[1], ...position[0]];
    }
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>

