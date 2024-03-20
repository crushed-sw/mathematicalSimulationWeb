<template>
    <v-group :config="outerConfig">
        <v-group
            ref="circleGroup"
            :config="circleGroupConfig"
            @mouseenter="enter"
            @mouseout="out"
            @mousemove="move"
            @click="click"
        >
            <v-circle :config="maskCircleConfig"></v-circle>
            <v-circle :config="circleConfig"></v-circle>
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
        type: Array<number>,
        required: true,
        validator(value: Array<number>): boolean {
            return value.length === 6;
        }
    },
    ...(shapeBasicUtil as any),
});

const hitFunc = (context: any, shape :any) => {
    const innerRadius = Math.abs(shape.radius() - props.hitStrokeWidth / 2);
    const outerRadius = shape.radius() + props.hitStrokeWidth / 2;

    context.beginPath();
    context.arc(shape.x(), shape.y(), outerRadius, 0, 2 * Math.PI);
    context.arc(shape.x(), shape.y(), innerRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fillStrokeShape(shape);
}

const outerConfig = reactive({
    visible: props.visible,
    type: "outter",
});

const circleGroupConfig = reactive({
    index: props.index,
    x: 0,
    y: 0,
    draggable: props.draggable,
    rotation: props.rotation,
    choosable: props.choosable,
});

const circleConfig = reactive({
    radius: 0,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});

const maskCircleConfig = reactive({
    radius: 0,
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    visible: props.isMask,
    hitFunc: hitFunc,
});

function updateCircleGroupConfig(x: number, y: number) {
    circleGroupConfig.index = props.index;
    circleGroupConfig.x = x;
    circleGroupConfig.y = y;
    circleGroupConfig.draggable = props.draggable;
    circleGroupConfig.rotation = props.rotation;
    circleGroupConfig.choosable = props.choosable;
}

function updateCircleConfig(r: number) {
    circleConfig.radius = r;
    circleConfig.fill = props.fill;
    circleConfig.stroke = props.stroke;
    circleConfig.strokeWidth = props.strokeWidth;
    circleConfig.hitStrokeWidth = props.hitStrokeWidth;
}

function updateMaskCircleConfig(r: number) {
    maskCircleConfig.radius = r;
    maskCircleConfig.stroke = props.mask;
    maskCircleConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskCircleConfig.visible = props.isMask;
}

watch(() => props, () => {
    const x1 = props.points[0];
    const y1 = props.points[1];
    const x2 = props.points[2];
    const y2 = props.points[3];
    const x3 = props.points[4];
    const y3 = props.points[5];

    const pow1 = x1 * x1 + y1 * y1;
    const pow2 = x2 * x2 + y2 * y2;
    const pow3 = x3 * x3 + y3 * y3;

    const a = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
    const b = pow1 * (y3 - y2) + pow2 * (y1 - y3) + pow3 * (y2 - y1);
    const c = pow1 * (x2 - x3) + pow2 * (x3 - x1) + pow3 * (x1 - x2);
    const d = pow1 * (x3 * y2 - x2 * y3) + pow2 * (x1 * y3 - x3 * y1) + pow3 * (x2 * y1 - x1 * y2);

    let centerX = -b / (2 * a);
    let centerY = -c / (2 * a);
    let r = Math.sqrt((b * b + c * c - 4 * a * d) / (4 * a * a));

    if(!isFinite(centerX)) {
        centerX = 0;
    }
    if(!isFinite(centerY)) {
        centerY = 0;
    }
    if(!isFinite(r)) {
        r = 0;
    }

    outerConfig.visible = props.visible;
    updateCircleGroupConfig(centerX, centerY);
    updateCircleConfig(r);
    updateMaskCircleConfig(r);
}, {deep: true, immediate: true});

function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.CircleThreePoints;

        const theta = Math.atan2(circleGroupConfig.y - event.evt.layerY, circleGroupConfig.x - event.evt.layerX);
        const currentX = circleGroupConfig.x + circleConfig.radius * Math.cos(theta + Math.PI);
        const currentY = circleGroupConfig.y + circleConfig.radius * Math.sin(theta + Math.PI);

        store.global.hover.x = currentX;
        store.global.hover.y = currentY;
    }

    if(store.global.drawing) {
        store.global.clicked = [props.index];
    }
}

function move(event: any) {
    if(store.global.hover.id === props.index) {
        const theta = Math.atan2(circleGroupConfig.y - event.evt.layerY, circleGroupConfig.x - event.evt.layerX);
        const currentX = circleGroupConfig.x + circleConfig.radius * Math.cos(theta + Math.PI);
        const currentY = circleGroupConfig.y + circleConfig.radius * Math.sin(theta + Math.PI);

        store.global.hover.x = currentX;
        store.global.hover.y = currentY;
    }
}

function out() {
    if(props.index === store.global.hover.id) {
        store.global.hover.id = -1;
        store.global.hover.type = Types.None;
    }

    if(store.global.drawing && store.global.hover.id === props.index) {
        store.global.clicked = [];
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
