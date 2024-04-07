<template>
    <div ref="contentContainer" class="h-full w-full relative">
        <Content
            :width=width
            :height=height
        ></Content>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Content from "./content/Content.vue"

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
