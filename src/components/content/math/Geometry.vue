<template>
    <div class="h-full w-full">
        <Splitter class="h-full w-full">
            <SplitterPanel :size="10" :minSize="5">
                <!-- <LeftSideBar></LeftSideBar> -->
            </SplitterPanel>
            <SplitterPanel :size="90" :minSize="25">
                <Content></Content>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<script lang="ts" setup>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import Content from "./geometry/Content.vue"
</script>
