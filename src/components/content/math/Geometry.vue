<template>
    <div class="h-full w-full flex">
        <LeftSideBar class="h-full w-10rem"></LeftSideBar>
        <Splitter class="flex-1 border-none">
            <SplitterPanel :size="contentSize" :minSize="25">
                <Content></Content>
            </SplitterPanel>
            <SplitterPanel :size="15" :minSize="15" v-show="store.global.isRight">
                <RightSideBar></RightSideBar>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useGeometryStore } from "@/stores/geometryStore"

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import Content from "./geometry/Content.vue"
import LeftSideBar from "./geometry/LeftSideBar.vue"
import RightSideBar from "./geometry/RightSideBar.vue"

const store = useGeometryStore();
const contentSize = computed(() => {
    return 100 - (store.global.isRight ? 15 : 0);
});

</script>
