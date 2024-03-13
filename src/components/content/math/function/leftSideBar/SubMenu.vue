<template>
    <div
        v-if="isSubMenuVisible"
        class="absolute"
        :style = "{
            top: `${subMenuPosition[0]}px`,
            left: `${subMenuPosition[1] + 10}px`,
            'z-index': 100,
        }"
    >
        <Menu :model="subMenuItem" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import Menu from 'primevue/menu';

const props = defineProps({
    subMenuPosition: {
        type: Array<number>,
        required: true,
    },
    subMenuIndex: {
        type: Number,
        required: true,
    },
    subMenuVisible: {
        type: Boolean,
        required: true,
    },
});

const functionStore = useFunctionStore();

const isSubMenuVisible = ref(false);
const subMenuIndex = computed(() => {
    return props.subMenuIndex;
});

const item = computed(() => {
    return functionStore.functionLists.items[subMenuIndex.value];
});

const subMenuItem = ref([
    {
        label: '添加点',
        icon: 'pi pi-plus',
        command: () => {
            if(subMenuIndex.value != -1) {
                item.value.points.push({
                    unknowns: [],
                    beginX: "0",
                    x: 0,
                    y: 0,
                    isClick: true,
                });
            }
            isSubMenuVisible.value = false;
        }
    },
    {
        label: '添加切线',
        icon: 'pi pi-plus',
        command: () => {
            if(subMenuIndex.value != -1) {
                item.value.tangentLine.push({
                    unknowns: [],
                    beginX: "0",
                    x: 0,
                    y: 0,
                    slope: "",
                    yValue: "0",
                    k: 0,
                    b: 0,
                    isClick: true,
                });
            }
            isSubMenuVisible.value = false;
        }
    },
    {
        label: '添加范围',
        icon: 'pi pi-plus',
        command: () => {
            if(subMenuIndex.value != -1 && !item.value.range.isActive) {
                item.value.range = {
                    isActive: true,
                    left: "-\\infty",
                    right: "\\infty",
                    leftValue: -Infinity,
                    rightValue: Infinity,
                    beginLeft: "",
                    beginRight: "",
                    leftUnknows: [],
                    rightUnknows: [],
                    isClick: false,
                };
            }
            isSubMenuVisible.value = false;
        }
    }
]);

watch(() => props.subMenuVisible, () => {
    isSubMenuVisible.value = props.subMenuVisible;
});
</script>

<style lang="scss" scoped>

</style>
