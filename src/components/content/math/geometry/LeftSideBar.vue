<template>
    <div class="h-full w-full flex flex-column border-right-2 border-200">
        <LeftSideBarHeader class="h-3rem"></LeftSideBarHeader>
        <LeftSideBarContent class="flex-1"></LeftSideBarContent>
    </div>
</template>

<script lang="ts" setup>
import LeftSideBarHeader from "./leftSideBar/LeftSideBarHeader.vue"
import LeftSideBarContent from "./leftSideBar/LeftSideBarContent.vue"
</script>

<style lang="scss" scoped>
</style>
