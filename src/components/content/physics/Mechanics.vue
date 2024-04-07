<template>
    <div class="h-full w-full flex">
        <Splitter class="flex-1 border-none">
            <SplitterPanel :size="contentSize" :minSize="25">
                <Content></Content>
            </SplitterPanel>
            <!-- <SplitterPanel :size="15" :minSize="15" v-show="store.global.isRight"> -->
            <!--     <RightSideBar></RightSideBar> -->
            <!-- </SplitterPanel> -->
        </Splitter>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import Content from "./mechanics/Content.vue"

const contentSize = computed(() => {
    return 100;
});

</script>
