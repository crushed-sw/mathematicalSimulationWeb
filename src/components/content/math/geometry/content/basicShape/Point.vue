<template>
    <v-group
        ref="pointerGroup"
        :config="pointerGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @click="click"
    >
        <v-circle :config="maskPointerConfig"></v-circle>
        <v-circle :config="pointerConfig"></v-circle>
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
        default: 4,
    },
    isHelp: {
        type: Boolean,
        default: false,
    },
    ...(shapeBasicUtil as any),
});

const pointerGroupConfig = reactive({
    index: props.index,
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
    isChecked: props.isChecked,
    visible: props.visible,
    choosable: props.choosable,
});

const maskPointerConfig = reactive({
    radius: props.radius + props.maskWidth,
    stroke: props.mask,
    strokeWidth: props.maskWidth,
    visible: false,
});

const pointerConfig = reactive({
    radius: props.radius,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    hitStrokeWidth: props.hitStrokeWidth,
});

function updatePointerGroupConfig() {
    pointerGroupConfig.index = props.index;
    pointerGroupConfig.x = props.x;
    pointerGroupConfig.y = props.y;
    pointerGroupConfig.draggable = props.draggable;
    pointerGroupConfig.rotation = props.rotation;
    pointerGroupConfig.isChecked = props.isChecked;
    pointerGroupConfig.visible = props.visible;
    pointerGroupConfig.choosable = props.choosable;
}

function updateMaskPointerConfig() {
    maskPointerConfig.radius = props.radius + props.maskWidth;
    maskPointerConfig.stroke = props.mask;
    maskPointerConfig.strokeWidth = props.maskWidth;
    maskPointerConfig.visible = props.isMask;
}

function updatePointerConfig() {
    pointerConfig.radius = props.radius;
    pointerConfig.stroke = props.stroke;
    pointerConfig.strokeWidth = props.strokeWidth;
    pointerConfig.fill = props.fill;
    pointerConfig.hitStrokeWidth = props.hitStrokeWidth;
}

watch(() => props, () => {
    updatePointerGroupConfig();
    updateMaskPointerConfig();
    updatePointerConfig();
}, {deep: true});

function enter() {
    if(props.index > 0) {
        if(props.isHelp) {
            store.global.hover.id = props.index;
            store.global.hover.type = Types.HelpPoint;
        } else {
            store.global.hover.id = props.index;
            store.global.hover.type = Types.Point;
        }
        store.global.hover.x = props.x;
        store.global.hover.y = props.y;
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

