<template>
    <div>
        <div class="px-5 h-full relative">
            <Avatar @click="menuToggle" size="normal" shape="circle">
                <template #icon>
                    <font-awesome-icon :icon="['far', 'user']" />
                </template>
            </Avatar>
            <Menu :model="items" v-if="isHidden" class="absolute right-0 mr-5 mt-2"></Menu>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';

import { ref } from "vue";

let isHidden = ref(false);

function menuToggle() {
    isHidden.value = !isHidden.value;
}

const items = ref([
    { label: 'New', icon: 'pi pi-plus' },
    { label: 'Search', icon: 'pi pi-search' },
    {label: 'Home', icon: 'pi pi-home',},
]);
</script>

<style lang="scss" scoped>
</style>
