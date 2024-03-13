<template>
    <v-group ref="pointerGroup" :config="pointerGroupConfig">
        <v-circle :config="maskPointerConfig"></v-circle>
        <v-circle :config="pointerConfig"></v-circle>
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
        default: 4
    },
    ...(shapeBasicUtil as any),
});

const pointerGroupConfig = reactive({
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
    isChecked: props.isChecked,
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

const preConfig = { ...preConfigs }

const pointerGroup = ref();
onMounted(() => {
    nextTick(() => {
        const pointerGroupNode = pointerGroup.value.getNode();
        addDefaultEvent(pointerGroupNode, maskPointerConfig, pointerGroupConfig, preConfig);
   });
});
</script>

