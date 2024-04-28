<template>
    <v-circle
        :="pointConfig"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
    ></v-circle>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

const props = defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    ishover: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    }
});

const hover = ref(false);

const pointConfig = computed(() => {
    if(hover.value || props.ishover) {
        return {
            x: props.x,
            y: props.y,
            visible: props.visible,
            radius: 4,
            fill: 'rgba(134, 142, 150, 1)',
            stroke: 'rgba(67, 76, 94, 1)',
            strokeWidth: 2,
            hitStrokeWidth: 7,
        }
    } else {
        return {
            x: props.x,
            y: props.y,
            visible: props.visible,
            radius: 3,
            fill: 'rgba(67, 76, 94, 1)',
            stroke: 'rgba(67, 76, 94, 1)',
            strokeWidth: 0,
            hitStrokeWidth: 7,
        }
    }
});

function mouseenter() {
    hover.value = true;
}

function mouseleave() {
    hover.value = false;
}
</script>

<style lang="scss" scoped>
</style>
