<template>
    <div class="h-full w-full flex justify-content-between">
        <Button
            text
            size="small"
            v-tooltip.right="'隐藏选项列表'"
            class="m-1 hover:bg-green-100 text-xl"
            @click="hiddenHandle"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'angles-right']" />
            </template>
        </Button>

        <Button
            text
            size="small"
            v-tooltip.left="'保存为图片'"
            class="m-1 hover:bg-green-100 text-xl"
            @click="savePicture"
        >
            <template #icon>
                <font-awesome-icon :icon="['far', 'image']" />
            </template>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';

import { useFunctionStore } from "@/stores/functionStore"
import { useFunctionCanvasStore } from "@/stores/functionCanvasStore"
import html2canvas from "html2canvas"

const functionStore = useFunctionStore();
const canvasStore = useFunctionCanvasStore();

function hiddenHandle() {
    functionStore.rightSideShow = false;
}

function savePicture() {
    const link = document.createElement("a");
    const div = canvasStore.canvas.parentElement;

    if(div) {
        html2canvas(div, { scale: 4 }).then(function(canvas) {
            link.href = canvas.toDataURL();
            link.download = 'function_image.png';
            link.click();
        });
    }
}
</script>
