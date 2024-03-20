<template>
    <div class="w-full h-full border-top-1 border-200">
        <div class="m-3 flex flex-wrap gap-3">
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.None }"
                @click="store.global.state = State.None"
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
                :class="{ 'bg-cyan-100': store.global.state === State.Point || store.global.state === State.MultiPoint }"
                @click="store.global.state = State.Point"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22.5" cy="22.5" r="4" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Line || store.global.state === State.LineSegment }"
                @click="store.global.state = State.Line"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="10" r="3" fill="black" stroke-width="0"/>
                    <line x1="10" y1="35" x2="35" y2="10" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.MultiLine }"
                @click="store.global.state = State.MultiLine"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="22.5" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="35" r="3" fill="black" stroke-width="0"/>
                    <line x1="10" y1="35" x2="22.5" y2="10" stroke="black" stroke-width="2"/>
                    <line x1="22.5" y1="10" x2="35" y2="35" stroke="black" stroke-width="2"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Circle || store.global.state === State.MultiCircle }"
                @click="store.global.state = State.Circle"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22.5" cy="22.5" r="18" fill="transparent" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="35" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.CircleThreePoints || store.global.state === State.MultiCircleThreePoints }"
                @click="store.global.state = State.CircleThreePoints"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22.5" cy="22.5" r="18" fill="transparent" stroke="black" stroke-width="2"/>
                    <circle cx="10" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="35" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Ellipse || store.global.state === State.MultiEllipse }"
                @click="store.global.state = State.Ellipse"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="22.5" cy="22.5" rx="18" ry="10" fill="transparent" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="40.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="22.5" cy="12.5" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.EllipseFocus || store.global.state === State.MultiEllipseFocus }"
                @click="store.global.state = State.EllipseFocus"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="22.5" cy="22.5" rx="18" ry="10" fill="transparent" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="32" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="12.5" cy="14.5" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Hyperbola || store.global.state === State.MultiHyperbola }"
                @click="store.global.state = State.Hyperbola"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,5 Q22.5,22.5 5,40" fill="none" stroke="black" stroke-width="2"/>
                    <path d="M40,5 Q22.5,22.5 40,40" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="31.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="22.5" cy="12.5" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.HyperbolaFocus || store.global.state === State.MultiHyperbolaFocus }"
                @click="store.global.state = State.HyperbolaFocus"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,5 Q22.5,22.5 5,40" fill="none" stroke="black" stroke-width="2"/>
                    <path d="M40,5 Q22.5,22.5 40,40" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="38" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="11" cy="12.5" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Parabola || store.global.state === State.MultiParabola }"
                @click="store.global.state = State.Parabola"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,5 Q22.5,70 40,5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="7.5" cy="12.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="16" cy="32" r="3" fill="black" stroke-width="0"/>
                    <circle cx="34" cy="22.5" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.ParabolaFocus || store.global.state === State.MultiParabolaFocus }"
                @click="store.global.state = State.ParabolaFocus"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,5 Q22.5,70 40,5" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="22.5" cy="37" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.QuadraticBezier || store.global.state === State.MultiQuadraticBezier }"
                @click="store.global.state = State.QuadraticBezier"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,35 Q22.5,10 35,35" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="10" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="22.5" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="35" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.CubicBezier || store.global.state === State.MultiCubicBezier }"
                @click="store.global.state = State.CubicBezier"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,35 C10,10 35,10 35,35" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="10" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="10" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="35" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Rectangle || store.global.state === State.MultiRectangle }"
                @click="store.global.state = State.Rectangle"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="10" width="35" height="25" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="5" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="40" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="40" cy="35" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Square || store.global.state === State.MultiSquare }"
                @click="store.global.state = State.Square"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="25" height="25" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="10" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
            <Button
                outlined
                class="p-0"
                :class="{ 'bg-cyan-100': store.global.state === State.Polygon }"
                @click="store.global.state = State.Polygon"
            >
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.5,10 L10,22.5 L10,35 L35,35 L35,22.5 z" fill="none" stroke="black" stroke-width="2"/>
                    <circle cx="22.5" cy="10" r="3" fill="black" stroke-width="0"/>
                    <circle cx="10" cy="22.5" r="3" fill="black" stroke-width="0"/>
                    <circle cx="10" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="35" r="3" fill="black" stroke-width="0"/>
                    <circle cx="35" cy="22.5" r="3" fill="black" stroke-width="0"/>
                </svg>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';
import { watch } from "vue"
import { useGeometryStore } from "@/stores/geometryStore"

const store = useGeometryStore();

enum State {
    None,
    Point,
    MultiPoint,
    Line,
    MultiLine,
    LineSegment,
    Circle,
    MultiCircle,
    CircleThreePoints,
    MultiCircleThreePoints,
    Ellipse,
    EllipseFocus,
    MultiEllipse,
    MultiEllipseFocus,
    Parabola,
    ParabolaFocus,
    MultiParabola,
    MultiParabolaFocus,
    Hyperbola,
    HyperbolaFocus,
    MultiHyperbola,
    MultiHyperbolaFocus,
    Rectangle,
    MultiRectangle,
    Square,
    MultiSquare,
    QuadraticBezier,
    MultiQuadraticBezier,
    CubicBezier,
    MultiCubicBezier,
    Polygon,
};

watch(() => store.global.state, () => {
    if(store.global.state === State.Line) {
    }
})
</script>

<style lang="scss" scoped>
</style>
