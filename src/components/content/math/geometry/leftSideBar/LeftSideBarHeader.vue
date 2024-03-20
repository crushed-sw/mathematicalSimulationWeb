<template>
    <div class="h-full w-full flex justify-content-between">
        <Button
            text
            v-tooltip.right="'添加条目'"
            size="small"
            class="m-1 hover:bg-green-100 text-base"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'plus']" />
            </template>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button"
import { useGeometryStore } from "@/stores/geometryStore"

const store = useGeometryStore();
</script>

<style lang="scss" scoped>
</style>
