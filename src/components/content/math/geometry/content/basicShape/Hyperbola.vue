<template>
    <v-group
        ref="hyperbolaGroup"
        :config="hyperbolaGroupConfig"
        @mouseenter="enter"
        @mouseout="out"
        @mousemove="move"
        @click="click"
    >
        <v-shape :config="maskHyperbolaConfig"></v-shape>
        <v-shape :config="hyperbolaConfig"></v-shape>
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
    rightPoints: {
        type: Array<Number>,
        default: [200, 200, 200, -200],
        validator(value: Array<number>): boolean {
            return value.length === 4;
        }
    },
    leftPoints: {
        type: Array<Number>,
        default: [-200, 200, -200, -200],
        validator(value: Array<number>): boolean {
            return value.length === 4;
        }
    },
    ...(shapeBasicUtil as any),
});

const coshNumber: number[] = [];
const sinhNumber: number[] = [];
const translateConst = Math.PI / 180;

for(let i = -360; i <= 360; ++i) {
    var angle = i * translateConst;
    coshNumber.push(Math.cosh(angle));
    sinhNumber.push(Math.sinh(angle));
}

function drawHyperbola(context: any, sign: number, reverse: boolean,
                       controlX1: number, controlY1: number,
                       controlX2: number, controlY2: number) {
    const xRadiusValue = Math.sqrt(Math.pow(props.x - props.rowX, 2) + Math.pow(props.y - props.rowY, 2));
    const yRadiusValue = Math.sqrt(Math.pow(props.x - props.colX, 2) + Math.pow(props.y - props.colY, 2));

    let maxX = Math.max(controlX1, controlX2);
    let minX = Math.min(controlX1, controlX2);
    let maxY = Math.max(controlY1, controlY2);
    let minY = Math.min(controlY1, controlY2);

    let flag: boolean = false;
    for (let i = 0; i <= 720; i += 1) {
        let x = 0;
        let y = 0;
        if(reverse) {
            x = xRadiusValue * coshNumber[i] * sign;
            y = yRadiusValue * sinhNumber[i] * sign;
        } else {
            x = xRadiusValue * coshNumber[720 - i] * sign;
            y = yRadiusValue * sinhNumber[720 - i] * sign;
        }
        if (!flag) {
            if ((x <= maxX && x >= minX) || (y <= maxY && y >= minY)) {
                context.moveTo(x, y);
                flag = true;
            }
        } else {
            if ((x <= maxX && x >= minX) || (y <= maxY && y >= minY)) {
                context.lineTo(x, y);
            }
        }
    }
}

const hitFunc = (context: any, shape :any) => {
    context.beginPath();
    drawHyperbola(context, 1, true, props.rightPoints[0], props.rightPoints[1], props.rightPoints[2], props.rightPoints[3]);
    drawHyperbola(context, 1, false, props.rightPoints[0], props.rightPoints[1], props.rightPoints[2], props.rightPoints[3]);

    drawHyperbola(context, -1, true, props.leftPoints[0], props.leftPoints[1], props.leftPoints[2], props.leftPoints[3]);
    drawHyperbola(context, -1, false, props.leftPoints[0], props.leftPoints[1], props.leftPoints[2], props.leftPoints[3]);

    context.lineWidth = props.hitStrokeWidth;
    context.stroke();
    context.fillStrokeShape(shape);
}

const xRadiusValue = Math.sqrt(Math.pow(props.x - props.rowX, 2) + Math.pow(props.y - props.rowY, 2));
const yRadiusValue = Math.sqrt(Math.pow(props.x - props.colX, 2) + Math.pow(props.y - props.colY, 2));

const hyperbolaGroupConfig = reactive({
    index: props.index,
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: (Math.atan2(props.rowY - props.y, props.rowX - props.x) * 180) / Math.PI,
    visible: props.visible,
    choosable: props.choosable,
});

const hyperbolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();

        drawHyperbola(context, 1, true, props.rightPoints[0], props.rightPoints[1], props.rightPoints[2], props.rightPoints[3]);
        drawHyperbola(context, -1, true, props.leftPoints[0], props.leftPoints[1], props.leftPoints[2], props.leftPoints[3]);

        context.fillStrokeShape(shape);
    },
    fill: props.fill,
    radiusX: xRadiusValue,
    radiusY: yRadiusValue,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    hitStrokeWidth: props.hitStrokeWidth,
    hitFunc: hitFunc,
});

const maskHyperbolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();

        drawHyperbola(context, 1, true, props.rightPoints[0], props.rightPoints[1], props.rightPoints[2], props.rightPoints[3]);
        drawHyperbola(context, -1, true, props.leftPoints[0], props.leftPoints[1], props.leftPoints[2], props.leftPoints[3]);

        context.fillStrokeShape(shape);
    },
    fill: "rgba(0, 0, 0, 0)",
    stroke: props.mask,
    strokeWidth: props.strokeWidth + props.maskWidth * 2,
    visible: false,
    hitFunc: hitFunc,
});

function updateHyperbolaGroupConfig() {
    hyperbolaGroupConfig.index = props.index;
    hyperbolaGroupConfig.x = props.x;
    hyperbolaGroupConfig.y = props.y;
    hyperbolaGroupConfig.draggable = props.draggable;
    hyperbolaGroupConfig.rotation = (Math.atan2(props.rowY - props.y, props.rowX - props.x) * 180) / Math.PI;
    hyperbolaGroupConfig.visible = props.visible;
    hyperbolaGroupConfig.choosable = props.choosable;
}

function updateHyperbolaConfig() {
    hyperbolaConfig.fill = props.fill;
    hyperbolaConfig.stroke = props.stroke;
    hyperbolaConfig.strokeWidth = props.strokeWidth;
    hyperbolaConfig.hitStrokeWidth = props.hitStrokeWidth;
    hyperbolaConfig.radiusX = Math.sqrt(Math.pow(props.x - props.rowX, 2) + Math.pow(props.y - props.rowY, 2));
    hyperbolaConfig.radiusY = Math.sqrt(Math.pow(props.x - props.colX, 2) + Math.pow(props.y - props.colY, 2));
}

function updateMaskHyperbolaConfig() {
    maskHyperbolaConfig.stroke = props.mask;
    maskHyperbolaConfig.strokeWidth = props.strokeWidth + props.maskWidth * 2;
    maskHyperbolaConfig.visible = props.isMask;
}

watch(() => props, () => {
    updateHyperbolaGroupConfig();
    updateHyperbolaConfig();
    updateMaskHyperbolaConfig();
}, {deep: true, immediate: true});


function enter(event: any) {
    if(props.index > 0) {
        store.global.hover.id = props.index;
        store.global.hover.type = Types.Hyperbola;
        store.global.hover.x = event.evt.layerX;
        store.global.hover.y = event.evt.layerY;
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
    if(store.global.hover.id === props.index) {
        store.global.hover.x = event.evt.layerX;
        store.global.hover.y = event.evt.layerY;
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

