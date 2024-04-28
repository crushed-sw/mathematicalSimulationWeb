<template>
    <v-group>
        <v-path
            :data="rowLines"
            :stroke="'rgba(0, 0, 0, 0.1)'"
            :strokeWidth="1"
        ></v-path>
        <v-path
            :data="colLines"
            :stroke="'rgba(0, 0, 0, 0.1)'"
            :strokeWidth="1"
        ></v-path>
    </v-group>
</template>

<script lang="ts" setup>
import { computed } from "vue"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});

const rowLines = computed(() => {
    let resultStr = "";
    for(let i = 0; i < props.height; i += 20) {
        resultStr += `M0,${i} L${props.width},${i} `;
    }
    return resultStr;
});

const colLines = computed(() => {
    let resultStr = "";
    for(let i = 0; i < props.width; i += 20) {
        resultStr += `M${i},0 L${i},${props.height} `;
    }
    return resultStr;
});
</script>

<style lang="scss" scoped>
</style>
