<template>
    <i
        v-if="isVisible"
        class="annotation absolute bg-white p-2 border-round-sm shadow-5"
        :style="{
            top: top,
            bottom: bottom,
            left: left,
            right: right,
        }"
    >
        <span class="katex">
            <span class="katex-html" aria-hidden="true">
                <span class="base">
                    <span class="strut" style="height:1em;vertical-align:-0.25em;"></span>
                    <span class="mopen">(</span>
                    <span class="mord">{{xValue}}</span>
                    <span class="mpunct">,</span>
                    <span class="mspace" style="margin-right:0.1667em;"></span>
                    <span class="mord">{{yValue}}</span>
                    <span class="mclose">)</span>
                </span>
            </span>
        </span>
    </i>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useFunctionStore } from "@/stores/functionStore"

const store = useFunctionStore();

const left = computed(() => {
    if(xPx.value > store.canvasConfig.width / 2) {
        return "auto";
    } else {
        return `${xPx.value + 10}px`;
    }
});

const right = computed(() => {
    if(xPx.value > store.canvasConfig.width / 2) {
        return `${store.canvasConfig.width - xPx.value + 10}px`
    } else {
        return "auto";
    }
});

const top = computed(() => {
    if(yPx.value > store.canvasConfig.height / 2) {
        return "auto";
    } else {
        return `${yPx.value + 10}px`
    }
});

const bottom = computed(() => {
    if(yPx.value > store.canvasConfig.height / 2) {
        return `${store.canvasConfig.height - yPx.value + 10}px`
    } else {
        return "auto";
    }
});

const xPx = computed(() => {
    return store.annotation.xPx;
});

const yPx = computed(() => {
    return store.annotation.yPx;
});

const xValue = computed(() => {
    return Number(store.annotation.xScale.toFixed(4));
});

const yValue = computed(() => {
    return Number(store.annotation.yScale.toFixed(4));
});

const isVisible = computed(() => {
    return store.annotation.isVisible;
});
</script>

<style lang="scss" scoped>
.annotation {
    z-index: 101;
    width: auto;
    height: auto;
}
</style>
