<template>
    <v-group ref="ellipseGroup" :config="ellipseGroupConfig">
        <v-ellipse :config="maskEllipseConfig"></v-ellipse>
        <v-ellipse :config="ellipseConfig"></v-ellipse>

        <v-line :config="leftLineConfig"></v-line>
        <v-line :config="rightLineConfig"></v-line>

        <slot></slot>
    </v-group>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue"
import { shapeBasicUtil, preConfigs, addDefaultEvent } from "@/hooks/shapeHook.ts"

const props = defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    radiusX: {
        type: Number,
        required: true,
    },
    radiusY: {
        type: Number,
        required: true,
    },
    ...(shapeBasicUtil as any),
});

const hitFunc = (context: any, shape :any) => {
    const innerRadiusX = shape.radiusX() - props.hitStrokeWidth / 2;
    const innerRadiusY = shape.radiusY() - props.hitStrokeWidth / 2;
    const outerRadiusX = shape.radiusX() + props.hitStrokeWidth / 2;
    const outerRadiusY = shape.radiusY() + props.hitStrokeWidth / 2;

    context.beginPath();
    context.ellipse(shape.x(), shape.y(), outerRadiusX, outerRadiusY, 0, 0, 2 * Math.PI, false);
    context.ellipse(shape.x(), shape.y(), innerRadiusX, innerRadiusY, 0, 0, 2 * Math.PI, true);
    context.closePath();
    context.fillStrokeShape(shape);
}

const ellipseA = Math.max(props.radiusX, props.radiusY);
const ellipseB = Math.min(props.radiusX, props.radiusY);

const directrix = Math.pow(ellipseA, 2) / Math.sqrt(Math.pow(ellipseA, 2) - Math.pow(ellipseB, 2));

const leftLineConfig = reactive({
    points: props.radiusX > props.radiusY ? 
            [-directrix, props.radiusY, -directrix, -props.radiusY] : 
            [props.radiusX, -directrix, -props.radiusX, -directrix],
    strokeWidth: 2,
    stroke: "green",
    visible: false,
});

const rightLineConfig = reactive({
    points: props.radiusX > props.radiusY ? 
            [directrix, props.radiusY, directrix, -props.radiusY] : 
            [props.radiusX, directrix, -props.radiusX, directrix],
    strokeWidth: 2,
    stroke: "green",
    visible: false,
});

// const majorAxis = reactive({

// });

// const minorAxis = reactive({

// });

// const majorAxisText = reactive({
//     x: 0,
//     y: 0,
//     text: "demo",
//     fontSize: 20,
//     fontFamily: 'Calibri',
//     fill: 'green'
// });

// const minorAxisText = reactive({

// });

const ellipseGroupConfig = reactive({
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
});

const ellipseConfig = reactive({
    radiusX: props.radiusX,
    radiusY: props.radiusY,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});

const maskEllipseConfig = reactive({
    radiusX: props.radiusX,
    radiusY: props.radiusY,
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth,
    visible: false,
    hitFunc: hitFunc,
});

const preConfig = { ...preConfigs }

const ellipseGroup = ref();
onMounted(() => {
    nextTick(() => {
        const circleNode = ellipseGroup.value.getNode();
        addDefaultEvent(circleNode, maskEllipseConfig, ellipseGroupConfig, preConfig);
    });
});

</script>

