<template>
    <v-group
        ref="squareGroup"
        :config="squareGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @click="click"
    >
        <v-rect :config="maskSquareConfig"></v-rect>
        <v-rect :config="squareConfig"></v-rect>
        <slot></slot>
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
            return value.length >= 6;
        }
    },
    ...(shapeBasicUtil as any),
});

const hitFunc = (context: any, shape :any) => {
    const outerRect = {
        x: shape.x() - props.hitStrokeWidth / 2,
        y: shape.y() - props.hitStrokeWidth / 2,
        width: shape.width() + props.hitStrokeWidth,
        height: shape.height() + props.hitStrokeWidth,
    };

    const innerRect = {
        x: shape.x() + props.hitStrokeWidth / 2,
        y: shape.y() + props.hitStrokeWidth / 2,
        width: shape.width() - props.hitStrokeWidth,
        height: shape.height() - props.hitStrokeWidth,
    };

    context.beginPath();

    context.moveTo(outerRect.x, outerRect.y);
    context.lineTo(outerRect.x + outerRect.width, outerRect.y);
    context.lineTo(outerRect.x + outerRect.width, outerRect.y + outerRect.height);
    context.lineTo(outerRect.x, outerRect.y + outerRect.height);
    context.lineTo(outerRect.x, outerRect.y);

    context.lineTo(innerRect.x, innerRect.y);
    context.lineTo(innerRect.x, innerRect.y + innerRect.height);
    context.lineTo(innerRect.x + innerRect.width, innerRect.y + innerRect.height);
    context.lineTo(innerRect.x + innerRect.width, innerRect.y);
    context.lineTo(innerRect.x, innerRect.y);

    context.closePath();
    context.fillStrokeShape(shape);
}

const squareGroupConfig = reactive({
    index: props.index,
    x: props.points[0],
    y: props.points[1],
    draggable: props.draggable,
    rotation: Math.atan2(props.points[1] - props.points[3], props.points[0] - props.points[2]) * 180 / Math.PI - 180,
    visible: props.visible,
    choosable: props.choosable,
});

const maskSquareConfig = reactive({
    x: 0,
    y: 0,
    width: Math.sqrt(Math.pow(props.points[0] - props.points[2], 2) + Math.pow(props.points[1] - props.points[3], 2)),
    height: Math.sqrt(Math.pow(props.points[2] - props.points[4], 2) + Math.pow(props.points[3] - props.points[5], 2)),
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    visible: false,
    hitFunc: hitFunc,
});

const squareConfig = reactive({
    x: 0,
    y: 0,
    width: Math.sqrt(Math.pow(props.points[0] - props.points[2], 2) + Math.pow(props.points[1] - props.points[3], 2)),
    height: Math.sqrt(Math.pow(props.points[2] - props.points[4], 2) + Math.pow(props.points[3] - props.points[5], 2)),
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});

function updateSquareGroupConfig() {
    squareGroupConfig.index = props.index;
    squareGroupConfig.x = props.points[0];
    squareGroupConfig.y = props.points[1];
    squareGroupConfig.draggable = props.draggable;
    squareGroupConfig.rotation = Math.atan2(props.points[1] - props.points[3], props.points[0] - props.points[2]) * 180 / Math.PI - 180;
    squareGroupConfig.visible = props.visible;
    squareGroupConfig.choosable = props.choosable;
}

function updateMaskSquareConfig(width: number, height: number) {
    maskSquareConfig.width = width;
    maskSquareConfig.height = height;
    maskSquareConfig.stroke = props.mask;
    maskSquareConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskSquareConfig.visible = props.isMask;
}

function updateSquareConfig(width: number, height: number) {
    squareConfig.width = width;
    squareConfig.height = height;
    squareConfig.stroke = props.stroke;
    squareConfig.strokeWidth = props.strokeWidth;
    squareConfig.hitStrokeWidth = props.hitStrokeWidth;
    squareConfig.fill = props.fill;
}

watch(() => props, () => {
    const width = Math.sqrt(Math.pow(props.points[0] - props.points[2], 2) + Math.pow(props.points[1] - props.points[3], 2));
    const height = Math.sqrt(Math.pow(props.points[2] - props.points[4], 2) + Math.pow(props.points[3] - props.points[5], 2));

    updateSquareGroupConfig();
    updateMaskSquareConfig(width, height);
    updateSquareConfig(width, height);
}, {deep: true, immediate: true});

function enter() {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.Square;
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

