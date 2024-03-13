<template>
    <div ref="contentContainer" class="h-full w-full relative">
        <Content :height="height" :width="width" class="h-full w-full absolute"></Content>

        <Button
            text
            size="small"
            v-tooltip.right="'显示表达式列表'"
            class="m-1 hover:bg-green-100 text-xl absolute left-0 top-0"
            v-show="!functionStore.leftSideShow"
            @click="leftHiddenHandle"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'angles-right']" />
            </template>
        </Button>

        <Button
            text
            size="small"
            v-tooltip.left="'显示选项列表'"
            class="m-1 hover:bg-green-100 text-xl absolute right-0 top-0"
            v-show="!functionStore.rightSideShow"
            @click="rightHiddenHandle"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'wrench']" />
            </template>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';
import Content from './content/Content.vue';
import { useFunctionStore } from "@/stores/functionStore"
import { ref, onMounted } from "vue"

const functionStore = useFunctionStore();

function leftHiddenHandle() {
    functionStore.leftSideShow = true;
}

function rightHiddenHandle() {
    functionStore.rightSideShow = true;
}

let height = ref(0);
let width = ref(0);
function handleResize(entries: any) {
    for (const entry of entries) {
        width.value = entry.contentRect.width;
        height.value = entry.contentRect.height;
    }
}

const contentContainer = ref();

onMounted(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(contentContainer.value);
});
</script>
