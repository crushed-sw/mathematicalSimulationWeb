<template>
    <div class="h-full w-full flex justify-content-between">
        <Button
            text
            v-tooltip.right="'添加条目'"
            size="small"
            class="m-1 hover:bg-green-100 text-2xl"
        >
            <template #icon>
                <font-awesome-icon :icon="['fas', 'plus']" />
            </template>
        </Button>
        <div class="h-full flex">
            <Button
                text
                size="small"
                v-tooltip.left="'编辑列表'"
                class="m-1 hover:bg-green-100 text-xl"
            >
                <template #icon>
                    <font-awesome-icon :icon="['fas', 'gear']" />
                </template>
            </Button>
            <Button
                text
                size="small"
                v-tooltip.left="'隐藏列表'"
                class="m-1 hover:bg-green-100 text-xl"
                @click="hiddenHandle"
            >
                <template #icon>
                    <font-awesome-icon :icon="['fas', 'angles-left']" />
                </template>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';

import { useFunctionStore } from "@/stores/functionStore"

const functionStore = useFunctionStore();

function hiddenHandle() {
    functionStore.leftSideShow = false;
}
</script>
