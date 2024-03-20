<template>
    <v-group :config="outerConfig">
        <v-group
            ref="parabolaGroup"
            :config="parabolaGroupConfig"
            @mouseenter="enter"
            @mouseout="out"
            @click="click"
        >
            <v-shape :config="maskParabolaConfig"></v-shape>
            <v-shape :config="parabolaConfig"></v-shape>
            <slot></slot>
        </v-group>
        <slot name="outter"></slot>
    </v-group>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue"
import { shapeBasicUtil } from "@/hooks/shapeHook.ts"
import { useGeometryStore, Types } from "@/stores/geometryStore"

const store = useGeometryStore();

const props = defineProps({
    points: {
        type: Array<Number>,
        default: [0, 0, 0, 0, 0, 0],
        validator(value: Array<number>): boolean {
            return value.length === 6;
        }
    },
    scope: {
        type: Array<Number>,
        default: [-200, 200],
        validator(value: Array<number>): boolean {
            return value.length === 2;
        }
    },
    ...(shapeBasicUtil as any),
});

function getParams() {
    const x1 = props.points[0];
    const y1 = props.points[1];
    const x2 = props.points[2];
    const y2 = props.points[3];
    const x3 = props.points[4];
    const y3 = props.points[5];

    let denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
    let a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
    let b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / denom;
    let c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;

    const x = -b / (2 * a);
    const y = (4 * a * c - b * b) / (4 * a);

    return [a, b, c, x, y];
}

function parabolaFunction(a: number, b: number, c: number, x: number) {
    return a * x * x + b * x + c;
}

function drawParabola(context: any) {
    const params = getParams();
    const begin = props.scope[0] + params[3];
    const end = props.scope[1] + params[3];
    for(let i = begin; i < end; i += 2) {
        const x = i - params[3];
        const y = parabolaFunction(params[0], params[1], params[2], i) - params[4];
        if(i === begin) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    }
    for(let i = end; i > begin; i -= 2) {
        const x = i - params[3];
        const y = parabolaFunction(params[0], params[1], params[2], i) - params[4];
        context.lineTo(x, y);
    }
}

const hitFunc = (context: any, shape :any) => {
    context.beginPath();
    drawParabola(context);
    context.lineWidth = props.hitStrokeWidth;
    context.stroke();
    context.fillStrokeShape(shape);
}

const outerConfig = reactive({
    visible: props.visible,
    type: "outter",
});

const parabolaGroupConfig = reactive({
    index: props.index,
    x: 0,
    y: 0,
    draggable: props.draggable,
    rotation: props.rotation,
    isChecked: props.isChecked,
    visible: props.visible,
    choosable: props.choosable,
});

const parabolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();
        drawParabola(context);
        context.fillStrokeShape(shape);
    },
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
});

const maskParabolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();
        drawParabola(context);
        context.fillStrokeShape(shape);
    },
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.maskWidth * 2 + props.strokeWidth,
    visible: false,
});

function updateParabolaGroupConfig(x: number, y: number) {
    parabolaGroupConfig.x = x;
    parabolaGroupConfig.y = y;
    parabolaGroupConfig.index = props.index;
    parabolaGroupConfig.draggable = props.draggable;
    parabolaGroupConfig.rotation = props.rotation;
    parabolaGroupConfig.isChecked = props.isChecked;
    parabolaGroupConfig.visible = props.visible;
    parabolaGroupConfig.choosable = props.choosable;
}

function updateParabolaConfig() {
    parabolaConfig.fill = props.fill;
    parabolaConfig.stroke = props.stroke;
    parabolaConfig.strokeWidth = props.strokeWidth;
    parabolaConfig.hitStrokeWidth = props.hitStrokeWidth;
}

function updateMaskParabolaConfig() {
    maskParabolaConfig.stroke = props.mask;
    maskParabolaConfig.strokeWidth = props.maskWidth * 2 + props.strokeWidth;
    maskParabolaConfig.visible = props.isMask;
}

watch(() => props, () => {
    const params = getParams();
    let x = params[3];
    let y = params[4];
    if(!isFinite(x)) {
        x = 0;
    }
    if(!isFinite(y)) {
        y = 0;
    }
    outerConfig.visible = props.visible;
    updateParabolaGroupConfig(x, y);
    updateParabolaConfig();
    updateMaskParabolaConfig();
}, {deep: true, immediate: true});

function enter() {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.Parabola;
    }
}

function out() {
    if(props.index === store.global.hover.id) {
        store.global.hover.id = -1;
        store.global.hover.type = Types.None;
    }
}

function click() {
    if(props.index > 0) {
        if(store.global.ctrl) {
            store.global.clicked.push(props.index);
        } else {
            store.global.clicked = [props.index];
        }
    }
}
</script>

