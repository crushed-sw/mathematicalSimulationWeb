<template>
    <v-group
        ref="pointerGroup"
        :config="curveGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @mousemove="move"
        @click="click"
    >
        <v-path :config="maskCurveConfig"></v-path>
        <v-path :config="curveConfig"></v-path>
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
            return value.length === 8;
        }
    },
    ...(shapeBasicUtil as any),
});

const curveGroupConfig = reactive({
    index: props.index,
    x: 0,
    y: 0,
    draggable: props.draggable,
    rotation: props.rotation,
    isChecked: props.isChecked,
    visible: props.visible,
    choosable: props.choosable,
});

function getCurveData() {
    return `M ${props.points[0]} ${props.points[1]}, C ${props.points[2]} ${props.points[3]},
              ${props.points[4]} ${props.points[5]}, ${props.points[6]} ${props.points[7]},
            M ${props.points[6]} ${props.points[7]}, C ${props.points[4]} ${props.points[5]},
              ${props.points[2]} ${props.points[3]}, ${props.points[0]} ${props.points[1]}`;
}

const maskCurveConfig = reactive({
    data: getCurveData(),
    stroke: props.mask,
    strokeWidth: props.maskWidth * 2 + props.strokeWidth,
    visible: false,
});

const curveConfig = reactive({
    data: getCurveData(),
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    hitStrokeWidth: props.hitStrokeWidth,
});

function updateCurveGroupConfig() {
    curveGroupConfig.index = props.index;
    curveGroupConfig.draggable = props.draggable;
    curveGroupConfig.rotation = props.rotation;
    curveGroupConfig.isChecked = props.isChecked;
    curveGroupConfig.visible = props.visible;
    curveGroupConfig.choosable = props.choosable;
}

function updateMaskCurveConfig() {
    maskCurveConfig.data = getCurveData(),
    maskCurveConfig.stroke = props.mask;
    maskCurveConfig.strokeWidth = props.maskWidth * 2 + props.strokeWidth;
    maskCurveConfig.visible = props.isMask;
}

function updateCurveConfig() {
    curveConfig.data = getCurveData(),
    curveConfig.stroke = props.stroke;
    curveConfig.strokeWidth = props.strokeWidth;
    curveConfig.fill = props.fill;
    curveConfig.hitStrokeWidth = props.hitStrokeWidth;
}

watch(() => props, () => {
    updateCurveGroupConfig();
    updateMaskCurveConfig();
    updateCurveConfig();
}, {deep: true});

function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.CubicBezier;
        store.global.hover.x = event.evt.layerX;
        store.global.hover.y = event.evt.layerY;
    }

    if(store.global.drawing) {
        store.global.clicked = [props.index];
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

function move(event: any) {
    if(store.global.hover.id === props.index) {
        store.global.hover.x = event.evt.layerX;
        store.global.hover.y = event.evt.layerY;
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

<style lang="scss" scoped>
</style>

