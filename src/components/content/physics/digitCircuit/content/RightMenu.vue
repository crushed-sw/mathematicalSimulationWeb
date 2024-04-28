<template>
    <div
        v-if="store.menu.visible"
        class="absolute w-auto h-auto item-div"
        :style="{
            'left': left,
            'right': right,
            'top': top,
            'bottom': bottom,
        }"
    >
        <Menu
            class="font-value"
            :model="items"
        />
    </div>
</template>

<script lang="ts" setup>
import { useDigitCircuitStore } from "@/stores/digitCircuitStore"
import Menu from 'primevue/menu';
import { ref, computed } from "vue"

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

const store = useDigitCircuitStore();

const left = computed(() => {
    if(store.menu.x > props.width / 2) {
        return "auto";
    }
    return `${store.menu.x + 10}px`;
});

const right = computed(() => {
    if(store.menu.x > props.width / 2) {
        return `${props.width - store.menu.x + 10}px`;
    }
    return "auto";
});

const top = computed(() => {
    if(store.menu.y > props.height / 2) {
        return "auto";
    }
    return `${store.menu.y + 10}px`;
});

const bottom = computed(() => {
    if(store.menu.y > props.height / 2) {
        return `${props.height - store.menu.y + 10}px`;
    }
    return "auto";
});

function helper(f: Function) {
    const arr = store.getArrayById(store.menu.id);
    if(arr !== undefined) {
        for(let i = 0; i !== arr.length; ++i) {
            if(arr[i].id === store.menu.id) {
                f(arr[i]);
                break;
            }
        }
    }
    store.menu.visible = false;
}

const items = ref([
    {
        label: '向右旋转90度',
        icon: 'pi pi-refresh',
        command: () => {
            helper((value: any) => {
                value.rotate = (value.rotate + 90) % 360;
                if(value.x / 20) {
                    if(value.rotate < 180) value.x += 10;
                    else value.x -= 10;
                }
                if(value.y / 20) {
                    if(value.rotate < 180) value.y += 10;
                    else value.y -= 10;
                }
            });
        }
    },
    {
        label: '向左旋转90度',
        icon: 'pi pi-undo',
        command: () => {
            helper((value: any) => {
                value.rotate = (value.rotate + 270) % 360;
                value.rotate = (value.rotate + 90) % 360;
                if(value.x / 20) {
                    if(value.rotate < 180) value.x += 10;
                    else value.x -= 10;
                }
                if(value.y / 20) {
                    if(value.rotate < 180) value.y += 10;
                    else value.y -= 10;
                }
            });
        }
    },
    {
        label: '垂直镜像',
        icon: 'pi pi-sort-alt',
        command: () => {
            helper((value: any) => {
                if(value.rotate % 180 === 0) {
                    value.scaleY = -value.scaleY;
                } else {
                    value.scaleX = -value.scaleX;
                }
            });
        }
    },
    {
        label: '水平镜像',
        icon: 'pi pi-arrow-right-arrow-left',
        command: () => {
            helper((value: any) => {
                if(value.rotate % 180 === 0) {
                    value.scaleX = -value.scaleX;
                } else {
                    value.scaleY = -value.scaleY;
                }
            });
        }
    }
]);
</script>

<style lang="scss" scoped>
.item-div {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 100;

    .font-value {
        font-size: 16px;
    }
}
</style>
