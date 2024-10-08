<template>
    <v-group
        ref="lineGroup"
        :config="lineGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @mousemove="move"
        @click="click"
    >
        <v-line :config="maskLineConfig"></v-line>
        <v-line :config="lineConfig"></v-line>

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
        type: Array<Array<number>>,
        required: true,
        validator(value: Array<Array<number>>): boolean {
            return value.length > 0;
        }
    },
    ...(shapeBasicUtil as any),
});

const lineGroupConfig = reactive({
    index: props.index,
    x: 0,
    y: 0,
    draggable: props.draggable,
    rotation: props.rotation,
    visible: props.visible,
    choosable: props.choosable,
});

const maskLineConfig = reactive({
    points: props.points.flat(),
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    dash: props.dash,
    visible: false,
});

const lineConfig = reactive({
    fill: "rgba(0, 0, 0, 1)",
    points: props.points.flat(),
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    dash: props.dash,
});

function updateLineGroupConfig() {
    lineGroupConfig.index = props.index;
    lineGroupConfig.draggable = props.draggable;
    lineGroupConfig.rotation = props.rotation;
    lineGroupConfig.visible = props.visible;
    lineGroupConfig.choosable = props.choosable;
}

function updateMaskLineConfig() {
    maskLineConfig.points = props.points.flat();
    maskLineConfig.stroke = props.mask;
    maskLineConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskLineConfig.dash = props.dash;
    maskLineConfig.visible = props.isMask;
}

function updateLineConfig() {
    lineConfig.points = props.points.flat();
    lineConfig.stroke = props.stroke;
    lineConfig.strokeWidth = props.strokeWidth;
    lineConfig.hitStrokeWidth = props.hitStrokeWidth;
    lineConfig.dash = props.dash;
}

watch(() => props, () => {
    updateLineGroupConfig();
    updateMaskLineConfig();
    updateLineConfig();
}, {deep: true});

function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.Line;
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
}

function move(event: any) {

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

