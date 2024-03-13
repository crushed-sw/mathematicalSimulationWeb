<template>
    <div>
        {{compile("theta*2").evaluate({theta: 3})}}
    </div>
</template>

<script lang="ts" setup>
import { compile } from "mathjs"
</script>

<style lang="scss" scoped>

</style>
