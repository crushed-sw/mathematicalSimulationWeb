<template>
    <div class="w-screen h-screen flex flex-column">
        <Toast position="top-center" />
        <HeaderElem class="h-3rem"></HeaderElem>
        <Content class="flex-1"></Content>
    </div>
</template>

<script lang="ts" setup>
import HeaderElem from "./components/Header.vue"
import Content from "./components/Content.vue"
import Toast from 'primevue/toast';
</script>
