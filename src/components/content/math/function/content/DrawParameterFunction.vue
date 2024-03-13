<template>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import { useFunctionCanvasStore, parameterFunctionConfig } from "@/stores/functionCanvasStore"

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

const parameterFunctionMap = new Map<number, string[]>;
const functionScopeMap = new Map<number, number[]>;

function drawParameterFunction(id: number) {
    const item = canvasStore.parameterFunctions.get(id);
    const interval = 0.01;
    if(item) {
        if(item.scope[0] < item.left) {
            const tempPoints = [];
            let i = 0;
            for(i = item.left; i >= item.scope[0] - interval; i -= interval) {
                const x = item.funcX(i);
                const y = item.funcY(i);
                tempPoints.push([x, y, i]);
            }
            item.points = [...(tempPoints.reverse()), ...item.points];
            item.left = i + interval;
        }
        if(item.scope[1] > item.right) {
            const tempPoints = [];
            let i = 0;
            for(i = item.right; i <= item.scope[1] + interval; i += interval) {
                const x = item.funcX(i);
                const y = item.funcY(i);
                tempPoints.push([x, y, i]);
            }
            item.points = [...item.points, ...tempPoints];
            item.right = i - interval;
        }

        const tempPoints: number[] = [];
        let x = 0;
        let y = 0;

        x = item.funcX(item.scope[0]);
        y = item.funcY(item.scope[0]);
        tempPoints.push(canvasStore.xScaleToPx(x), canvasStore.yScaleToPx(y));
        item.points.forEach((point: number[]) => {
            if(point[2] >= item.scope[0] && point[2] <= item.scope[1]) {
                tempPoints.push(canvasStore.xScaleToPx(point[0]), canvasStore.yScaleToPx(point[1]));
            }
        });
        x = item.funcX(item.scope[1]);
        y = item.funcY(item.scope[1]);
        tempPoints.push(canvasStore.xScaleToPx(x), canvasStore.yScaleToPx(y));

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

function addParameterFunction(id: number, funcX: Function, funcY: Function, scope: number[], color: string) {
    const tempNormalCanvas: HTMLCanvasElement = document.createElement("canvas");
    const tempNormalCtx: CanvasRenderingContext2D | null = tempNormalCanvas.getContext("2d");
    tempNormalCanvas.width = canvasStore.canvas.width;
    tempNormalCanvas.height = canvasStore.canvas.height;

    const config = {
        id,
        color,
        points: [] as number[][],
        funcX,
        funcY,
        canvas: tempNormalCanvas,
        ctx: tempNormalCtx,
        scope,
        left: 0,
        right: 0,
    } as parameterFunctionConfig;

    canvasStore.parameterFunctions.set(id, config);

    drawParameterFunction(id);
    canvasStore.update();
}

function removeParameterFunction(id: number) {
    canvasStore.parameterFunctions.delete(id);
    canvasStore.update();
}

function updateParameterFunction(id: number, funcX: Function, funcY: Function, scope: number[], color: string) {
    canvasStore.parameterFunctions.delete(id);
    addParameterFunction(id, funcX, funcY, scope, color);
}

function updateParameterFunctionScope(id: number, scope: number[]) {
    const item = canvasStore.parameterFunctions.get(id);
    if(item) {
        item.scope = scope;
        drawParameterFunction(id);
        canvasStore.update();
    }
}


function resolveParameterFunction(value: any) {
    const set = new Set(parameterFunctionMap.keys());

    for(let i = 0; i != value.length; ++i) {
        const id = value[i].id;

        if(value[i].isValid) {
            if(!set.has(id)) {
                parameterFunctionMap.set(id, [value[i].result.x.value, value[i].result.y.value]);
                functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);

                addParameterFunction(id, value[i].func.x, value[i].func.y, value[i].scope, value[i].color);
            } else {
                const parameterFunction = parameterFunctionMap.get(id);
                let isSame = true;
                if(parameterFunction) {
                    if(parameterFunction[0] !== value[i].result.x.value || parameterFunction[1] !== value[i].result.y.value) {
                        parameterFunctionMap.set(id, [value[i].result.x.value, value[i].result.y.value]);
                        functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);
                        updateParameterFunction(id, value[i].func.x, value[i].func.y, value[i].scope, value[i].color);
                        isSame = false;
                    }
                }
                if(isSame) {
                    const scope = functionScopeMap.get(id);
                    if(scope) {
                        if(value[i].scope[0] !== scope[0] || value[i].scope[1] !== scope[1]) {
                            updateParameterFunctionScope(id, value[i].scope);
                            functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);
                        }
                    }
                }
                set.delete(id);
            }
        }
    }

    set.forEach((id: number) => {
        parameterFunctionMap.delete(id);
        functionScopeMap.delete(id);

        removeParameterFunction(id);
    });
}

watch(() => store.parameterFunctionLists, (value: any) => {
    resolveParameterFunction(value);
}, {deep: true});

function updateCanvas() {
    store.updateAllFunctionFlag.parameterFunction = true;
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
        drawParameterFunction(value);
    }
    if(old !== -1) {
        drawParameterFunction(old);
    }

    updateCanvas();
});

watch([() => props.dragFlag, () => props.zoomFlag], () => {
    canvasStore.parameterFunctions.forEach((value: parameterFunctionConfig, _: number) => {
        drawParameterFunction(value.id);
    });
    updateCanvas();
});

</script>

<style lang="scss" scoped>
</style>
