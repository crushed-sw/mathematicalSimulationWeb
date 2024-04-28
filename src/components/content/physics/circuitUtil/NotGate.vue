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
        @click="click"
    >
        <v-path
            :data="backValue"
            :fill="'rgba(255, 255, 255, 1)'"
        ></v-path>

        <v-path
            :="valueConfig"
        ></v-path>

        <v-group
            @mousedown="drawLine($event, 'in')"
            @mouseup="drawLineDone($event, 'in')"
        >
            <v-path
                :data="inLine"
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
            ></v-path>
            <Point
                :x="-40"
                :y="0"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>

        <v-group
            @mousedown="drawLine($event, 'out')"
            @mouseup="drawLineDone($event, 'out')"
        >
            <v-path
                :data="outLine"
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
            ></v-path>
            <Point
                :x="40"
                :y="0"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>
    </v-group>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
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
    isPreview: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
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

const isPointVisible = ref(false);
const store = useDigitCircuitStore();
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

const dataValue = "M20,0 L-15,20 L-15,-20 L20,0";
const inLine = "M-40,0 L-15,0";
const outLine = "M30,0 L40,0 M20,0 A5,5,0,1,0,30,0 A5,5,0,1,0,20,0";
const backValue = "M-15,-20 L20,0 L-15,20 L-15,-20"

function out() {
    if(props.in[0] == -1) {
        return -1;
    }
    return Number(!props.in[0]);
}

function enter(event: any) {
    if(props.isPreview) {return;}
    isPointVisible.value = true;
    store.annotation.value = `in: &nbsp${props.in[0]}<br />out: ${out()}`;
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

function click(event: any) {
    console.log(props.inDependence, props.outDependence, props.in);
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

    const position = store.oneInputGateValues(props.id);

    if(valueStr === "in") {
        store.drawLine.end = position[0];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 0;
    } else if(valueStr === "out") {
        store.drawLine.begin = position[1];
        store.drawLine.beginId = props.id;
        store.drawLine.beginNum = 0;
    } else {
        store.drawLine.is = false;
    }
}

function drawLineDone(event: any, valueStr: string) {
    if(event.evt.button !== 0) {return;}

    const position = store.oneInputGateValues(props.id);
    if(valueStr === "in" && store.drawLine.beginId !== -1) {
        store.drawLine.endId = props.id;
        store.drawLine.end = position[0];
        store.drawLine.endNum = 0;
        store.addLine();
    } else if(valueStr === "out" && store.drawLine.endId !== -1) {
        store.drawLine.beginId = props.id;
        store.drawLine.begin = position[1];
        store.drawLine.beginNum = 0;
        store.addLine();
    }

    store.drawLine.is = false;
    store.drawLine.begin = []
    store.drawLine.end = []
    store.drawLine.beginId = -1
    store.drawLine.endId = -1
}

function rigthClick(event: any) {
    event.evt.preventDefault();
    store.menu.visible = true;
    store.menu.x = event.evt.layerX;
    store.menu.y = event.evt.layerY;
    store.menu.id = props.id;
}

watch(() => store.global.selected, () => {
    if(props.isPreview) {return;}
    if(store.global.selected.includes(props.id)) {
        selected.value = true;
    } else {
        selected.value = false;
    }
}, {deep: true});

watch(() => props.in, () => {
    const element = store.getElementInArr(props.id);
    element.out[0] = out();
    const outLine = store.getLine(props.outDependence[0]);
    if(outLine !== undefined) {
        outLine.in = out();
    }
}, {deep: true});

watch([() => props.rotate, () => props.scaleX, () => props.scaleY, () => props.x, () => props.y], () => {
    if(props.isPreview) {return;}

    const position = store.oneInputGateValues(props.id);
    const inLine = store.getLine(props.inDependence[0]);
    const outLine = store.getLine(props.outDependence[0]);
    if(inLine !== undefined) {
        inLine.points = [inLine.points[0], inLine.points[1], ...position[0]];
    }
    if(outLine !== undefined) {
        outLine.points = [...position[1], outLine.points[2], outLine.points[3]];
    }
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>


