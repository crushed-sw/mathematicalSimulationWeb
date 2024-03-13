<template>
    <div ref="container">
        <ScaleText
            :xRatio="xRatio"
            :yRatio="yRatio"
            :numberInterval="interval"
        ></ScaleText>

        <DrawPolarFunction
            :zoomFlag="zoomFlag"
            :dragFlag="dragFlag"
        ></DrawPolarFunction>
        <DrawParameterFunction
            :zoomFlag="zoomFlag"
            :dragFlag="dragFlag"
        ></DrawParameterFunction>
        <DrawCommandFunction
            :zoomFlag="zoomFlag"
            :dragFlag="dragFlag"
        ></DrawCommandFunction>
        <DrawImplicitFunction
            :zoomFlag="zoomFlag"
            :dragFlag="dragFlag"
        ></DrawImplicitFunction>

        <DrawCustomPoint></DrawCustomPoint>
        <Annotation></Annotation>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted, computed } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import {
    useFunctionCanvasStore,
    normalFunctionConfig,
    polarFunctionConfig,
    implicitFunctionConfig,
    customPointConfig
} from "@/stores/functionCanvasStore"

import ScaleText from "./ScaleText.vue"
import DrawPolarFunction from "./DrawPolarFunction.vue"
import DrawParameterFunction from "./DrawParameterFunction.vue"
import DrawCommandFunction from "./DrawCommandFunction.vue"
import DrawImplicitFunction from "./DrawImplicitFunction.vue"
import DrawCustomPoint from "./DrawCustomPoint.vue"
import Annotation from "./DrawAnnotation.vue"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});

const store = useFunctionStore();
const canvasStore = useFunctionCanvasStore();

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

let zoomFlag = ref(false);
let dragFlag = ref(false);

let interval = ref(getInterval());

function getInterval(isNumeric: boolean = false) {
    const minLength = Math.min(store.canvasConfig.xLen, store.canvasConfig.yLen);

    let interval = minLength * 0.2;
    if(isNumeric) {
        interval = interval / Math.PI;
    }

    const interval1 = Math.floor(Math.log10(interval));
    const interval2 = Math.floor(Math.log10(interval * 0.5));
    const interval5 = Math.floor(Math.log10(interval * 0.2));

    let number = null;
    if(interval1 > interval2) {
        number = Math.pow(10, interval1);
    } else if(interval2 > interval5) {
        number = 2 * Math.pow(10, interval2);
    } else {
        number = 5 * Math.pow(10, interval5);
    }

    if(isNumeric) {
        return number * Math.PI;
    }
    return number;
}

const xRatio = computed(() => {
    return store.canvasConfig.width / store.canvasConfig.xLen;
});

const yRatio = computed(() => {
    return store.canvasConfig.height / store.canvasConfig.yLen;
});

const xRatioReciprocal = computed(() => {
    return store.canvasConfig.xLen / store.canvasConfig.width;
});

const yRatioReciprocal = computed(() => {
    return store.canvasConfig.yLen / store.canvasConfig.height;
});

function yPxToScale(numY: number) {
    return store.canvasConfig.yScope[1] - numY * yRatioReciprocal.value;
}

function xPxToScale(numX: number) {
    return store.canvasConfig.xScope[0] + numX * xRatioReciprocal.value;
}

function xScaleToPx(numX: number, ratio?: any) {
    if(ratio !== undefined) {
        return ratio * (numX - store.canvasConfig.xScope[0]);
    }
    return xRatio.value * (numX - store.canvasConfig.xScope[0]);
}

function yScaleToPx(numY: number, ratio?: any) {
    if(ratio !== undefined) {
        return ratio * (store.canvasConfig.yScope[1] - numY);
    }
    return yRatio.value * (store.canvasConfig.yScope[1] - numY);
}

function startDrag(event: any) {
    isDragging = true;
    offsetX = event.layerX;
    offsetY = event.layerY;
}

function drag(event: any) {
    if (isDragging) {
        const dx = event.layerX - offsetX;
        const dy = event.layerY - offsetY;
        offsetX = event.layerX;
        offsetY = event.layerY;

        const distanceX = dx * (store.canvasConfig.xLen / props.width);
        const distanceY = dy * (store.canvasConfig.yLen / props.height);

        store.canvasConfig.xScope[0] -= distanceX;
        store.canvasConfig.xScope[1] -= distanceX;
        store.canvasConfig.yScope[0] += distanceY;
        store.canvasConfig.yScope[1] += distanceY;

        canvasStore.updateZero(dx, dy, -distanceX, 0, distanceY, 0, true);
        dragFlag.value = !dragFlag.value;
    }
    hover(event.layerX, event.layerY);
}

function endDrag() {
    isDragging = false;
}

function zoomHandler(isNumeric: boolean = false) {
    const xratio = store.canvasConfig.width / store.canvasConfig.xLen;
    const yratio = store.canvasConfig.height / store.canvasConfig.yLen;

    interval.value = getInterval(isNumeric);
    const minorInterval = interval.value / 5;

    const startNumberMinorY = Math.floor(store.canvasConfig.yScope[1] / minorInterval) * minorInterval;
    const startNumberMinorX = Math.ceil(store.canvasConfig.xScope[0] / minorInterval) * minorInterval;

    const startNumberY = Math.floor(store.canvasConfig.yScope[1] / interval.value) * interval.value;
    const startNumberX = Math.ceil(store.canvasConfig.xScope[0] / interval.value) * interval.value;

    const xZero = xScaleToPx(0, xratio);
    const yZero = yScaleToPx(0, yratio);

    const leftMin = Math.abs(xZero);
    const rightMin = Math.abs(yZero);
    const topMin = Math.abs(store.canvasConfig.width - xZero);
    const bottomMin = Math.abs(store.canvasConfig.height - yZero);

    const leftTopMax = Math.sqrt(Math.pow(xZero, 2) + Math.pow(yZero, 2));
    const rightTopMax = Math.sqrt(Math.pow(xZero, 2) + Math.pow(store.canvasConfig.height - yZero, 2));
    const leftBottomMax = Math.sqrt(Math.pow(store.canvasConfig.width - xZero, 2) + Math.pow(yZero, 2));
    const rightBottomMax = Math.sqrt(Math.pow(store.canvasConfig.width - xZero, 2) +
                                   Math.pow(store.canvasConfig.height - yZero, 2));

    let minDistance = Math.min(Math.min(leftMin, rightMin), Math.min(topMin, bottomMin));
    const maxDistance = Math.max(Math.max(leftTopMax, rightTopMax), Math.max(leftBottomMax, rightBottomMax));

    let startNumberCircle = Math.ceil(minDistance / interval.value) * interval.value;
    let startNumberMinorCircle = Math.ceil(minDistance / minorInterval) * minorInterval;
    if(store.canvasConfig.xScope[0] < 0 && store.canvasConfig.xScope[1] > 0 &&
       store.canvasConfig.yScope[0] < 0 && store.canvasConfig.yScope[1] > 0) {
        startNumberCircle = 0;
        startNumberMinorCircle = 0;
        minDistance = 0;
    }

    canvasStore.updateNumberInterval(
        interval.value * xratio,
        xScaleToPx(startNumberX, xratio),
        yScaleToPx(startNumberY, yratio),
    );
    canvasStore.updateMinorNumberInterval(
        minorInterval * xratio,
        xScaleToPx(startNumberMinorX, xratio),
        yScaleToPx(startNumberMinorY, yratio),
    );
    canvasStore.updateCircle(
        startNumberCircle,
        startNumberMinorCircle,
        minDistance,
        maxDistance,
    )

    canvasStore.updateZero(xZero, yZero, ...store.canvasConfig.xScope, ...store.canvasConfig.yScope);
    zoomFlag.value = !zoomFlag.value;
    // canvasStore.update();
}

function wheel(event: any) {
    const xLen = store.canvasConfig.xLen;
    const yLen = store.canvasConfig.yLen;

    const width = store.canvasConfig.width;
    const height = store.canvasConfig.height;

    const leftRatio = event.layerX / width;
    const rightRatio = 1 - leftRatio;
    const topRatio = event.layerY / height;
    const bottomRatio = 1 - topRatio;

    const currentPoint = [
        (xLen * leftRatio) + store.canvasConfig.xScope[0],
        (yLen * bottomRatio) + store.canvasConfig.yScope[0],
    ];

    function wheelHelp(num: number) {
        const xScaleNumber = xLen * num;
        const yScaleNumber = yLen * num;

        store.canvasConfig.xScope = [
            currentPoint[0] - (xScaleNumber * leftRatio),
            currentPoint[0] + (xScaleNumber * rightRatio),
        ];
        store.canvasConfig.yScope = [
            currentPoint[1] - (yScaleNumber * bottomRatio),
            currentPoint[1] + (yScaleNumber * topRatio),
        ];
    }

    if(event.deltaY > 0) {
        wheelHelp(1.05);
    } else if(event.deltaY < 0) {
        wheelHelp(0.95);
    }

    store.updateXLen();
    store.updateYLen();

    zoomHandler(store.canvasConfig.triangleNumber);
}

function hover(layerX: number, layerY: number) {
    const scaleX = xPxToScale(layerX);
    const scaleY = yPxToScale(layerY);

    let minDistance = Infinity;
    let x = NaN;
    let y = NaN;
    canvasStore.customPoints.forEach((points: customPointConfig[]) => {
        points.forEach((point: customPointConfig) => {
            const pointX = point.x;
            const pointY = point.y;

            const distance = Math.sqrt(Math.pow(pointX - scaleX, 2) + Math.pow(pointY - scaleY, 2));
            if(distance < minDistance) {
                minDistance = distance;
                x = pointX;
                y = pointY;
            }
        });
    });

    const item = canvasStore.singlePoints.get(store.focus);
    if(item) {
        item.forEach((point: number[]) => {
            const pointX = point[0];
            const pointY = point[1];

            const distance = Math.sqrt(Math.pow(pointX - scaleX, 2) + Math.pow(pointY - scaleY, 2));
            if(distance < minDistance) {
                minDistance = distance;
                x = pointX;
                y = pointY;
            }
        });
    }

    if(isFinite(x) && isFinite(y)) {
        if(minDistance * xRatio.value < 10) {
            store.annotation.xScale = x;
            store.annotation.yScale = y;
            store.annotation.xPx = xScaleToPx(x);
            store.annotation.yPx = yScaleToPx(y);
            store.annotation.isVisible = true;
        } else {
            store.annotation.isVisible = false;
        }
    } else {
        store.annotation.isVisible = false;
    }
}

function click(event: any) {
    const scaleX = xPxToScale(event.layerX);
    const scaleY = yPxToScale(event.layerY);

    let minValue = Infinity;
    let id = -1;

    canvasStore.normalFunctions.forEach((value: normalFunctionConfig) => {
        if(value.reverse) {
            const xValue = value.func(scaleY);
            const distanceValue = Math.abs(xValue - scaleX);
            if(distanceValue < minValue) {
                minValue = distanceValue;
                id = value.id;
            }
        } else {
            const yValue = value.func(scaleX);
            const distanceValue = Math.abs(yValue - scaleY);
            if(distanceValue < minValue) {
                minValue = distanceValue;
                id = value.id;
            }
        }
    });

    canvasStore.polarFunctions.forEach((value: polarFunctionConfig) => {
        let theta = 0;
        if(scaleX === 0) {
            if(scaleY > 0) {
                theta = Math.PI / 2;
            } else {
                theta = Math.PI + Math.PI / 2;
            }
        } else {
            theta = Math.atan2(scaleY, scaleX);
        }

        console.log(theta);
        for(let i = theta; i >= value.scope[0]; i -= 2 * Math.PI) {
            const r = value.func(i);
            const yValue = r * Math.sin(i);
            const distanceValue = Math.abs(yValue - scaleY);
            if(distanceValue < minValue) {
                minValue = distanceValue;
                id = value.id;
            }
        }
        for(let i = theta + 2 * Math.PI; i <= value.scope[1]; i += 2 * Math.PI) {
            const r = value.func(i);
            const yValue = r * Math.sin(i);
            const distanceValue = Math.abs(yValue - scaleY);
            if(distanceValue < minValue) {
                minValue = distanceValue;
                id = value.id;
            }
        }
    });

    canvasStore.implicitFunctions.forEach((value: implicitFunctionConfig) => {
        const numberValue = value.func(scaleX, scaleY);
        const distanceValue = Math.abs(numberValue);
        if(distanceValue * xRatio.value < 10) {
            minValue = distanceValue;
            id = value.id;
        }
    });

    if(minValue * yRatio.value < 10) {
        if(store.focus !== id) {
            store.focus = id;
        }
    } else {
        if(store.focus !== -1) {
            store.focus = -1;
        }
    }
}

function bindAllEvent() {
    canvasStore.canvas.addEventListener("mousedown", startDrag);
    canvasStore.canvas.addEventListener("mousemove", drag);
    canvasStore.canvas.addEventListener("mouseup", endDrag);
    canvasStore.canvas.addEventListener("mouseleave", endDrag);
    canvasStore.canvas.addEventListener("wheel", wheel);
    canvasStore.canvas.addEventListener("click", click);
}

function clearAllEvent() {
    canvasStore.canvas.removeEventListener("mousedown", startDrag);
    canvasStore.canvas.removeEventListener("mousemove", drag);
    canvasStore.canvas.removeEventListener("mouseup", endDrag);
    canvasStore.canvas.removeEventListener("mouseleave", endDrag);
    canvasStore.canvas.removeEventListener("wheel", wheel);
    canvasStore.canvas.removeEventListener("click", click);
}

watch([
    () => store.canvasConfig.isMinorAxis,
    () => store.canvasConfig.isGride,
    () => store.canvasConfig.isXAxis,
    () => store.canvasConfig.isYAxis,
], (value: any) => {
    canvasStore.updateScale(value[0], value[1], value[2], value[3]);
    canvasStore.drawBack();
    canvasStore.update();
});

watch(() => store.canvasConfig.coordinate, (value: any) => {
    canvasStore.updateCoordinate(value);
    canvasStore.drawBack();
    canvasStore.update();
})

watch(() => store.canvasConfig.triangleNumber, (value: any) => {
    zoomHandler(value);
});

watch(() => props, (value: any) => {
    if(value.width !== 0 && value.height !== 0) {
        store.canvasConfig.width = value.width;
        store.canvasConfig.height = value.height;

        const newRatio = (store.canvasConfig.xLen * value.height) / (store.canvasConfig.yLen * value.width)

        store.canvasConfig.yScope[0] *= newRatio;
        store.canvasConfig.yScope[1] *= newRatio;
        store.updateYLen();

        canvasStore.resize(value.width, value.height, store.canvasConfig.xScope, store.canvasConfig.yScope);

        zoomHandler(store.canvasConfig.triangleNumber);
    }
}, { deep: true, immediate: true });

const container = ref();
onMounted(() => {
    canvasStore.init(container.value);
    bindAllEvent();
});

onUnmounted(() => {
    clearAllEvent();
});
</script>
