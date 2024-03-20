<template>
    <div class="h-full w-full flex justify-content-between">
        <Button
            text
            v-tooltip.right="'隐藏列表'"
            size="small"
            class="m-1 hover:bg-green-100 text-base"
            @click="hiddenHandle"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'angles-right']" />
            </template>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button"
import { useGeometryStore } from "@/stores/geometryStore"

const store = useGeometryStore();

function hiddenHandle() {
    store.global.isRight = false;
}
</script>

<style lang="scss" scoped>
</style>
