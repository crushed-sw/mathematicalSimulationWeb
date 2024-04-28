<template>
    <div class="w-full h-full flex flex-column" ref="contentContainer">
        <UserInform v-if="visible" class="h-10rem"></UserInform>
        <Content class="flex-1" :width="width" :height="height"></Content>
    </div>
</template>

<script lang="ts" setup>
import UserInform from './user/UserInform.vue';
import Content from './user/Content.vue';
import { computed, ref, onMounted, watch } from "vue"
import { useGlobalStore } from "@/stores/globalStore"
import { useRouter } from "vue-router"

const router = useRouter();
const store = useGlobalStore();

const visible = computed(() => {
    return store.user.index != 2;
});

let height = ref(0);
let width = ref(0);

function handleResize(entries: any) {
    for (const entry of entries) {
        width.value = entry.contentRect.width;
        height.value = entry.contentRect.height;
    }
}

const contentContainer = ref();
onMounted(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(contentContainer.value);

    if(!store.config.login) {
        router.push("/forum/forum");
    }
});

watch(() => store.config.login, () => {
    if(!store.config.login) {
        router.push("/forum/forum");
    }
});
</script>

<style lang="scss" scoped>
</style>
