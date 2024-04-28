<template>
    <Button label="Show" @click="visible = true" />
    <Dialog v-model:visible="visible" modal header="编辑" :style="{ width: '25rem' }">
        <span class="p-text-secondary block mb-5">修改</span>
        <div class="flex align-items-center gap-3 mb-3">
            <label for="username" class="font-semibold w-6rem">颜色</label>
            <!-- <InputText id="username" class="flex-auto" autocomplete="off" /> -->
        </div>
        <div class="flex align-items-center gap-3 mb-5">
            <label for="email" class="font-semibold w-6rem">其他</label>
            <!-- <InputText id="email" class="flex-auto" autocomplete="off" /> -->
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="取消" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="确定" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useDigitCircuitStore } from "@/stores/digitCircuitStore.ts"

const visible = ref(false);

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
        return "none";
    }
    return `${store.annotation.x + 10}px`;
});

const right = computed(() => {
    if(store.annotation.x > props.width / 2) {
        return `${props.width - store.annotation.x + 10}px`;
    }
    return "none";
});

const top = computed(() => {
    if(store.annotation.y > props.width / 2) {
        return "none";
    }
    return `${store.annotation.y + 10}px`;
});

const bottom = computed(() => {
    if(store.annotation.y > props.width / 2) {
        return `${props.height - store.annotation.y + 10}px`;
    }
    return "none";
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


