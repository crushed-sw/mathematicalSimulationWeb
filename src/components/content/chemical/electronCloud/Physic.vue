<template>
    <div :style="{width: `${width}px`, height: `${height}px`}">
        <!-- physic -->
    </div>
</template>

<script lang="ts" setup>

defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});
</script>

<style lang="scss" scoped>

</style>
