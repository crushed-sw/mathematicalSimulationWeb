<template>
    <div class="flex align-items-center justify-content-between">
        <NestedMenu class="border-none bg-white"></NestedMenu>
        <CrushedLogo></CrushedLogo>
        <AvatarElem></AvatarElem>
    </div>
</template>

<script lang="ts" setup>
import NestedMenu from "./header/NestedMenu.vue"
import CrushedLogo from "./header/CrushedLogo.vue"
import AvatarElem from "./header/Avatar.vue"
</script>
