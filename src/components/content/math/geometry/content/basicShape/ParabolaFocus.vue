<template>
    <v-group
        ref="parabolaGroup"
        :config="parabolaGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @click="click"
    >
        <v-shape :config="maskParabolaConfig"></v-shape>
        <v-shape :config="parabolaConfig"></v-shape>
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
    focusX: {
        type: Number,
        default: 4,
    },
    focusY: {
        type: Number,
        default: 4,
    },
    scope: {
        type: Array<Number>,
        default: [-200, 200],
        validator(value: Array<number>): boolean {
            return value.length === 2;
        }
    },
    ...(shapeBasicUtil as any),
});


function getParams() {
    const p = Math.sqrt(Math.pow(props.y - props.focusY, 2) + Math.pow(props.x - props.focusX, 2)) * 2;

    return p;
}

function parabolaFunction(p: number, x: number) {
    return (x * x) / (2 * p);
}

function drawParabola(context: any) {
    const p = getParams();
    const begin = props.scope[0];
    const end = props.scope[1];
    for(let i = begin; i < end; i += 2) {
        const x = i
        const y = parabolaFunction(p, i);
        if(i === begin) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    }
    for(let i = end; i > begin; i -= 2) {
        const x = i
        const y = parabolaFunction(p, i);
        context.lineTo(x, y);
    }
}

const parabolaGroupConfig = reactive({
    index: props.index,
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: (Math.atan2(props.y - props.focusY, props.x - props.focusX) * 180) / Math.PI + 90,
    isChecked: props.isChecked,
    visible: props.visible,
    choosable: props.choosable,
});

const maskParabolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();
        drawParabola(context);
        context.fillStrokeShape(shape);
    },
    stroke: props.mask,
    strokeWidth: props.maskWidth * 2 + props.strokeWidth,
    visible: false,
});

const parabolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();
        drawParabola(context);
        context.fillStrokeShape(shape);
    },
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    hitStrokeWidth: props.hitStrokeWidth,
});

function updateParabolaGroupConfig() {
    parabolaGroupConfig.index = props.index;
    parabolaGroupConfig.x = props.x;
    parabolaGroupConfig.y = props.y;
    parabolaGroupConfig.draggable = props.draggable;
    parabolaGroupConfig.rotation = (Math.atan2(props.y - props.focusY, props.x - props.focusX) * 180) / Math.PI + 90;
    parabolaGroupConfig.isChecked = props.isChecked;
    parabolaGroupConfig.visible = props.visible;
    parabolaGroupConfig.choosable = props.choosable;
}

function updateParabolaConfig() {
    parabolaConfig.fill = props.fill;
    parabolaConfig.stroke = props.stroke;
    parabolaConfig.strokeWidth = props.strokeWidth;
    parabolaConfig.hitStrokeWidth = props.hitStrokeWidth;
}

function updateMaskParabolaConfig() {
    maskParabolaConfig.stroke = props.mask;
    maskParabolaConfig.strokeWidth = props.maskWidth * 2 + props.strokeWidth;
    maskParabolaConfig.visible = props.isMask;
}

watch(() => props, () => {
    updateParabolaGroupConfig();
    updateParabolaConfig();
    updateMaskParabolaConfig();
}, {deep: true});

function enter() {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.ParabolaFocus;
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

