<template>
    <v-group
        ref="lineSegmentGroup"
        :config="lineSegmentGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @mousemove="move"
        @click="click"
    >
        <v-line :config="maskLineSegmentConfig"></v-line>
        <v-line :config="lineSegmentConfig"></v-line>
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
            return value.length === 4;
        }
    },
    ...(shapeBasicUtil as any),
});

const lineSegmentGroupConfig = reactive({
    index: props.index,
    x: 0,
    y: 0,
    draggable: props.draggable,
    rotation: props.rotation,
    visible: props.visible,
    choosable: props.choosable,
});

const maskLineSegmentConfig = reactive({
    points: props.points,
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    dash: props.dash,
    visible: false,
});

const lineSegmentConfig = reactive({
    points: props.points,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    dash: props.dash,
});

function updateLineSegmentGroupConfig() {
    lineSegmentGroupConfig.index = props.index;
    lineSegmentGroupConfig.draggable = props.draggable;
    lineSegmentGroupConfig.rotation = props.rotation;
    lineSegmentGroupConfig.visible = props.visible;
    lineSegmentGroupConfig.choosable = props.choosable;
}

function updateMaskLineSegmentConfig() {
    maskLineSegmentConfig.points = props.points;
    maskLineSegmentConfig.stroke = props.mask;
    maskLineSegmentConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskLineSegmentConfig.dash = props.dash;
    maskLineSegmentConfig.visible = props.isMask;
}

function updateLineSegmentConfig() {
    lineSegmentConfig.points = props.points;
    lineSegmentConfig.stroke = props.stroke;
    lineSegmentConfig.strokeWidth = props.strokeWidth;
    lineSegmentConfig.hitStrokeWidth = props.hitStrokeWidth;
    lineSegmentConfig.dash = props.dash;
}

watch(() => props, () => {
    updateLineSegmentGroupConfig();
    updateMaskLineSegmentConfig();
    updateLineSegmentConfig();
}, {deep: true});


function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.LineSegment;

        const x1 = props.points[0];
        const y1 = props.points[1];
        const x2 = props.points[2];
        const y2 = props.points[3];

        const layerX = event.evt.layerX;
        const layerY = event.evt.layerY;

        const theta = Math.atan2(y1 - y2, x1 - x2);
        const unitTheta = Math.PI / 4;
        if((theta >= -unitTheta && theta <= unitTheta) || (theta < -3 * unitTheta) || (theta > 3 * unitTheta)) {
            const y = ((y2 - y1) / (x2 - x1)) * (layerX - x1) + y1;
            store.global.hover.x = layerX;
            store.global.hover.y = y;
        } else {
            const x = ((x2 - x1) / (y2 - y1)) * (layerY - y1) + x1;
            store.global.hover.x = x;
            store.global.hover.y = layerY;
        }
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
        const x1 = props.points[0];
        const y1 = props.points[1];
        const x2 = props.points[2];
        const y2 = props.points[3];

        const layerX = event.evt.layerX;
        const layerY = event.evt.layerY;

        const theta = Math.atan2(y1 - y2, x1 - x2);
        const unitTheta = Math.PI / 4;
        if((theta >= -unitTheta && theta <= unitTheta) || (theta < -3 * unitTheta) || (theta > 3 * unitTheta)) {
            const y = ((y2 - y1) / (x2 - x1)) * (layerX - x1) + y1;
            store.global.hover.x = layerX;
            store.global.hover.y = y;
        } else {
            const x = ((x2 - x1) / (y2 - y1)) * (layerY - y1) + x1;
            store.global.hover.x = x;
            store.global.hover.y = layerY;
        }
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

