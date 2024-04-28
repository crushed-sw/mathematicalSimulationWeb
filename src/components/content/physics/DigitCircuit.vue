<template>
    <div class="h-full w-full flex">
        <LeftSideBar class="w-10rem left-min h-full border-right-1 border-400"></LeftSideBar>
        <Content class="flex-1"></Content>
    </div>
</template>

<script lang="ts" setup>
import Content from "./digitCircuit/Content.vue"
import LeftSideBar from "./digitCircuit/LeftSideBar.vue"
</script>

<style lang="scss" scoped>
.left-min {
    min-width: 5rem;
}
</style>
