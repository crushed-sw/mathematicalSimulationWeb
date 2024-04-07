<template>
    <div ref="contentContainer" class="h-full w-full relative">
        <Content
            v-if="true"
            :width="width"
            :height="height"
        ></Content>

        <DrawShapes
            v-if="false"
            :width="width"
            :height="height"
        ></DrawShapes>

        <!-- <Ptwo -->
        <!--     v-if="false" -->
        <!--     :width="width" -->
        <!--     :height="height" -->
        <!-- ></Ptwo> -->
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Content from "./content/Content.vue"
import DrawShapes from "./content/DrawShapes.vue"
import Ptwo from "./content/Ptwo.vue"

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

