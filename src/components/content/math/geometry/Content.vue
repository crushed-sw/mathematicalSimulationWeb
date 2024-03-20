<template>
    <div ref="contentContainer" class="h-full w-full relative">
        <Content
            :width=width
            :height=height
        ></Content>

        <Button
            text
            size="small"
            v-tooltip.left="'显示选项列表'"
            class="m-1 hover:bg-green-100 text-base absolute right-0 top-0"
            v-show="!store.global.isRight"
            @click="rightHiddenHandle"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'wrench']" />
            </template>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useGeometryStore } from "@/stores/geometryStore"
import Button from 'primevue/button';
import Content from "./content/Content.vue"

const store = useGeometryStore();

function rightHiddenHandle() {
    store.global.isRight = true;
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

<style lang="scss" scoped>

</style>
