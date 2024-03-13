<template>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import { useFunctionCanvasStore, polarFunctionConfig } from "@/stores/functionCanvasStore"

const props = defineProps({
    zoomFlag: {
        type: Boolean,
        required: true,
    },
    dragFlag: {
        type: Boolean,
        required: true,
    },
});

const store = useFunctionStore();
const canvasStore = useFunctionCanvasStore();

const polarFunctionMap = new Map<number, string>;
const functionScopeMap = new Map<number, number[]>;

function drawPolarFunction(id: number) {
    const item = canvasStore.polarFunctions.get(id);
    const interval = Math.PI / 90;
    if(item) {
        if(item.scope[0] < item.left) {
            const tempPoints = [];
            let i = 0;
            for(i = item.left; i >= item.scope[0] - interval; i -= interval) {
                const r = item.func(i);
                tempPoints.push([r * Math.cos(i), r * Math.sin(i), i]);
            }
            item.points = [...(tempPoints.reverse()), ...item.points];
            item.left = i + interval;
        }
        if(item.scope[1] > item.right) {
            const tempPoints = [];
            let i = 0;
            for(i = item.right; i <= item.scope[1] + interval; i += interval) {
                const r = item.func(i);
                tempPoints.push([r * Math.cos(i), r * Math.sin(i), i]);
            }
            item.points = [...item.points, ...tempPoints];
            item.right = i - interval;
        }

        const tempPoints: number[] = [];
        let r = 0;

        r = item.func(item.scope[0]);
        tempPoints.push(canvasStore.xScaleToPx(r * Math.cos(item.scope[0])), canvasStore.yScaleToPx(r * Math.sin(item.scope[0])));
        item.points.forEach((point: number[]) => {
            if(point[2] >= item.scope[0] && point[2] <= item.scope[1]) {
                tempPoints.push(canvasStore.xScaleToPx(point[0]), canvasStore.yScaleToPx(point[1]));
            }
        });
        r = item.func(item.scope[1]);
        tempPoints.push(canvasStore.xScaleToPx(r * Math.cos(item.scope[1])), canvasStore.yScaleToPx(r * Math.sin(item.scope[1])));

        item.ctx?.clearRect(0, 0, item.canvas.width, item.canvas.height);
        let lineWidth = 2;
        if(store.focus === item.id) {
            lineWidth = 3;
        }
        canvasStore.drawLine(item.ctx, {
            points: tempPoints,
            lineWidth,
            color: item.color,
        });
    }
}

function addPolarFunction(id: number, func: Function, scope: number[], color: string) {
    const tempNormalCanvas: HTMLCanvasElement = document.createElement("canvas");
    const tempNormalCtx: CanvasRenderingContext2D | null = tempNormalCanvas.getContext("2d");
    tempNormalCanvas.width = canvasStore.canvas.width;
    tempNormalCanvas.height = canvasStore.canvas.height;

    const config = {
        id,
        color,
        points: [] as number[][],
        func,
        canvas: tempNormalCanvas,
        ctx: tempNormalCtx,
        scope,
        left: 0,
        right: 0,
    } as polarFunctionConfig;

    canvasStore.polarFunctions.set(id, config);

    drawPolarFunction(id);
    canvasStore.update();
}

function updatePolarFunction(id: number, func: Function, scope: number[], color: string) {
    canvasStore.polarFunctions.delete(id);
    addPolarFunction(id, func, scope, color);
}

function updatePolarFunctionScope(id: number, scope: number[]) {
    const item = canvasStore.polarFunctions.get(id);
    if(item) {
        item.scope = scope;
        drawPolarFunction(id);
        canvasStore.update();
    }
}

function removePolarFunction(id: number) {
    canvasStore.polarFunctions.delete(id);
    canvasStore.update();
}

function resolvePolarFunction(value: any) {
    const set = new Set(polarFunctionMap.keys());

    for(let i = 0; i != value.length; ++i) {
        const id = value[i].id;

        if(value[i].isValid) {
            if(!set.has(id)) {
                polarFunctionMap.set(id, value[i].result.value);
                functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);

                addPolarFunction(
                    id,
                    value[i].func,
                    value[i].scope,
                    value[i].color,
                );
            } else {
                if(polarFunctionMap.get(id) !== value[i].result.value) {
                    polarFunctionMap.set(id, value[i].result.value);
                    functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);

                    updatePolarFunction(
                        id,
                        value[i].func,
                        value[i].scope,
                        value[i].color,
                    );
                } else {
                    const scope = functionScopeMap.get(id);
                    if(scope) {
                        if(value[i].scope[0] !== scope[0] || value[i].scope[1] !== scope[1]) {
                            updatePolarFunctionScope(id, value[i].scope);
                            functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);
                        }
                    }
                }
                set.delete(id);
            }
        }
    }

    set.forEach((id: number) => {
        polarFunctionMap.delete(id);
        functionScopeMap.delete(id);

        removePolarFunction(id);
    });
}

watch(() => store.polarFunctionLists, (value: any) => {
    resolvePolarFunction(value);
}, {deep: true});

function updateCanvas() {
    store.updateAllFunctionFlag.polarFunction = true;
    if(store.updateAllFunctionFlag.commondFunction && store.updateAllFunctionFlag.polarFunction &&
       store.updateAllFunctionFlag.parameterFunction && store.updateAllFunctionFlag.implicitFunction)
    {
        canvasStore.update();
        store.updateAllFunctionFlag.commondFunction = false;
        store.updateAllFunctionFlag.polarFunction = false;
        store.updateAllFunctionFlag.parameterFunction = false;
        store.updateAllFunctionFlag.implicitFunction = false;
    }
}

watch(() => store.focus, (value: any, old: any) => {
    if(value !== -1) {
        drawPolarFunction(value);
    }
    if(old !== -1) {
        drawPolarFunction(old);
    }

    updateCanvas();
});

watch([() => props.dragFlag, () => props.zoomFlag], () => {
    canvasStore.polarFunctions.forEach((value: polarFunctionConfig, _: number) => {
        drawPolarFunction(value.id);
    });
    updateCanvas();
});

</script>

<style lang="scss" scoped>
</style>
