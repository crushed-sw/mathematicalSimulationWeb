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
            @mousedown="drawLine($event, 'in1')"
            @mouseup="drawLineDone($event, 'in1')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="in1Value"
            ></v-path>
            <Point
                :x="-50"
                :y="-20"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>
        <v-group
            @mousedown="drawLine($event, 'in2')"
            @mouseup="drawLineDone($event, 'in2')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="in2Value"
            ></v-path>
            <Point
                :x="-50"
                :y="20"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>
        <v-group
            @mousedown="drawLine($event, 'out')"
            @mouseup="drawLineDone($event, 'out')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="outValue"
            ></v-path>
            <Point
                :x="50"
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

const store = useDigitCircuitStore();
const isPointVisible = ref(false);
const selected = ref(false);

function out() {
    if(props.in[0] === -1 || props.in[1] == -1) {
        return -1;
    }
    return Number(!!props.in[0] && !!props.in[1]);
}

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

const dataValue = "M0,-30 L-35,-30 L-35,30 L0,30 A30,30,90,1,0,-1,-30";
const in1Value = "M-50,-20 L-35,-20";
const in2Value = "M-50,20 L-35,20";
const outValue = "M30,0 L50,0"
const backValue = "M0,-30 L-35,-30 L-35,30 L0,30 A30,30,90,1,0,-1,-30"

function enter(event: any) {
    if(props.isPreview) {return;}
    isPointVisible.value = true;
    store.annotation.value = `in1: ${props.in[0]}<br />in2: ${props.in[1]}<br />out: ${out()}`;
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

function rigthClick(event: any) {
    event.evt.preventDefault();
    store.menu.visible = true;
    store.menu.x = event.evt.layerX;
    store.menu.y = event.evt.layerY;
    store.menu.id = props.id;
}

function click(event: any) {
    const position = store.twoInputGateValues(props.id);
    console.log(position[0][0], position[0][1], "\n", position[1][0], position[1][1], "\n", position[2][0], position[2][1]);
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

    const position = store.twoInputGateValues(props.id);
    if(valueStr === "in1") {
        store.drawLine.end = position[0];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 0;
    } else if(valueStr === "in2") {
        store.drawLine.end = position[1];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 1;
    } else if(valueStr === "out") {
        store.drawLine.begin = position[2];
        store.drawLine.beginId = props.id;
        store.drawLine.beginNum = 0;
    } else {
        store.drawLine.is = false;
    }
}

function drawLineDone(event: any, valueStr: string) {
    if(event.evt.button !== 0) {return;}

    const position = store.twoInputGateValues(props.id);
    if(valueStr === "in1" && store.drawLine.beginId !== -1) {
        store.drawLine.end = position[0];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 0;
        store.addLine();
    } else if(valueStr === "in2" && store.drawLine.beginId !== -1) {
        store.drawLine.end = position[1];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 1;
        store.addLine();
    } else if(valueStr === "out" && store.drawLine.endId !== -1) {
        store.drawLine.begin = position[2];
        store.drawLine.beginId = props.id;
        store.drawLine.beginNum = 0;
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

    const position = store.twoInputGateValues(props.id);
    const in1Line = store.getLine(props.inDependence[0]);
    const in2Line = store.getLine(props.inDependence[1]);
    const outLine = store.getLine(props.outDependence[0]);
    if(in1Line !== undefined) {
        in1Line.points = [in1Line.points[0], in1Line.points[1], ...position[0]];
    }
    if(in2Line !== undefined) {
        in2Line.points = [in2Line.points[0], in2Line.points[1], ...position[1]];
    }
    if(outLine !== undefined) {
        outLine.points = [...position[2], outLine.points[2], outLine.points[3]];
    }
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>

