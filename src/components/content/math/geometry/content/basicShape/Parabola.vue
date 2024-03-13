<template>
    <v-group ref="parabolaGroup" :config="parabolaGroupConfig">
        <v-shape :config="maskParabolaConfig"></v-shape>
        <v-shape :config="parabolaConfig"></v-shape>
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
    points: {
        type: Array<Number>,
        default: [100, 100, 200, -200],
        validator(value: Array<number>): boolean {
            return value.length === 4;
        }
    },
    ...(shapeBasicUtil as any),
});

function parabolaFunction(a: number, b: number, c: number, x: number) {
    return a * x * x + b * x + c;
}

const hitFunc = (context: any, shape :any) => {
}

const parabolaGroupConfig = reactive({
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
});

const parabolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();

        context.fillStrokeShape(shape);
    },
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    // hitFunc: hitFunc,
});

const maskParabolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();


        context.fillStrokeShape(shape);
    },
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.maskWidth + 5,
    visible: false,
    // hitFunc: hitFunc,
});

const preConfig = { ...preConfigs }

const parabolaGroup = ref();
onMounted(() => {
    nextTick(() => {
        const circleNode = parabolaGroup.value.getNode();
        addDefaultEvent(circleNode, maskParabolaConfig, parabolaGroupConfig, preConfig);
    });
});

</script>

