<template>
    <v-group
        :index="props.index"
        :visible='hyperbolaConfig.visible'
        @mouseenter="enter"
        @mouseout="out"
        @click="click"
    >
        <Hyperbola :={...hyperbolaConfig} >
            <slot name="inner"></slot>
        </Hyperbola>
        <slot></slot>
    </v-group>
</template>

<script lang="ts" setup>
import Hyperbola from "./Hyperbola.vue"

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
    focusX: {
        type: Number,
        required: true,
    },
    focusY: {
        type: Number,
        required: true,
    },
    inX: {
        type: Number,
        required: true,
    },
    inY: {
        type: Number,
        required: true,
    },
    ...(shapeBasicUtil as any),
});

const hyperbolaConfig = reactive({
    x: props.x,
    y: props.y,
    rowX: 0,
    rowY: 0,
    colX: 0,
    colY: 0,
    visible: props.visible,
    choosable: props.choosable,
    isMask: props.isMask,
    ...props
});

watch(() => props, () => {
    const theta = Math.atan2(props.y - props.focusY, props.x - props.focusX);
    const standardFocusX = Math.sqrt(Math.pow(props.x - props.focusX, 2) + Math.pow(props.y - props.focusY, 2));
    const standardInX = (props.inX - props.x) * Math.cos(-theta) - (props.inY - props.y) * Math.sin(-theta);
    const standardInY = (props.inX - props.x) * Math.sin(-theta) + (props.inY - props.y) * Math.cos(-theta);

    const standardA = Math.abs((Math.sqrt(Math.pow(standardInX - standardFocusX, 2) + Math.pow(standardInY, 2)) -
                                Math.sqrt(Math.pow(standardInX + standardFocusX, 2) + Math.pow(standardInY, 2)))) / 2;
    const standardC = standardFocusX;
    const standardB = Math.sqrt(standardC * standardC - standardA * standardA);

    hyperbolaConfig.x = props.x;
    hyperbolaConfig.y = props.y;
    hyperbolaConfig.rowX = standardA * Math.cos(theta) + props.x;
    hyperbolaConfig.rowY = standardA * Math.sin(theta) + props.y;
    hyperbolaConfig.colX = props.x - standardB * Math.sin(theta);
    hyperbolaConfig.colY = props.y + standardB * Math.cos(theta);
    hyperbolaConfig.visible = props.visible;
    hyperbolaConfig.choosable = props.choosable;
    hyperbolaConfig.isMask = props.isMask;
}, {deep: true, immediate: true});


function enter() {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.HyperbolaFocus;
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

<style lang="scss" scoped>
</style>
