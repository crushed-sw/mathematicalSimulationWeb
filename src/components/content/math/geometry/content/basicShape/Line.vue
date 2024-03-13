<template>
    <v-group ref="lineGroup" :config="lineGroupConfig">
        <v-line :config="maskLineConfig"></v-line>
        <v-line :config="lineConfig"></v-line>
        <slot></slot>
    </v-group>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, computed } from "vue"
import { shapeBasicUtil, preConfigs, addDefaultEvent } from "@/hooks/shapeHook.ts"

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

const linePosition = computed((): Array<number> => {
    return [0, 0, props.points[2] - props.points[0], props.points[3] - props.points[1]];
})

const lineGroupConfig = reactive({
    x: props.points[0],
    y: props.points[1],
    draggable: props.draggable,
    rotation: props.rotation,
});

const maskLineConfig = reactive({
    points: linePosition,
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth,
    dash: props.dash,
    visible: false,
});

const lineConfig = reactive({
    points: linePosition,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    dash: props.dash,
});

const preConfig = { ...preConfigs }

const lineGroup = ref();
onMounted(() => {
    nextTick(() => {
        const lineGroupNode = lineGroup.value.getNode();
        addDefaultEvent(lineGroupNode, maskLineConfig, lineGroupConfig, preConfig);
    });
});
</script>

