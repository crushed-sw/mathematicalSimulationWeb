<template>
    <div
        v-if="true"
        class="absolute w-auto h-auto bottom-0 right-0 state-div p-2"
    >
        {{props.stateValue}}
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    stateValue: {
        type: String,
        required: true,
    }
});
</script>

<style lang="scss" scoped>
.state-div {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    font-size: 15px;
    font-family: "Times New Roman", Times, serif;
    z-index: 100;
    background-color: "rgba(255, 0, 0, 1)";
}
</style>
