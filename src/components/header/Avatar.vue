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

import { ref, reactive } from "vue";

let isHidden = ref(false);

function menuToggle() {
    isHidden.value = !isHidden.value;
}

const items = reactive([
    { label: '登陆', icon: 'pi pi-sign-in' },
    { label: '个人信息', icon: 'pi pi-align-justify' },
    { label: '登出', icon: 'pi pi-sign-out' },
]);
</script>

<style lang="scss" scoped>
</style>
