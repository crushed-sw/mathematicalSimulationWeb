<template>
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
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue"
import { shapeBasicUtil } from "@/hooks/shapeHook.ts"
import { useGeometryStore, Types } from "@/stores/geometryStore"

const store = useGeometryStore();

const props = defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    radius: {
        type: Number,
        required: true,
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

const circleGroupConfig = reactive({
    index: props.index,
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
    visible: props.visible,
    choosable: props.choosable,
});

const circleConfig = reactive({
    radius: props.radius,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});

const maskCircleConfig = reactive({
    radius: props.radius,
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    visible: props.isMask,
    hitFunc: hitFunc,
});

function updateCircleGroupConfig() {
    circleGroupConfig.index = props.index;
    circleGroupConfig.x = props.x;
    circleGroupConfig.y = props.y;
    circleGroupConfig.draggable = props.draggable;
    circleGroupConfig.rotation = props.rotation;
    circleGroupConfig.visible = props.visible;
    circleGroupConfig.choosable = props.choosable;
}

function updateCircleConfig() {
    circleConfig.radius = props.radius;
    circleConfig.fill = props.fill;
    circleConfig.stroke = props.stroke;
    circleConfig.strokeWidth = props.strokeWidth;
    circleConfig.hitStrokeWidth = props.hitStrokeWidth;
}

function updateMaskCircleConfig() {
    maskCircleConfig.radius = props.radius;
    maskCircleConfig.stroke = props.mask;
    maskCircleConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskCircleConfig.visible = props.isMask;
}

watch(() => props, () => {
    updateCircleGroupConfig();
    updateCircleConfig();
    updateMaskCircleConfig();
}, {deep: true});

function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.Circle;

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
