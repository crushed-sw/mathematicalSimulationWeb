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
            :fill="'rgba(0, 0, 0, 0)'"
        ></v-path>
        <v-path
            :="textColor"
            :data="isClose ? out2Value : out1Value"
        ></v-path>

        <v-group
            @mousedown="drawLine($event, 'in')"
            @mouseup="drawLineDone($event, 'in')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="inLine"
            ></v-path>
            <Point
                :x="-40"
                :y="0"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>
        <v-group
            @mousedown="drawLine($event, 'out1')"
            @mouseup="drawLineDone($event, 'out1')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="out1Line"
            ></v-path>
            <Point
                :x="40"
                :y="-20"
                :ishover="true"
                :visible="isPointVisible && !store.global.drag"
            ></Point>
        </v-group>
        <v-group
            @mousedown="drawLine($event, 'out2')"
            @mouseup="drawLineDone($event, 'out2')"
        >
            <v-path
                :stroke="valueConfig.stroke"
                :strokeWidth="valueConfig.strokeWidth"
                :hitStrokeWidth="valueConfig.hitStrokeWidth"
                :data="out2Line"
            ></v-path>
            <Point
                :x="40"
                :y="-0"
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
const isClose = ref(false);
const selected = ref(false);

function out1() {
    if(props.in[0] == -1 || isClose.value) {
        return -1;
    }
    return props.in[0];
}

function out2() {
    if(props.in[0] == -1 || !isClose.value) {
        return -1;
    }
    return props.in[0];
}

const valueConfig = computed(() => {
    if(props.isPreview) {
        return {
            stroke: 'rgba(173, 181, 189, 1)',
            strokeWidth: 4,
            hitStrokeWidth: 7
        }
    } else {
        return {
            stroke: selected.value ? 'rgba(255, 37, 0, 1)' :'rgba(67, 76, 94, 1)',
            strokeWidth: selected.value ? 3 : 2,
            hitStrokeWidth: 7
        }
    }
});

const textColor = computed(() => {
    if(props.isPreview) {
        return {
            stroke: 'rgba(173, 181, 189, 1)',
            strokeWidth: 4,
            data: isClose.value ? out2Value : out1Value
        }
    }
    return {
        stroke: selected.value ? 'rgba(255, 37, 0, 1)' :'rgba(67, 76, 94, 1)',
        strokeWidth: selected.value ? 3 : 2,
        data: isClose.value ? out2Value : out1Value
    }
});

const inLine = "M-40,0 L-30,0 A5,5,0,1,0,-20,0 A5,5,0,1,0,-30,0";
const out1Line = "M40,-20 L30,-20 A5,5,0,1,0,20,-20 A5,5,0,1,0,30,-20";
const out2Line = "M40,0 L30,0 A5,5,0,1,0,20,0 A5,5,0,1,0,30,0";
const out1Value = "M-20,-1 L25,-15"
const out2Value = "M-20,-1 L25,-5"
const backValue = "M-20,-20 L-20,20 L20,20 L20,-20 L-20,-20"

const isPointVisible = ref(false);

function enter(event: any) {
    if(props.isPreview) {return;}
    isPointVisible.value = true;
    store.annotation.value = `in: &nbsp&nbsp${props.in[0]}<br />out1: ${out1()}<br />out2: ${out2()}`;
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
    isClose.value = !isClose.value;
    store.annotation.value = `in: &nbsp&nbsp${props.in[0]}<br />out1: ${out1()}<br />out2: ${out2()}`;

    const element = store.getElementInArr(props.id);
    if(element !== undefined) {
        element.out[0] = out1();
        element.out[1] = out2();
    }

    const line1 = store.getLine(props.outDependence[0]);
    if(line1 !== undefined) {
        line1.in = out1();
    }
    const line2 = store.getLine(props.outDependence[1]);
    if(line2 !== undefined) {
        line2.in = out2();
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

    const position = store.towSwitchValues(props.id);
    if(valueStr === "in") {
        store.drawLine.end = position[0];
        store.drawLine.endId = props.id;
        store.drawLine.endNum = 0;
    } else if(valueStr === "out1") {
        store.drawLine.begin = position[1];
        store.drawLine.beginId = props.id;
        store.drawLine.beginNum = 0;
    } else if(valueStr === "out2") {
        store.drawLine.begin = position[2];
        store.drawLine.beginId = props.id;
        store.drawLine.beginNum = 1;
    } else {
        store.drawLine.is = false;
    }
}

function drawLineDone(event: any, valueStr: string) {
    if(event.evt.button !== 0) {return;}

    const position = store.towSwitchValues(props.id);
    if(valueStr === "in" && store.drawLine.beginId !== -1) {
        store.drawLine.endId = props.id;
        store.drawLine.end = position[0];
        store.drawLine.endNum = 0;
        store.addLine();
    } else if(valueStr === "out1" && store.drawLine.endId !== -1) {
        store.drawLine.beginId = props.id;
        store.drawLine.begin = position[1];
        store.drawLine.beginNum = 0;
        store.addLine();
    } else if(valueStr === "out1" && store.drawLine.endId !== -1) {
        store.drawLine.beginId = props.id;
        store.drawLine.begin = position[2];
        store.drawLine.beginNum = 1;
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
    element.out[0] = out1();
    element.out[1] = out2();

    const out1Line = store.getLine(props.outDependence[0]);
    if(out1Line !== undefined) {
        out1Line.in = out1();
    }
    const out2Line = store.getLine(props.outDependence[1]);
    if(out2Line !== undefined) {
        out2Line.in = out2();
    }
}, {deep: true});

watch([() => props.rotate, () => props.scaleX, () => props.scaleY, () => props.x, () => props.y], () => {
    if(props.isPreview) {return;}

    const position = store.towSwitchValues(props.id);
    const inLine = store.getLine(props.inDependence[0]);
    const out1Line = store.getLine(props.outDependence[0]);
    const out2Line = store.getLine(props.outDependence[1]);
    if(inLine !== undefined) {
        inLine.points = [inLine.points[0], inLine.points[1], ...position[0]];
    }
    if(out1Line !== undefined) {
        out1Line.points = [...position[1], out1Line.points[2], out1Line.points[3]];
    }
    if(out2Line !== undefined) {
        out2Line.points = [...position[2], out2Line.points[2], out2Line.points[3]];
    }
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>


