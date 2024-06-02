<template>
    <div ref="contentContainer" class="h-full w-full flex">
        <div class="flex flex-column">
            <Physic
                :width="width / 2"
                :height="height / 4"
            ></Physic>
            <Surface
                :width="width / 2"
                :height="(height / 4) * 3"
            ></Surface>
        </div>
        <div class="flex flex-column">
            <Select
                :width="width / 2"
                :height="height / 4"
            ></Select>
            <Points
                :width="width / 2"
                :height="(height / 4) * 3"
            ></Points>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Select from "./Select.vue"
import Surface from "./Surface.vue"
import Points from "./Points.vue"
import Physic from "./Physic.vue"

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

