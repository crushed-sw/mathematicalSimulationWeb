<template>
    <i
        class="mathExpression absolute"
        v-if="zeroVisible"
        v-html="zeroKatexString"
        :style="{
            color: 'rgba(0, 0, 0, 1)',
            top: `${yZeroPx}px`,
            right: `${xZeroPx}px`,
        }"
    />

    <div
        v-if="store.canvasConfig.isXAxis && store.canvasConfig.isScaleText"
    >
        <i
            class="mathExpression absolute"
            v-for="element in xAxisRenderString"
            v-html="element[0]"
            v-show="xZeroVisible(element[1])"
            :key="`xAXisScale-${element[1]}`"
            :style="{
                color: !yBottom && !yTop ? 'rgba(0, 0, 0, 1)' : 'rgba(150, 150, 150, 1)',
                top: !yTop && !yBottom ? `${yZeroPx}px` : yTop ? '0px' : 'auto',
                bottom: yBottom ? '0px' : 'auto',
                left: `${xScaleToPx(element[1])}px`
            }"
        />
    </div>

    <div
        v-if="store.canvasConfig.isYAxis && store.canvasConfig.isScaleText"
    >
        <i
            class="mathExpression absolute"
            v-for="element in yAxisRenderString"
            v-html="element[0]"
            v-show="yZeroVisible(element[1])"
            :key="`yAXisScale-${element[1]}`"
            :style="{
                color: !xRight && !xLeft ? 'rgba(0, 0, 0, 1)' : 'rgba(150, 150, 150, 1)',
                top: `${yScaleToPx(element[1])}px`,
                left: xLeft ? '0px' : 'auto',
                right: !xRight && !xLeft ? `${xZeroPx}px` : xRight ? '0px' : 'auto',
            }"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"

function parseStringToKatex(str: string) {
    let result = `<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span>`;
    let endValue = "</span></span></span>";

    const len = str.length;
    if(len !== 0) {
        let end = len;
        if(str[len - 1] === "&") {
            endValue = `<span class="mord mathnormal" style="margin-right:0.03588em;">π</span>`;
            end--;
        }

        const substr = str.substring(0, end);
        result += `<span class="mord">${substr}</span>`;
    }

    result += endValue;
    return result;
}

const props = defineProps({
    xRatio: {
        type: Number,
        required: true,
    },
    yRatio: {
        type: Number,
        required: true,
    },
    numberInterval: {
        type: Number,
        required: true,
    }
});

const store = useFunctionStore();
const zeroKatexString = parseStringToKatex("0");
const zeroVisible = computed(() => {
    return store.canvasConfig.xScope[0] < 0 && store.canvasConfig.xScope[1] > 0 &&
           store.canvasConfig.yScope[0] < 0 && store.canvasConfig.yScope[1] > 0 &&
           store.canvasConfig.isXAxis && store.canvasConfig.isYAxis && store.canvasConfig.isScaleText;
});

const xAxisRenderString: any[][] = reactive([]);
const yAxisRenderString: any[][] = reactive([]);

const xLeft = ref(false);
const xRight = ref(false);
const yBottom = ref(false);
const yTop = ref(false);

let prevXStartNumber = 0;
let prevXEndNumber = 0;
let prevYStartNumber = 0;
let prevYEndNumber = 0;

function xScaleToPx(numX: number) {
    return props.xRatio * (numX - store.canvasConfig.xScope[0]) - 4;
}

function yScaleToPx(numY: number) {
    return props.yRatio * (store.canvasConfig.yScope[1] - numY) - 8;
}

function xZeroVisible(value: number) {
    return yTop.value || yBottom.value || Math.abs(value) > 0.00000001 || !store.canvasConfig.isYAxis;
}

function yZeroVisible(value: number) {
    return xRight.value || xLeft.value || Math.abs(value) > 0.00000001 || !store.canvasConfig.isXAxis;
}

function updateXRenderString(xStartNumber: number, xEndNumber: number) {
    if(store.canvasConfig.isXAxis && store.canvasConfig.isScaleText) {
        const left = xStartNumber;
        const right = xEndNumber + props.numberInterval;

        if(store.canvasConfig.triangleNumber) {
            if(store.canvasConfig.showNumbers) {
                const tempArray: string[][] = [];
                for(let i = left; i <= right; i += props.numberInterval) {
                    const value = i.toFixed(5)
                    tempArray.push([parseStringToKatex(`${value}`), value]);
                }
                xAxisRenderString.splice(0, xAxisRenderString.length, ...tempArray);
            } else {
                const floorNumber = Math.pow(10, Math.floor(Math.log10(props.numberInterval / Math.PI)));
                const fixNumber = (floorNumber.toString().split('.')[1] || '').length;
                const tempArray: string[][] = [];
                for(let i = left; i <= right; i += props.numberInterval) {
                    const value = (i / Math.PI).toFixed(fixNumber)
                    tempArray.push([parseStringToKatex(`${value}&`), `${i}`]);
                }
                xAxisRenderString.splice(0, xAxisRenderString.length, ...tempArray);
            }
        } else {
            const fixNumber = (props.numberInterval.toString().split('.')[1] || '').length;
            const tempArray: string[][] = [];
            for(let i = left; i <= right; i += props.numberInterval) {
                const value = i.toFixed(fixNumber)
                tempArray.push([parseStringToKatex(`${value}`), value]);
            }
            xAxisRenderString.splice(0, xAxisRenderString.length, ...tempArray);
        }
    }
}

function updateYRenderString(yStartNumber: number, yEndNumber: number) {
    if(store.canvasConfig.isYAxis && store.canvasConfig.isScaleText) {
        const left = yEndNumber;
        const right = yStartNumber - props.numberInterval;

        if(store.canvasConfig.triangleNumber) {
            if(store.canvasConfig.showNumbers) {
                const tempArray: string[][] = [];
                for(let i = left; i >= right; i -= props.numberInterval) {
                    const value = i.toFixed(5)
                    tempArray.push([parseStringToKatex(`${value}`), value]);
                }
                yAxisRenderString.splice(0, yAxisRenderString.length, ...tempArray);
            } else {
                const floorNumber = Math.pow(10, Math.floor(Math.log10(props.numberInterval / Math.PI)));
                const fixNumber = (floorNumber.toString().split('.')[1] || '').length;
                const tempArray: string[][] = [];
                for(let i = left; i >= right; i -= props.numberInterval) {
                    const value = (i / Math.PI).toFixed(fixNumber)
                    tempArray.push([parseStringToKatex(`${value}&`), `${i}`]);
                }
                yAxisRenderString.splice(0, yAxisRenderString.length, ...tempArray);
            }
        } else {
            const fixNumber = (props.numberInterval.toString().split('.')[1] || '').length;
            const tempArray: string[][] = [];
            for(let i = left; i >= right; i -= props.numberInterval) {
                const value = i.toFixed(fixNumber)
                tempArray.push([parseStringToKatex(`${value}`), value]);
            }
            yAxisRenderString.splice(0, yAxisRenderString.length, ...tempArray);
        }
    }
}

const xZeroPx = computed(() => {
    return store.canvasConfig.xScope[1] * props.xRatio + 8;
});

const yZeroPx = computed(() => {
    return store.canvasConfig.yScope[1] * props.yRatio + 4;
});

watch([() => props.numberInterval, () => store.canvasConfig.showNumbers], (value: any) => {
    const xStartNumber = Math.ceil(store.canvasConfig.xScope[0] / value[0]) * value[0];
    const xEndNumber = Math.floor(store.canvasConfig.xScope[1] / value[0]) * value[0];

    const yStartNumber = Math.ceil(store.canvasConfig.yScope[0] / value[0]) * value[0];
    const yEndNumber = Math.floor(store.canvasConfig.yScope[1] / value[0]) * value[0];

    updateXRenderString(xStartNumber, xEndNumber);
    updateYRenderString(yStartNumber, yEndNumber);

    prevXStartNumber = xStartNumber;
    prevXEndNumber = xEndNumber;

    prevYStartNumber = yStartNumber;
    prevYEndNumber = yEndNumber;
}, {immediate: true});

watch([() => store.canvasConfig.xScope, () => store.canvasConfig.yScope], () => {
    {
        xLeft.value = store.canvasConfig.xScope[0] > 0;
        xRight.value = store.canvasConfig.xScope[1] < 0;

        const xStartNumber = Math.ceil(store.canvasConfig.xScope[0] / props.numberInterval) * props.numberInterval;
        const xEndNumber = Math.floor(store.canvasConfig.xScope[1] / props.numberInterval) * props.numberInterval;

        if(prevXStartNumber !== xStartNumber || prevXEndNumber !== xEndNumber) {
            updateXRenderString(xStartNumber, xEndNumber);

            prevXStartNumber = xStartNumber;
            prevXEndNumber = xEndNumber;
        }
    }

    {
        yBottom.value = store.canvasConfig.yScope[0] > 0;
        yTop.value = store.canvasConfig.yScope[1] < 0;

        const yStartNumber = Math.ceil(store.canvasConfig.yScope[0] / props.numberInterval) * props.numberInterval;
        const yEndNumber = Math.floor(store.canvasConfig.yScope[1] / props.numberInterval) * props.numberInterval;

        if(prevYStartNumber !== yStartNumber || prevYEndNumber !== yEndNumber) {
            updateYRenderString(yStartNumber, yEndNumber);

            prevYStartNumber = yStartNumber;
            prevYEndNumber = yEndNumber;
        }
    }
}, {
    deep: true,
    immediate: true
});
</script>

<style lang="scss" scoped>
.mathExpression {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    font-size: 12px;
    z-index: 99;
    width: auto;
    height: auto;
}
</style>
