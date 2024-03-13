<template>
    <v-group ref="rectangleGroup" :config="rectangleGroupConfig">
        <v-rect :config="maskRectangleConfig"></v-rect>
        <v-rect :config="rectangleConfig"></v-rect>
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
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
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

const rectangleGroupConfig = reactive({
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
});

const maskRectangleConfig = reactive({
    x: 0,
    y: 0,
    width: props.width,
    height: props.height,
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    visible: false,
    hitFunc: hitFunc,
});

const rectangleConfig = reactive({
    x: 0,
    y: 0,
    width: props.width,
    height: props.height,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});


const preConfig = { ...preConfigs }

const rectangleGroup = ref();
onMounted(() => {
    nextTick(() => {
        const rectangleGroupNode = rectangleGroup.value.getNode();
        addDefaultEvent(rectangleGroupNode, maskRectangleConfig, rectangleGroupConfig, preConfig);
   });
});
</script>

