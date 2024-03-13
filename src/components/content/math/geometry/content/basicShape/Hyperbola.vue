<template>
    <v-group ref="hyperbolaGroup" :config="hyperbolaGroupConfig">
        <v-shape :config="maskHyperbolaConfig"></v-shape>
        <v-shape :config="hyperbolaConfig"></v-shape>
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
    rightPoints: {
        type: Array<Number>,
        default: [100, 100, 200, -200],
        validator(value: Array<number>): boolean {
            return value.length === 4;
        }
    },
    leftPoints: {
        type: Array<Number>,
        default: [-200, 200, -100, -100],
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
    let maxX = Math.max(controlX1, controlX2);
    let minX = Math.min(controlX1, controlX2);
    let maxY = Math.max(controlY1, controlY2);
    let minY = Math.min(controlY1, controlY2);

    let flag: boolean = false;
    for (let i = 0; i <= 720; i += 1) {
        let x = 0;
        let y = 0;
        if(reverse) {
            x = props.radiusX * coshNumber[i] * sign;
            y = props.radiusY * sinhNumber[i] * sign;
        } else {
            x = props.radiusX * coshNumber[720 - i] * sign;
            y = props.radiusY * sinhNumber[720 - i] * sign;
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

const hyperbolaGroupConfig = reactive({
    x: props.x,
    y: props.y,
    draggable: props.draggable,
    rotation: props.rotation,
});

const hyperbolaConfig = reactive({
    sceneFunc: function (context: any, shape: any) {
        context.beginPath();

        drawHyperbola(context, 1, true, props.rightPoints[0], props.rightPoints[1], props.rightPoints[2], props.rightPoints[3]);
        drawHyperbola(context, -1, true, props.leftPoints[0], props.leftPoints[1], props.leftPoints[2], props.leftPoints[3]);

        context.fillStrokeShape(shape);
    },
    fill: props.fill,
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
    strokeWidth: props.strokeWidth + props.maskWidth,
    visible: false,
    hitFunc: hitFunc,
});

const preConfig = { ...preConfigs }

const hyperbolaGroup = ref();
onMounted(() => {
    nextTick(() => {
        const circleNode = hyperbolaGroup.value.getNode();
        addDefaultEvent(circleNode, maskHyperbolaConfig, hyperbolaGroupConfig, preConfig);
    });
});

</script>

