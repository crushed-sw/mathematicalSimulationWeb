<template>
    <v-group
        @mouseenter="mouseEnter"
        @mouseout="mouseOut"
        @click="click"
        :index="index"
    >
        <v-circle
            :x="x"
            :y="y"
            :visible="mask"
            :radius="4"
            :stroke="'rgba(255, 0, 0, 1)'"
            :strokeWidth="2"
        ></v-circle>
        <v-circle
            :x="x"
            :y="y"
            :visible="visible"
            :radius="3"
            :stroke="'rgba(0, 0, 0, 1)'"
            :strokeWidth="1"
            :fill="'rgba(255, 0, 0, 1)'"
            :hitStrokeWidth="5"
        ></v-circle>
    </v-group>
</template>

<script lang="ts" setup>
import { useThreeViewStore, State } from "@/stores/threeViewStore.ts"

const props = defineProps({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    visible: {
        type: Boolean,
        required: true,
    },
    mask: {
        type: Boolean,
        default: false,
    },
    index: {
        type: Number,
        default: 0,
    },
    attr: {
        type: String,
        default: "",
    },
});

const store = useThreeViewStore();

function mouseEnter() {
    let global = undefined;
    if(props.index > 0) {
        if(props.attr === "font") {
            global = store.fontGlobal;
        } else if(props.attr === "left") {
            global = store.leftGlobal;
        } else if(props.attr === "top") {
            global = store.topGlobal;
        }
    }

    if(global) {
        global.hoverState = State.Point;
        global.hover = props.index;
        global.x = props.x;
        global.y = props.y;
    }

    if(global && global.drawing && !global.moving) {
        global.clicked.splice(0, global.clicked.length);
        global.clicked.push(props.index);
    }
}

function mouseOut() {
    let global = undefined;
    if(props.index > 0) {
        if(props.attr === "font") {
            global = store.fontGlobal;
        } else if(props.attr === "left") {
            global = store.leftGlobal;
        } else if(props.attr === "top") {
            global = store.topGlobal;
        }
    }

    if(global) {
        global.hoverState = State.None;
        global.hover = 0;
    }

    if(global && global.drawing && !global.moving) {
        global.clicked.splice(0, global.clicked.length);
    }
}

function click() {
    let clicked = undefined;
    if(props.index > 0) {
        if(props.attr === "font") {
            clicked = store.fontGlobal.clicked;
        } else if(props.attr === "left") {
            clicked = store.leftGlobal.clicked;
        } else if(props.attr === "top") {
            clicked = store.topGlobal.clicked;
        }
    }


    if(clicked) {
        if(!store.global.ctrl) {
            clicked.splice(0, clicked.length);
        }
        clicked.push(props.index);
    }
}
</script>

<style lang="scss" scoped>
</style>
