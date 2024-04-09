<template>
    <div class="h-full w-full">
        <v-stage
            :width="width"
            :height="height"
        >
            <v-layer>

            </v-layer>
        </v-stage>
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
    }
});
</script>

<style lang="scss" scoped>
</style>
