<template>
    <div class="h-full w-full flex justify-content-center align-items-center">
        <div class="flex flex-column">
            <div class="flex">
                <div class="m-2 p-0" :style="drawStyle">
                    <DrawBoard :width="innerLen" :height="innerLen" :attr="'font'"></DrawBoard>
                </div>
                <div class="m-2 p-0" :style="drawStyle">
                    <DrawBoard :width="innerLen" :height="innerLen" :attr="'left'"></DrawBoard>
                </div>
            </div>
            <div class="flex">
                <div class="m-2 p-0" :style="drawStyle">
                    <DrawBoard :width="innerLen" :height="innerLen" :attr="'top'"></DrawBoard>
                </div>
                <div class="m-2 p-0">
                    <ShowThree :width="innerLen" :height="innerLen"></ShowThree>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"
import DrawBoard from "./DrawBoard.vue"
import ShowThree from "./ShowThree.vue"

import { useThreeViewStore, DrawBoardState } from "@/stores/threeViewStore.ts"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});

const store = useThreeViewStore();

const drawStyle = computed(() => {
    return {
        width: innerLen.value + 'px',
        height: innerLen.value + 'px'
    }
});

const showStyle = computed(() => {
    return {
        width: innerLen.value + 'px',
        height: innerLen.value + 'px'
    }
});

const innerLen = computed(() => {
    const minLen = Math.min(props.width, props.height);
    return minLen / 2 - 22;
});
</script>

<style lang="scss" scoped>
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
}
</style>
