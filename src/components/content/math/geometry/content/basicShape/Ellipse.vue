<template>
    <v-group
        ref="ellipseGroup"
        :config="ellipseGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @mousemove="move"
        @click="click"
    >
        <v-ellipse :config="maskEllipseConfig"></v-ellipse>
        <v-ellipse :config="ellipseConfig"></v-ellipse>

        <!-- <v-line :config="leftLineConfig"></v-line> -->
        <!-- <v-line :config="rightLineConfig"></v-line> -->

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
    rowX: {
        type: Number,
        required: true,
    },
    rowY: {
        type: Number,
        required: true,
    },
    colX: {
        type: Number,
        required: true,
    },
    colY: {
        type: Number,
        required: true,
    },
    ...(shapeBasicUtil as any),
});

const hitFunc = (context: any, shape :any) => {
    const innerRadiusX = Math.abs(shape.radiusX() - props.hitStrokeWidth / 2);
    const innerRadiusY = Math.abs(shape.radiusY() - props.hitStrokeWidth / 2);
    const outerRadiusX = shape.radiusX() + props.hitStrokeWidth / 2;
    const outerRadiusY = shape.radiusY() + props.hitStrokeWidth / 2;

    context.beginPath();
    context.ellipse(shape.x(), shape.y(), outerRadiusX, outerRadiusY, 0, 0, 2 * Math.PI, false);
    context.ellipse(shape.x(), shape.y(), innerRadiusX, innerRadiusY, 0, 0, 2 * Math.PI, true);
    context.closePath();
    context.fillStrokeShape(shape);
}

const xRadiusValue = Math.sqrt(Math.pow(props.x - props.rowX, 2) + Math.pow(props.y - props.rowY, 2));
const yRadiusValue = Math.sqrt(Math.pow(props.x - props.colX, 2) + Math.pow(props.y - props.colY, 2));

const ellipseA = Math.max(xRadiusValue, yRadiusValue);
const ellipseB = Math.min(xRadiusValue, yRadiusValue);

const directrix = Math.pow(ellipseA, 2) / Math.sqrt(Math.pow(ellipseA, 2) - Math.pow(ellipseB, 2));

// const leftLineConfig = reactive({
//     points: xRadiusValue > yRadiusValue ?
//             [-directrix, yRadiusValue, -directrix, -yRadiusValue] :
//             [xRadiusValue, -directrix, -xRadiusValue, -directrix],
//     strokeWidth: 2,
//     stroke: "green",
//     visible: false,
// });

// const rightLineConfig = reactive({
//     points: xRadiusValue > yRadiusValue ?
//             [directrix, yRadiusValue, directrix, -yRadiusValue] :
//             [xRadiusValue, directrix, -xRadiusValue, directrix],
//     strokeWidth: 2,
//     stroke: "green",
//     visible: false,
// });

const ellipseGroupConfig = reactive({
    index: props.index,
    x: props.x,
    y: props.y,
    draggable: true,
    rotation: (Math.atan2(props.rowY - props.y, props.rowX - props.x) * 180) / Math.PI,
    visible: props.visible,
    choosable: props.choosable,
});

const ellipseConfig = reactive({
    radiusX: xRadiusValue,
    radiusY: yRadiusValue,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});

const maskEllipseConfig = reactive({
    radiusX: xRadiusValue,
    radiusY: yRadiusValue,
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    visible: false,
    hitFunc: hitFunc,
});

function updateEllipseGroupConfig() {
    ellipseGroupConfig.index = props.index;
    ellipseGroupConfig.x = props.x;
    ellipseGroupConfig.y = props.y;
    ellipseGroupConfig.draggable = props.draggable;
    ellipseGroupConfig.rotation = (Math.atan2(props.rowY - props.y, props.rowX - props.x) * 180) / Math.PI;
    ellipseGroupConfig.visible = props.visible;
    ellipseGroupConfig.choosable = props.choosable;
}

function updateMaskPointerConfig(radiusX: number, radiusY: number) {
    maskEllipseConfig.radiusX = radiusX;
    maskEllipseConfig.radiusY = radiusY;
    maskEllipseConfig.stroke = props.mask;
    maskEllipseConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskEllipseConfig.visible = props.isMask;
}

function updatePointerConfig(radiusX: number, radiusY: number) {
    ellipseConfig.radiusX = radiusX;
    ellipseConfig.radiusY = radiusY;
    ellipseConfig.fill = props.fill;
    ellipseConfig.stroke = props.stroke;
    ellipseConfig.strokeWidth = props.strokeWidth;
    ellipseConfig.hitStrokeWidth = props.hitStrokeWidth;
}

function updateLineConfig(radiusX: number, radiusY: number) {
    const aEllipseValue = Math.max(radiusX, radiusY);
    const bEllipseValue = Math.min(radiusX, radiusY);
    const directrixValue = Math.pow(aEllipseValue, 2) / Math.sqrt(Math.pow(aEllipseValue, 2) - Math.pow(bEllipseValue, 2));

    // leftLineConfig.points = radiusX > radiusY ?
    //                         [-directrixValue, radiusY, -directrixValue, -radiusY] :
    //                         [radiusX, -directrixValue, -radiusX, -directrixValue];
    // rightLineConfig.points = radiusX > radiusY ?
    //                         [directrixValue, radiusY, directrixValue, -radiusY] :
    //                         [radiusX, directrixValue, -radiusX, directrixValue];
}

watch(() => props, () => {
    const radiusX = Math.sqrt(Math.pow(props.x - props.rowX, 2) + Math.pow(props.y - props.rowY, 2));
    const radiusY = Math.sqrt(Math.pow(props.x - props.colX, 2) + Math.pow(props.y - props.colY, 2));

    updateEllipseGroupConfig();
    updateMaskPointerConfig(radiusX, radiusY);
    updatePointerConfig(radiusX, radiusY);
    updateLineConfig(radiusX, radiusY);
}, {deep: true, immediate: true});

function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.Ellipse;

        const theta = (Math.atan2(ellipseGroupConfig.y - event.evt.layerY, ellipseGroupConfig.x - event.evt.layerX) + 3 * Math.PI -
                      (ellipseGroupConfig.rotation * Math.PI) / 180) % (2 * Math.PI);

        let currentX;
        let currentY;

        const a = ellipseConfig.radiusX;
        const b = ellipseConfig.radiusY;

        if(theta === Math.PI / 2) {
            currentX = 0;
            currentY = b;
        } else if(theta === (3 * Math.PI) / 2) {
            currentX = 0;
            currentY = b;
        } else if((theta >= 0 && theta < Math.PI / 2) || (theta > (3 * Math.PI) / 2 && theta <= 2 * Math.PI)) {
            currentX = (a * b) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
            currentY = (a * b * Math.tan(theta)) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
        } else {
            currentX = -(a * b) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
            currentY = -(a * b * Math.tan(theta)) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
        }

        const rotation = (ellipseGroupConfig.rotation * Math.PI) / 180;
        store.global.hover.x = ellipseGroupConfig.x + currentX * Math.cos(-rotation) - currentY * Math.sin(-rotation);
        store.global.hover.y = ellipseGroupConfig.y + currentX * Math.sin(-rotation) + currentY * Math.cos(-rotation);
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
    if(store.global.hover.id === props.index && !store.global.drawing) {
        const theta = (Math.atan2(ellipseGroupConfig.y - event.evt.layerY, ellipseGroupConfig.x - event.evt.layerX) + 3 * Math.PI -
                      (ellipseGroupConfig.rotation * Math.PI) / 180) % (2 * Math.PI);

        let currentX;
        let currentY;

        const a = ellipseConfig.radiusX;
        const b = ellipseConfig.radiusY;

        if(theta === Math.PI / 2) {
            currentX = 0;
            currentY = b;
        } else if(theta === (3 * Math.PI) / 2) {
            currentX = 0;
            currentY = b;
        } else if((theta >= 0 && theta < Math.PI / 2) || (theta > (3 * Math.PI) / 2 && theta <= 2 * Math.PI)) {
            currentX = (a * b) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
            currentY = (a * b * Math.tan(theta)) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
        } else {
            currentX = -(a * b) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
            currentY = -(a * b * Math.tan(theta)) / (Math.sqrt(b * b + Math.pow(a * Math.tan(theta), 2)));
        }

        const rotation = (ellipseGroupConfig.rotation * Math.PI) / 180;
        store.global.hover.x = ellipseGroupConfig.x + currentX * Math.cos(rotation) - currentY * Math.sin(rotation);
        store.global.hover.y = ellipseGroupConfig.y + currentX * Math.sin(rotation) + currentY * Math.cos(rotation);
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

