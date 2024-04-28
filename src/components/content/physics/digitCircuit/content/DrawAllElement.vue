<template>
    <BufGate v-for="config in store.bufGateArray" :="config"></BufGate>
    <NotGate v-for="config in store.notGateArray" :="config"></NotGate>
    <AndGate v-for="config in store.andGateArray" :="config"></AndGate>
    <AndNotGate v-for="config in store.andNotGateArray" :="config"></AndNotGate>
    <OrGate v-for="config in store.orGateArray" :="config"></OrGate>
    <OrNotGate v-for="config in store.orNotGateArray" :="config"></OrNotGate>
    <XnorGate v-for="config in store.xnorGateArray" :="config"></XnorGate>
    <XnorNotGate v-for="config in store.xnorNotGateArray" :="config"></XnorNotGate>
    <ThreeAndGate v-for="config in store.threeAndGateArray" :="config"></ThreeAndGate>
    <ThreeAndNotGate v-for="config in store.threeAndNotGateArray" :="config"></ThreeAndNotGate>
    <ThreeOrGate v-for="config in store.threeOrGateArray" :="config"></ThreeOrGate>
    <ThreeOrNotGate v-for="config in store.threeOrNotGateArray" :="config"></ThreeOrNotGate>
    <ThreeXnorGate v-for="config in store.threeXnorGateArray" :="config"></ThreeXnorGate>
    <ThreeXnorNotGate v-for="config in store.threeXnorNotGateArray" :="config"></ThreeXnorNotGate>
    <DigitalValue v-for="config in store.digitValueArray" :="config"></DigitalValue>
    <DigitalClock v-for="config in store.digitClockArray" :="config"></DigitalClock>
    <SwitchOne v-for="config in store.switchOneArray" :="config"></SwitchOne>
    <SwitchTwo v-for="config in store.switchTwoArray" :="config"></SwitchTwo>
    <Blub v-for="config in store.blubArray" :="config"></Blub>
    <Line v-for="config in store.lineArray" :="config"></Line>
</template>

<script lang="ts" setup>
import { useDigitCircuitStore } from "@/stores/digitCircuitStore"

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
import Line from "../../circuitUtil/Line.vue"

const store = useDigitCircuitStore();
</script>

<style lang="scss" scoped>
</style>
