<template>
    <div
        v-if="store.annotation.visible && !store.global.drag"
        class="absolute w-auto h-auto state-div p-2 border-round-lg shadow-3"
        :style="{
            'background-color': 'rgba(73, 80, 87, 1)',
            'left': left,
            'right': right,
            'top': top,
            'bottom': bottom,
        }"
        v-html="store.annotation.value"
    ></div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useDigitCircuitStore } from "@/stores/digitCircuitStore.ts"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    }
});
const store = useDigitCircuitStore();

const left = computed(() => {
    if(store.annotation.x > props.width / 2) {
        return "auto";
    }
    return `${store.annotation.x + 10}px`;
});

const right = computed(() => {
    if(store.annotation.x > props.width / 2) {
        return `${props.width - store.annotation.x + 10}px`;
    }
    return "auto";
});

const top = computed(() => {
    if(store.annotation.y > props.height / 2) {
        return "auto";
    }
    return `${store.annotation.y + 10}px`;
});

const bottom = computed(() => {
    if(store.annotation.y > props.height / 2) {
        return `${props.height - store.annotation.y + 10}px`;
    }
    return "auto";
});
</script>

<style lang="scss" scoped>
.state-div {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    font-size: 16px;
    font-family: "Courier New", Times, serif;
    z-index: 100;
    color: #ffffff;
}
</style>
