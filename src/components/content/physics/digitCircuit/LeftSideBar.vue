<template>
    <div class="w-full h-full border-200 overflow-y-scroll" @mouseup="mouseup">
        <div class="m-3 flex flex-wrap gap-3" @mouseup="mouseup">
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.None }"
                @mousedown="mousedown(State.None)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="20" x2="35" y2="35" stroke="black" stroke-width="4"/>
                    <path d="M10,10 L20,20 L30,20 z" fill="black" stroke-width="0"/>
                    <path d="M10,10 L20,20 L20,30 z" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Blub }"
                @mousedown="mousedown(State.Blub)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="22.5" r="10" stroke="black" stroke-width="2"/>
                    <line x1="5" y1="22.5" x2="20" y2="22.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.DigitalValue }"
                @mousedown="mousedown(State.DigitalValue)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text
                        x="11"
                        y="27.5"
                        style="
                            font-family: Times New Roman;
                            font-size  : 12;
                            stroke     : #000000;
                            fill       : #000000;
                        "
                    >0</text>
                    <circle cx="15" cy="22.5" r="10" stroke="black" stroke-width="2"/>
                    <line x1="25" y1="22.5" x2="40" y2="22.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
           <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.DigitalClock }"
                @mousedown="mousedown(State.DigitalClock)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,27 L11,27 L11,18 L15,18 L15,27 L19,27 L19,18 L21,18" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="15" cy="22.5" r="10" stroke="black" stroke-width="2"/>
                    <line x1="25" y1="22.5" x2="40" y2="22.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.BufGate }"
                @mousedown="mousedown(State.BufGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,22.5 L15,22.5 M40,22.5 L30,22.5 M15,35 L15,10 L30,22.5 L15,35" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.NotGate }"
                @mousedown="mousedown(State.NotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,22.5 L15,22.5 M42,22.5 L35,22.5 M15,35 L15,10 L30,22.5 L15,35" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="32.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.AndGate }"
                @mousedown="mousedown(State.AndGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5,30 L10,30 M2.5,15 L10,15 M32.5,22.5 L42.5,22.5 M20.5,34.5 A12,12,90,1,0,20.5,10.5 L10,10.5 L10,34.5 L20.5,34.5" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.AndNotGate }"
                @mousedown="mousedown(State.AndNotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5,30 L10,30 M2.5,15 L10,15 M37.5,22.5 L42.5,22.5 M20.5,34.5 A12,12,90,1,0,20.5,10.5 L10,10.5 L10,34.5 L20.5,34.5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="35" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ThreeAndGate }"
                @mousedown="mousedown(State.ThreeAndGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5,30 L10,30 M2.5,22.5 L10,22.5 M2.5,15 L10,15 M32.5,22.5 L42.5,22.5 M20.5,34.5 A12,12,90,1,0,20.5,10.5 L10,10.5 L10,34.5 L20.5,34.5" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ThreeAndNotGate }"
                @mousedown="mousedown(State.ThreeAndNotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5,30 L10,30 M2.5,22.5 L10,22.5 M2.5,15 L10,15 M37.5,22.5 L42.5,22.5 M20.5,34.5 A12,12,90,1,0,20.5,10.5 L10,10.5 L10,34.5 L20.5,34.5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="35" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.OrGate }"
                @mousedown="mousedown(State.OrGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0125 M2.5,28 L10.5,28 M2.5,17 L10.5,17 M34.5,22.5 L42.5,22.5 M4.5,36.9848 Q26.5,38.5,34.5,22.5 M4.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.OrNotGate }"
                @mousedown="mousedown(State.OrNotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0125 M2.5,28 L10.5,28 M2.5,17 L10.5,17 M39.5,22.5 L44,22.5 M4.5,36.9848 Q26.5,38.5,34.5,22.5 M4.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="37.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ThreeOrGate }"
                @mousedown="mousedown(State.ThreeOrGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0125 M2.5,30 L10,30 M2.5,22.5 L10.5,22.5 M2.5,15 L10,15 M34.5,22.5 L42.5,22.5 M4.5,36.9848 Q26.5,38.5,34.5,22.5 M4.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ThreeOrNotGate }"
                @mousedown="mousedown(State.ThreeOrNotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0125 M2.5,30 L10,30 M2.5,22.5 L10.5,22.5 M2.5,15 L10,15 M39.5,22.5 L44,22.5 M4.5,36.9848 Q26.5,38.5,34.5,22.5 M4.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="37.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.XnorGate }"
                @mousedown="mousedown(State.XnorGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0152 M8.5,36.9848 A20.4848,20.4848,45,0,0,8.5,8.0152 M2.5,28 L9,28 M2.5,17 L9,17 M34.5,22.5 L42.5,22.5 M8.5,36.9848 Q26.5,38.5,34.5,22.5 M8.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.XnorNotGate }"
                @mousedown="mousedown(State.XnorNotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0152 M8.5,36.9848 A20.4848,20.4848,45,0,0,8.5,8.0152 M2.5,28 L9,28 M2.5,17 L9,17 M39.5,22.5 L44.5,22.5 M8.5,36.9848 Q26.5,38.5,34.5,22.5 M8.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="37.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ThreeXnorGate }"
                @mousedown="mousedown(State.ThreeXnorGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0152 M8.5,36.9848 A20.4848,20.4848,45,0,0,8.5,8.0152 M2.5,30 L9,30 M2.5,22.5 L10,22.5 M2.5,15 L9,15 M34.5,22.5 L42.5,22.5 M8.5,36.9848 Q26.5,38.5,34.5,22.5 M8.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ThreeXnorNotGate }"
                @mousedown="mousedown(State.ThreeXnorNotGate)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5,36.9848 A20.4848,20.4848,45,0,0,4.5,8.0152 M8.5,36.9848 A20.4848,20.4848,45,0,0,8.5,8.0152 M2.5,30 L9,30 M2.5,22.5 L9,22.5 M2.5,15 L9,15 M39.5,22.5 L44.5,22.5 M8.5,36.9848 Q26.5,38.5,34.5,22.5 M8.5,8.0152 Q26.5,6.5,34.5,22.5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="37.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.SwitchOne }"
                @mousedown="mousedown(State.SwitchOne)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5,22.5 L10,22.5 M42.5,22.5 L35,22.5 M15,22 L32,10" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="12.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                    <circle cx="32.5" cy="22.5" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.SwitchTwo }"
                @mousedown="mousedown(State.SwitchTwo)"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5,28 L10,28 M42.5,28 L35,28 M15,27.5 L32,15.5 M42.5,13 L35,13" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="12.5" cy="28" r="2.5" stroke="black" stroke-width="2"/>
                    <circle cx="32.5" cy="28" r="2.5" stroke="black" stroke-width="2"/>
                    <circle cx="32.5" cy="13" r="2.5" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';
import { useDigitCircuitStore } from "@/stores/digitCircuitStore"

const store = useDigitCircuitStore();

enum State {
    None,
    BufGate,
    NotGate,
    AndGate,
    AndNotGate,
    OrGate,
    OrNotGate,
    XnorGate,
    XnorNotGate,
    ThreeAndGate,
    ThreeAndNotGate,
    ThreeOrGate,
    ThreeOrNotGate,
    ThreeXnorGate,
    ThreeXnorNotGate,
    SwitchOne,
    SwitchTwo,
    DigitalValue,
    DigitalClock,
    Blub,
}

function mousedown(state: State) {
    store.global.state = state;
    store.global.dragToDraw = true;
}

function mouseup() {
    store.global.dragToDraw = false;
}
</script>

<style lang="scss" scoped>
</style>

