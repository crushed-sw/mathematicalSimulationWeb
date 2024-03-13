<template>
    <div class="h-full w-full">
        <Splitter class="h-full w-full">
            <SplitterPanel :size="25" :minSize="15" v-show="functionStore.leftSideShow">
                <LeftSideBar></LeftSideBar>
            </SplitterPanel>
            <SplitterPanel :size="contentSize" :minSize="25">
                <Content></Content>
            </SplitterPanel>
            <SplitterPanel :size="20" :minSize="10" v-show="functionStore.rightSideShow">
                <RightSideBar></RightSideBar>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<script lang="ts" setup>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import LeftSideBar from "./function/LeftSideBar.vue"
import Content from "./function/Content.vue"
import RightSideBar from "./function/RightSideBar.vue"

import { useFunctionStore } from "@/stores/functionStore"
import { computed } from "vue"

const functionStore = useFunctionStore();

const contentSize = computed(() => {
    return 100 - (functionStore.leftSideShow ? 25 : 0) - (functionStore.rightSideShow ? 20 : 0);
});
</script>
