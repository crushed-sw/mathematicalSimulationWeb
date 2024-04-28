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
            :fill="'rgba(255, 255, 255, 1)'"
        ></v-path>
        <v-path
            :="valueConfig"
        ></v-path>
        <v-text
            :x="-18"
            :y="-13"
            :text="`${sourceValue}`"
            :fontSize="26"
            :fontFamily="'Calibri'"
            :fill="textColor"
        ></v-text>

        <v-group
            @mousedown="drawLine($event, 'out')"
            @mouseup="drawLineDone($event, 'out')"
        >
            <v-path
                :data="outValue"
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
            ></v-path>
            <Point
                :x="30"
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
});

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

const textColor = computed(() => {
    if(props.isPreview) {
        return 'rgba(173, 181, 189, 1)'
    }
    return selected.value ? 'rgba(255, 37, 0, 1)' :'rgba(67, 76, 94, 1)';
});

const store = useDigitCircuitStore();
const sourceValue = ref(0);
const isPointVisible = ref(false);
const selected = ref(false);

const dataValue = "M-25,0 A15,15,0,1,0,5,0 A15,15,0,1,0,-25,0 M30,0 L5,0";
const outValue = "M30,0 L5,0";
const backValue = "M-25,0 A15,15,0,1,0,5,0 A15,15,0,1,0,-25,0"

function enter(event: any) {
    if(props.isPreview) {return;}
    isPointVisible.value = true;
    store.annotation.value = `out: ${sourceValue.value}`;
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
    if(props.isPreview) {return;}
    sourceValue.value = Number(!sourceValue.value);
    store.annotation.value = `out: ${sourceValue.value}`;

    const element = store.getElementInArr(props.id);
    if(element !== undefined) {
        element.out[0] = sourceValue.value;
    }

    const line = store.getLine(props.outDependence[0]);
    if(line !== undefined) {
        line.in = sourceValue.value;
    }
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

    const position = store.sourceGateValues(props.id);

    if(valueStr === "out") {
        store.drawLine.begin = position[0];
        store.drawLine.beginId = props.id;
        store.drawLine.beginNum = 0;
    } else {
        store.drawLine.is = false;
    }
}

function drawLineDone(event: any, valueStr: string) {
    if(event.evt.button !== 0) {return;}

    const position = store.sourceGateValues(props.id);
    if(valueStr === "out" && store.drawLine.endId !== -1) {
        store.drawLine.begin = position[0];
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

watch([() => props.rotate, () => props.scaleX, () => props.scaleY, () => props.x, () => props.y], () => {
    if(props.isPreview) {return;}

    const position = store.sourceGateValues(props.id);
    const outLine = store.getLine(props.outDependence[0]);
    if(outLine !== undefined) {
        outLine.points = [...position[0], outLine.points[2], outLine.points[3]];
    }
}, {deep: true});

</script>

<style lang="scss" scoped>
</style>

