<template>
    <v-line
        v-for="point in reduceSameCol(listCol)"
        :points="[point, 0, point, height]"
        :stroke="'rgba(0, 0, 255, 0.2)'"
        :strokeWidth="1"
        :hitStrokeWidth="7"
        @mouseenter="enter($event, point, true)"
        @mousemove="move($event, point, true)"
        @mouseout="out"
    ></v-line>
    <v-line
        v-for="point in reduceSameRow(listRow)"
        :points="[0, point, width, point]"
        :stroke="'rgba(0, 0, 255, 0.2)'"
        :strokeWidth="1"
        :hitStrokeWidth="7"
        @mouseenter="enter($event, point, false)"
        @mousemove="move($event, point, false)"
        @mouseout="out"
    ></v-line>

    <v-circle
        v-for="point in points"
        :x="point.x"
        :y="point.y"
        :radius="2"
        :fill="'rgba(0, 0, 255, 0.4)'"
        :hitStrokeWidth="7"
        @mouseenter="pointEnter($event, point.x, point.y)"
        @mouseout="out"
    ></v-circle>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useThreeViewStore, State, pointConfig } from "@/stores/threeViewStore.ts"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    attr: {
        type: String,
        required: true,
    },
});

const store = useThreeViewStore();

const listCol = computed(() => {
    if(props.attr === "font") {
        return store.topAllPointList;
    } else if(props.attr === "top") {
        return store.fontAllPointList;
    } else if(props.attr === "left") {
        const arr: pointConfig[] = [];
        store.topAllPointList.forEach((point: any) => {
            arr.push({x: point.y, y: point.x} as pointConfig);
        });
        return arr;
    }
    return [] as pointConfig[];
});

const listRow = computed(() => {
    if(props.attr === "font") {
        return store.leftAllPointList;
    } else if(props.attr === "top") {
        const arr: pointConfig[] = [];
        store.leftAllPointList.forEach((point: any) => {
            arr.push({x: point.y, y: point.x} as pointConfig);
        });
        return arr;
    } else if(props.attr === "left") {
        return store.fontAllPointList;
    }
    return [] as pointConfig[];
});

function reduceSameCol(arr: pointConfig[]): number[] {
    const result: number[] = [];
    arr.forEach((point: pointConfig) => {
        const index = result.findIndex((num: number) => Math.abs(num - point.x) < 3 )
        if(index === -1) {
            result.push(point.x);
        }
    });
    return result;
}

function reduceSameRow(arr: pointConfig[]): number[] {
    const result: number[] = [];
    arr.forEach((point: pointConfig) => {
        const index = result.findIndex((num: number) => Math.abs(num - point.y) < 3 )
        if(index === -1) {
            result.push(point.y);
        }
    });
    return result;
}

const points = computed(() => {
    const arr: {x: number, y: number}[] = [];
    listCol.value?.forEach((pointCol: pointConfig) => {
        listRow.value?.forEach((pointRow: pointConfig) => {
            const index = arr.findIndex((value: {x: number, y: number}) => {
                return Math.abs(pointCol.x - value.x) < 3 && Math.abs(pointRow.y - value.y) < 3;
            });
            if(index === -1) {
                arr.push({x: pointCol.x, y: pointRow.y});
            }
        });
    });
    return arr;
});

function enter(event: any, value: number, isCol: boolean) {
    let global = undefined;
    if(props.attr === "font") {
        global = store.fontGlobal;
    } else if(props.attr === "left") {
        global = store.leftGlobal;
    } else if(props.attr === "top") {
        global = store.topGlobal;
    }

    if(global && global.drawing) {
        global.hover = -1;
        global.hoverState = State.Line;
        if(isCol) {
            global.x = value;
            global.y = event.evt.layerY;
        } else {
            global.x = event.evt.layerX;
            global.y = value;
        }
    }
}

function move(event: any, value: number, isCol: boolean) {
    let global = undefined;
    if(props.attr === "font") {
        global = store.fontGlobal;
    } else if(props.attr === "left") {
        global = store.leftGlobal;
    } else if(props.attr === "top") {
        global = store.topGlobal;
    }

    if(global && global.drawing) {
        global.hover = -1;
        global.hoverState = State.Line;
        if(isCol) {
            global.x = value;
            global.y = event.evt.layerY;
        } else {
            global.x = event.evt.layerX;
            global.y = value;
        }
    }
}

function out() {
    let global = undefined;
    if(props.attr === "font") {
        global = store.fontGlobal;
    } else if(props.attr === "left") {
        global = store.leftGlobal;
    } else if(props.attr === "top") {
        global = store.topGlobal;
    }

    if(global) {
        global.hover = 0;
        global.hoverState = State.None;
    }
}

function pointEnter(event: any, x: number, y: number) {
    let global = undefined;
    if(props.attr === "font") {
        global = store.fontGlobal;
    } else if(props.attr === "left") {
        global = store.leftGlobal;
    } else if(props.attr === "top") {
        global = store.topGlobal;
    }

    if(global) {
        global.hoverState = State.Point;
        global.hover = -1;
        global.x = x;
        global.y = y;
    }
}
</script>

<style lang="scss" scoped>
</style>
