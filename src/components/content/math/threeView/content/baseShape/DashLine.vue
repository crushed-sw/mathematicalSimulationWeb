<template>
    <v-group
        @mouseenter="mouseEnter"
        @mousemove="mouseMove"
        @mouseout="mouseOut"
        @click="click"
        :index="index"
    >
        <v-line
            :points="points"
            :visible="mask"
            :dash="[10, 5]"
            :stroke="'rgba(255, 0, 0, 1)'"
            :strokeWidth="3"
        ></v-line>
        <v-line
            :points="points"
            :visible="visible"
            :dash="[10, 5]"
            :stroke="'rgba(0, 0, 0, 1)'"
            :strokeWidth="1"
            :fill="'rgba(255, 0, 0, 1)'"
            :hitStrokeWidth="5"
        ></v-line>
    </v-group>
</template>

<script lang="ts" setup>
import { useThreeViewStore, State } from "@/stores/threeViewStore.ts"

const props = defineProps({
    points: {
        type: Array<number>,
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

function mouseEnter(event: any) {
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
        global.hoverState = State.Dash;
        global.hover = props.index;

        const x1 = props.points[0];
        const y1 = props.points[1];
        const x2 = props.points[2];
        const y2 = props.points[3];

        const layerX = event.evt.layerX;
        const layerY = event.evt.layerY;

        const theta = Math.atan2(y1 - y2, x1 - x2);
        const unitTheta = Math.PI / 4;
        if((theta >= -unitTheta && theta <= unitTheta) || (theta < -3 * unitTheta) || (theta > 3 * unitTheta)) {
            const y = ((y2 - y1) / (x2 - x1)) * (layerX - x1) + y1;
            global.x = layerX;
            global.y = y;
        } else {
            const x = ((x2 - x1) / (y2 - y1)) * (layerY - y1) + x1;
            global.x = x;
            global.y = layerY;
        }
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

function mouseMove(event: any) {
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
        const x1 = props.points[0];
        const y1 = props.points[1];
        const x2 = props.points[2];
        const y2 = props.points[3];

        const layerX = event.evt.layerX;
        const layerY = event.evt.layerY;

        const theta = Math.atan2(y1 - y2, x1 - x2);
        const unitTheta = Math.PI / 4;
        if((theta >= -unitTheta && theta <= unitTheta) || (theta < -3 * unitTheta) || (theta > 3 * unitTheta)) {
            const y = ((y2 - y1) / (x2 - x1)) * (layerX - x1) + y1;
            global.x = layerX;
            global.y = y;
        } else {
            const x = ((x2 - x1) / (y2 - y1)) * (layerY - y1) + x1;
            global.x = x;
            global.y = layerY;
        }
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
