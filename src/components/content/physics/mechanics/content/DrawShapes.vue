<template>
    <div>
        <v-stage
            :config="stageConfig"
            @click="click"
        >
            <v-layer ref="layer">
                <v-circle
                    :x="500"
                    :y="500"
                    :radius="200"
                    :strokeWidth="2"
                    :stroke="'#000000'"
                    :visible="true"
                ></v-circle>
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    }
});

function click() {
    console.log("click");
}

let stageConfig = reactive({
    width: 0,
    height: 0,
});

watch(() => props, () => {
    stageConfig.width = props.width;
    stageConfig.height = props.height;
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>
