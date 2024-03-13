<template>
    <v-group ref="circleGroup" :config="circleGroupConfig">
        <v-circle :config="maskCircleConfig"></v-circle>
        <v-circle :config="circleConfig"></v-circle>
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
    radius: {
        type: Number,
        required: true,
    },
    ...(shapeBasicUtil as any),
});

const hitFunc = (context: any, shape :any) => {
    const innerRadius = shape.radius() - props.hitStrokeWidth / 2;
    const outerRadius = shape.radius() + props.hitStrokeWidth / 2;

    context.beginPath();
    context.arc(shape.x(), shape.y(), outerRadius, 0, 2 * Math.PI);
    context.arc(shape.x(), shape.y(), innerRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fillStrokeShape(shape);
}

const circleGroupConfig = reactive({
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
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
    strokeWidth: props.strokeWidth + props.maskWidth,
    visible: false,
    hitFunc: hitFunc,
});

const preConfig = { ...preConfigs }

const circleGroup = ref();
onMounted(() => {
    nextTick(() => {
        const circleGroupNode = circleGroup.value.getNode();
        addDefaultEvent(circleGroupNode, maskCircleConfig, circleGroupConfig, preConfig);
    });
});

</script>
