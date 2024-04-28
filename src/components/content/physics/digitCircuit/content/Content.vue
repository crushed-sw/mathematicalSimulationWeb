<template>
    <div
        tabindex="1"
        class="h-full w-full relative"
        @keydown="keydown"
        @keyup="keyup"
    >
        <Annotation
            :width="width"
            :height="height"
        ></Annotation>
        <RightMenu
            :width="width"
            :height="height"
        ></RightMenu>
        <v-stage
            :width="width"
            :height="height"
            @mousedown="mousedown"
            @mouseup="mouseup"
            @mousemove="move"
            @mouseleave="leave"
            @click="click"
        >
            <v-layer>
                <BaseBord
                    :width="width"
                    :height="height"
                ></BaseBord>
            </v-layer>
            <v-layer>
                <BufGate :x="x" :y="y" :visible="bufGate" :isPreview="true"></BufGate>
                <NotGate :x="x" :y="y" :visible="notGate" :isPreview="true"></NotGate>
                <AndGate :x="x" :y="y" :visible="andGate" :isPreview="true"></AndGate>
                <AndNotGate :x="x" :y="y" :visible="andNotGate" :isPreview="true"></AndNotGate>
                <OrGate :x="x" :y="y" :visible="orGate" :isPreview="true"></OrGate>
                <OrNotGate :x="x" :y="y" :visible="orNotGate" :isPreview="true"></OrNotGate>
                <XnorGate :x="x" :y="y" :visible="xnorGate" :isPreview="true"></XnorGate>
                <XnorNotGate :x="x" :y="y" :visible="xnorNotGate" :isPreview="true"></XnorNotGate>
                <ThreeAndGate :x="x" :y="y" :visible="threeAndGate" :isPreview="true"></ThreeAndGate>
                <ThreeAndNotGate :x="x" :y="y" :visible="threeAndNotGate" :isPreview="true"></ThreeAndNotGate>
                <ThreeOrGate :x="x" :y="y" :visible="threeOrGate" :isPreview="true"></ThreeOrGate>
                <ThreeOrNotGate :x="x" :y="y" :visible="threeOrNotGate" :isPreview="true"></ThreeOrNotGate>
                <ThreeXnorGate :x="x" :y="y" :visible="threeXnorGate" :isPreview="true"></ThreeXnorGate>
                <ThreeXnorNotGate :x="x" :y="y" :visible="threeXnorNotGate" :isPreview="true"></ThreeXnorNotGate>
                <SwitchOne :x="x" :y="y" :visible="switchOne" :isPreview="true"></SwitchOne>
                <SwitchTwo :x="x" :y="y" :visible="switchTwo" :isPreview="true"></SwitchTwo>
                <DigitalValue :x="x" :y="y" :visible="digitalValue" :isPreview="true"></DigitalValue>
                <DigitalClock :x="x" :y="y" :visible="digitalClock" :isPreview="true"></DigitalClock>
                <Blub :x="x" :y="y" :visible="blub" :isPreview="true"></Blub>
                <Line :points="[lineConfig.x, lineConfig.y, x, y]" :visible="lineConfig.visible"></Line>
            </v-layer>
            <v-layer ref="layer">
                <DrawAllElement></DrawAllElement>
            </v-layer>
            <v-layer>
                <v-rect ref="selected" :={...selectConfig}></v-rect>
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue"
import { useDigitCircuitStore, State } from "@/stores/digitCircuitStore"

import BaseBord from "../../circuitUtil/BaseBord.vue"
import DrawAllElement from "./DrawAllElement.vue"

import Line from "../../circuitUtil/Line.vue"
import BufGate from "../../circuitUtil/BufGate.vue"
import NotGate from "../../circuitUtil/NotGate.vue"
import AndGate from "../../circuitUtil/AndGate.vue"
import AndNotGate from "../../circuitUtil/AndNotGate.vue"
import OrGate from "../../circuitUtil/OrGate.vue"
import OrNotGate from "../../circuitUtil/OrNotGate.vue"
import XnorGate from "../../circuitUtil/XnorGate.vue"
import XnorNotGate from "../../circuitUtil/XnorNotGate.vue"
import ThreeAndGate from "../../circuitUtil/ThreeAndGate.vue"
import ThreeAndNotGate from "../../circuitUtil/ThreeAndNotGate.vue"
import ThreeOrGate from "../../circuitUtil/ThreeOrGate.vue"
import ThreeOrNotGate from "../../circuitUtil/ThreeOrNotGate.vue"
import ThreeXnorGate from "../../circuitUtil/ThreeXnorGate.vue"
import ThreeXnorNotGate from "../../circuitUtil/ThreeXnorNotGate.vue"
import SwitchOne from "../../circuitUtil/SwitchOne.vue"
import SwitchTwo from "../../circuitUtil/SwitchTwo.vue"
import DigitalValue from "../../circuitUtil/DigitalValue.vue"
import DigitalClock from "../../circuitUtil/DigitalClock.vue"
import Blub from "../../circuitUtil/Blub.vue"

import Annotation from "./Annotation.vue"
import RightMenu from "./RightMenu.vue"

defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    }
});

const selectConfig = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: "rgba(100, 100, 100, 0.2)",
    visible: false,
});

const dragConfig = reactive({
    x: 0,
    y: 0,
    is: false,
});

const lineConfig = reactive({
    x: 0,
    y: 0,
    visible: false,
});

const store = useDigitCircuitStore();
const state = ref(State.None);
const x = ref(0);
const y = ref(0);

const layer = ref();
const selected = ref();

const bufGate = ref(false);
const notGate = ref(false);
const andGate = ref(false);
const andNotGate = ref(false);
const orGate = ref(false);
const orNotGate = ref(false);
const xnorGate = ref(false);
const xnorNotGate = ref(false);
const threeAndGate = ref(false);
const threeAndNotGate = ref(false);
const threeOrGate = ref(false);
const threeOrNotGate = ref(false);
const threeXnorGate = ref(false);
const threeXnorNotGate = ref(false);
const switchOne = ref(false);
const switchTwo = ref(false);
const digitalValue = ref(false);
const digitalClock = ref(false);
const blub = ref(false);

function reset() {
    if(bufGate.value) {bufGate.value = false}
    if(notGate.value) {notGate.value = false}
    if(andGate.value) {andGate.value = false}
    if(andNotGate.value) {andNotGate.value = false}
    if(orGate.value) {orGate.value = false}
    if(orNotGate.value) {orNotGate.value = false}
    if(xnorGate.value) {xnorGate.value = false}
    if(xnorNotGate.value) {xnorNotGate.value = false}
    if(threeAndGate.value) {threeAndGate.value = false}
    if(threeAndNotGate.value) {threeAndNotGate.value = false}
    if(threeOrGate.value) {threeOrGate.value = false}
    if(threeOrNotGate.value) {threeOrNotGate.value = false}
    if(threeXnorGate.value) {threeXnorGate.value = false}
    if(threeXnorNotGate.value) {threeXnorNotGate.value = false}
    if(switchOne.value) {switchOne.value = false}
    if(switchTwo.value) {switchTwo.value = false}
    if(digitalValue.value) {digitalValue.value = false}
    if(digitalClock.value) {digitalClock.value = false}
    if(blub.value) {blub.value = false}
}

function leave() {
    x.value = -100;
}

function move(event: any) {
    x.value = event.evt.layerX;
    y.value = event.evt.layerY;

    if(selectConfig.visible) {
        selectConfig.width = event.evt.layerX - selectConfig.x;
        selectConfig.height = event.evt.layerY - selectConfig.y;
    }

    if(dragConfig.is) {
        const dx = event.evt.clientX - dragConfig.x;
        const dy = event.evt.clientY - dragConfig.y;
        dragConfig.x = event.evt.clientX;
        dragConfig.y = event.evt.clientY;

        store.moveElement(dx, dy);
    }
}

function click() {
    if(store.global.hover === -1) {
        store.global.selected = [];
    }

    store.global.state = State.None;
    reset();

    store.addElement(state.value, x.value, y.value);
}

watch(() => store.global.state, () => {
    reset();
    state.value = store.global.state;
    switch(store.global.state) {
        case State.BufGate:
            bufGate.value = true;
            break;
        case State.NotGate:
            notGate.value = true;
            break;
        case State.AndGate:
            andGate.value = true;
            break;
        case State.AndNotGate:
            andNotGate.value = true;
            break;
        case State.OrGate:
            orGate.value = true;
            break;
        case State.OrNotGate:
            orNotGate.value = true;
            break;
        case State.XnorGate:
            xnorGate.value = true;
            break;
        case State.XnorNotGate:
            xnorNotGate.value = true;
            break;
        case State.ThreeAndGate:
            threeAndGate.value = true;
            break;
        case State.ThreeAndNotGate:
            threeAndNotGate.value = true;
            break;
        case State.ThreeOrGate:
            threeOrGate.value = true;
            break;
        case State.ThreeOrNotGate:
            threeOrNotGate.value = true;
            break;
        case State.ThreeXnorGate:
            threeXnorGate.value = true;
            break;
        case State.ThreeXnorNotGate:
            threeXnorNotGate.value = true;
            break;
        case State.SwitchOne:
            switchOne.value = true;
            break;
        case State.SwitchTwo:
            switchTwo.value = true;
            break;
        case State.DigitalValue:
            digitalValue.value = true;
            break;
        case State.DigitalClock:
            digitalClock.value = true;
            break;
        case State.Blub:
            blub.value = true;
            break;
    }
});

function mousedown(event: any) {
    if(store.menu.visible) {
        store.menu.visible = false;
    }

    if(store.global.hover === -1) {
        selectConfig.x = event.evt.layerX;
        selectConfig.y = event.evt.layerY;
        selectConfig.visible = true;
    } else {
        dragConfig.is = true;
        dragConfig.x = event.evt.clientX;
        dragConfig.y = event.evt.clientY;
        store.global.drag = true;
    }
}

function mouseup(event: any) {
    if(store.global.dragToDraw) {
        store.global.state = State.None;
        reset();
        store.addElement(state.value, x.value, y.value);
    }

    if(store.global.hover === -1) {
        const selectedNode = selected.value.getNode().getClientRect();
        const arr: number[] = [];
        layer.value.getNode().children.forEach(function(shape: any) {
            if(shape.attrs.x <= selectedNode.x + selectedNode.width && shape.attrs.x >= selectedNode.x &&
               shape.attrs.y <= selectedNode.y + selectedNode.height && shape.attrs.y >= selectedNode.y) {
                arr.push(shape.attrs.index);
            }
        });
        store.global.selected = arr;

        selectConfig.x = 0;
        selectConfig.y = 0;
        selectConfig.width = 0;
        selectConfig.height = 0;
        selectConfig.visible = false;
    }

    if(dragConfig.is) {
        const dx = event.evt.clientX - dragConfig.x;
        const dy = event.evt.clientY - dragConfig.y;
        store.moveElement(dx, dy, true);

        dragConfig.is = false;
        dragConfig.x = 0;
        dragConfig.y = 0;
        store.global.drag = false;
    }

    if(lineConfig.visible) {
        lineConfig.visible = false;
    }
}

function keydown(event: any) {
    if(event.key === "Control") {
        store.global.ctrl = true;
    } else if(event.key === "Backspace" || event.key === "Delete") {
        store.deleteElement();
    }
}

function keyup(event: any) {
    if(event.key === "Control") {
        store.global.ctrl = false;
    }
}

watch(() => store.drawLine, () => {
    if(store.drawLine.is) {
        lineConfig.visible = true;
        if(store.drawLine.beginId !== -1) {
            lineConfig.x = store.drawLine.begin[0];
            lineConfig.y = store.drawLine.begin[1];
        } else if(store.drawLine.endId !== -1) {
            lineConfig.x = store.drawLine.end[0];
            lineConfig.y = store.drawLine.end[1];
        }
    }
}, {deep: true});

onMounted(() => {
    const xNum = Math.floor(window.screen.width / 20);
    const yNum = Math.floor(window.screen.height / 20);
    store.boolArray = Array(yNum).fill(Array(xNum).fill(-1));
});
</script>

<style lang="scss" scoped>
</style>
