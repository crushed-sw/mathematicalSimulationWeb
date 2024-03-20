<template>
    <div class="h-full w-full flex flex-column">
        <RightSideBarHeader class="h-3rem"></RightSideBarHeader>
        <RightSideBarContent class="flex-1"></RightSideBarContent>
    </div>
</template>

<script lang="ts" setup>
import RightSideBarHeader from "./rightSideBar/RightSideBarHeader.vue"
import RightSideBarContent from "./rightSideBar/RightSideBarContent.vue"
</script>

<style lang="scss" scoped>
</style>
