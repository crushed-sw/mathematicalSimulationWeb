<template>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import { useFunctionCanvasStore, customPointConfig } from "@/stores/functionCanvasStore"

const store = useFunctionStore();
const canvasStore = useFunctionCanvasStore();

const customPointMap = new Map<number, number[]>;


function addPoint(id: number, x: number, y: number, color: string) {
    if(!canvasStore.customPoints.has(id)) {
        canvasStore.customPoints.set(id, []);
    }

    canvasStore.customPoints.get(id)?.push({x, y, color} as customPointConfig);
    canvasStore.update();
}

function removePoints(id: number) {
    canvasStore.customPoints.delete(id);
    canvasStore.update();
}

function resolveCustomPoint(value: any) {
    const set = new Set(customPointMap.keys());

    for(let i = 0; i != value.length; ++i) {
        const id = value[i].id;

        if(value[i].isValid) {
            if(!set.has(id)) {
                customPointMap.set(id, [value[i].result.x, value[i].result.y]);
                addPoint(id, value[i].result.x, value[i].result.y, value[i].color);
            } else {
                const customPoint = customPointMap.get(id);
                if(customPoint) {
                    if(customPoint[0] !== value[i].result.x || customPoint[1] !== value[i].result.y) {
                        customPointMap.set(id, [value[i].result.x, value[i].result.y]);
                        removePoints(id);
                        addPoint(id, value[i].result.x, value[i].result.y, value[i].color);
                    }
                }
                set.delete(id);
            }
        }
    }

    set.forEach((id: number) => {
        customPointMap.delete(id);
        removePoints(id);
    });
}

watch(() => store.customPointLists, (value: any) => {
    resolveCustomPoint(value);
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>
