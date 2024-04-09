<template>
    <div ref="contentContainer" class="h-full w-full flex">
        <Content
            :width="width / 2"
            :height="height"
        ></Content>
        <ViewContent
            :width="width / 2"
            :height="height"
        ></ViewContent>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Content from "./content/Content.vue"
import ViewContent from "./content/ViewContent.vue"

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

