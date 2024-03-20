<template>
    <div
        ref="container"
        tabindex="1"
        class="w-full h-full relative container"
        @keydown="keydown"
        @keyup="keyup"
        @contextmenu="rightClick"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
    >
        <ShowState
            :stateValue="stateString"
        ></ShowState>
        <v-stage
            :config="stageConfig"
            @click="click"
            @mousemove="move"
        >
            <v-layer ref="layer">
                <DrawAllShapes></DrawAllShapes>

                <Point :={...point}></Point>
                <LineSegment :={...lineSegments}>
                    <Point :x="lineSegments.points[0]" :y="lineSegments.points[1]" :={...commondPoint} />
                    <Point :x="lineSegments.points[2]" :y="lineSegments.points[3]" :={...commondPoint} />
                </LineSegment>
                <Line :={...line}>
                    <Point
                        v-for="point in line.points"
                        :x="point[0]"
                        :y="point[1]"
                        :={...commondPoint}
                    />
                </Line>
                <Circle :={...circle}>
                    <Point :x="0" :y="0" :={...commondPoint} />
                    <Point :x="circle.inX - circle.x" :y="circle.inY - circle.y" :={...commondPoint} />
                </Circle>
                <CircleThreePoints :={...circleThreePoints}>
                    <template v-slot:outter>
                        <Point :x="circleThreePoints.points[0]" :y="circleThreePoints.points[1]" :={...commondPoint} />
                        <Point :x="circleThreePoints.points[2]" :y="circleThreePoints.points[3]" :={...commondPoint} />
                        <Point :x="circleThreePoints.points[4]" :y="circleThreePoints.points[5]" :={...commondPoint} />
                    </template>
                </CircleThreePoints>
                <Ellipse :={...ellipse}>
                    <Point :x="0" :y="0" :={...commondPoint} />
                    <Point :x="ellipse.params[4]" :y="0" :={...commondPoint} />
                    <Point :x="-ellipse.params[4]" :y="0" :={...commondPoint} />
                    <Point :x="0" :y="ellipse.params[5]" :={...commondPoint} />
                    <Point :x="0" :y="-ellipse.params[5]" :={...commondPoint} />
                </Ellipse>
                <EllipseFocus :={...ellipseFocus}>
                    <Point :x="ellipseFocus.x" :y="ellipseFocus.y" :={...commondPoint} />
                    <Point :x="ellipseFocus.inX" :y="ellipseFocus.inY" :={...commondPoint} />
                    <template v-slot:inner>
                        <Point :x="ellipseFocus.params[0]" :y="0" :={...commondPoint} />
                        <Point :x="-ellipseFocus.params[0]" :y="0" :={...commondPoint} />
                    </template>
                </EllipseFocus>
                <Hyperbola :={...hyperbola}>
                    <Point :x="0" :y="0" :={...commondPoint} />
                    <Point :x="hyperbola.params[4]" :y="0" :={...commondPoint} />
                    <Point :x="-hyperbola.params[4]" :y="0" :={...commondPoint} />
                    <Point :x="0" :y="hyperbola.params[5]" :={...commondPoint} />
                    <Point :x="0" :y="-hyperbola.params[5]" :={...commondPoint} />
                </Hyperbola>
                <HyperbolaFocus :={...hyperbolaFocus}>
                    <Point :x="hyperbolaFocus.x" :y="hyperbolaFocus.y" :={...commondPoint} />
                    <Point :x="hyperbolaFocus.inX" :y="hyperbolaFocus.inY" :={...commondPoint} />
                    <template v-slot:inner>
                        <Point :x="hyperbolaFocus.params[0]" :y="0" :={...commondPoint} />
                        <Point :x="-hyperbolaFocus.params[0]" :y="0" :={...commondPoint} />
                    </template>
                </HyperbolaFocus>
                <Parabola :={...parabola}>
                    <template v-slot:outter>
                        <Point :x="parabola.points[0]" :y="parabola.points[1]" :={...commondPoint} />
                        <Point :x="parabola.points[2]" :y="parabola.points[3]" :={...commondPoint} />
                        <Point :x="parabola.points[4]" :y="parabola.points[5]" :={...commondPoint} />
                    </template>
                </Parabola>
                <ParabolaFocus :={...parabolaFocus}>
                    <Point :x="0" :y="0" :={...commondPoint} />
                    <Point :x="0" :y="parabolaFocus.p / 2" :={...commondPoint} />
                </ParabolaFocus>
                <QuadraticBezier :={...quadraticBezier}>
                    <Point :x="quadraticBezier.points[0]" :y="quadraticBezier.points[1]" :={...commondPoint} />
                    <Point :x="quadraticBezier.points[2]" :y="quadraticBezier.points[3]" :={...commondPoint} />
                    <Point :x="quadraticBezier.points[4]" :y="quadraticBezier.points[5]" :={...commondPoint} />
                </QuadraticBezier>
                <CubicBezier :={...cubicBezier}>
                    <Point :x="cubicBezier.points[0]" :y="cubicBezier.points[1]" :={...commondPoint} />
                    <Point :x="cubicBezier.points[2]" :y="cubicBezier.points[3]" :={...commondPoint} />
                    <Point :x="cubicBezier.points[4]" :y="cubicBezier.points[5]" :={...commondPoint} />
                    <Point :x="cubicBezier.points[6]" :y="cubicBezier.points[7]" :={...commondPoint} />
                </CubicBezier>
                <Rectangle :={...rectangle}>
                    <Point :x="0" :y="0" :={...commondPoint} />
                    <Point :x="rectangle.params[4]" :y="0" :={...commondPoint} />
                    <Point :x="0" :y="rectangle.params[5]" :={...commondPoint} />
                    <Point :x="rectangle.params[4]" :y="rectangle.params[5]" :={...commondPoint} />
                </Rectangle>
                <Square :={...square}>
                    <Point :x="0" :y="0" :={...commondPoint} />
                    <Point :x="square.params[1]" :y="0" :={...commondPoint} />
                    <Point :x="0" :y="square.params[1]" :={...commondPoint} />
                    <Point :x="square.params[1]" :y="square.params[1]" :={...commondPoint} />
                </Square>
                <Polygon :={...polygon}>
                    <Point
                        v-for="point in polygon.points"
                        :x="point[0]"
                        :y="point[1]"
                        :={...commondPoint}
                    />
                </Polygon>

                <v-rect ref="selected" :={...selectConfig}></v-rect>
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted, toRaw } from "vue"
import {
    useGeometryStore,
    pointConfig,
    lineConfig,
    lineSegmentsConfig,
    circleConfig,
    circleThreePointsConfig,
    ellipseConfig,
    ellipseFocusConfig,
    hyperbolaConfig,
    hyperbolaFocusConfig,
    parabolaConfig,
    parabolaFocusConfig,
    quadraticBezierConfig,
    cubicBezierConfig,
    rectangleConfig,
    squareConfig,
    Types
} from "@/stores/geometryStore"
import ShowState from "./ShowState.vue"
import Point from "./basicShape/Point.vue"
import Line from "./basicShape/Line.vue"
import LineSegment from "./basicShape/LineSegment.vue"
import Circle from "./basicShape/Circle.vue"
import CircleThreePoints from "./basicShape/CircleThreePoints.vue"
import Ellipse from "./basicShape/Ellipse.vue"
import EllipseFocus from "./basicShape/EllipseFocus.vue"
import Hyperbola from "./basicShape/Hyperbola.vue"
import HyperbolaFocus from "./basicShape/HyperbolaFocus.vue"
import Parabola from "./basicShape/Parabola.vue"
import ParabolaFocus from "./basicShape/ParabolaFocus.vue"
import QuadraticBezier from "./basicShape/QuadraticBezier.vue"
import CubicBezier from "./basicShape/CubicBezier.vue"
import Rectangle from "./basicShape/Rectangle.vue"
import Square from "./basicShape/Square.vue"
import Polygon from "./basicShape/Polygon.vue"

import DrawAllShapes from "./DrawAllShapes.vue"

let isSelected = false;
let isDrag = false;
const lenConfig = {
    type: Types.None,
    isLen: false,
    lenValue: 0,
    id: [],
}

const angleConfig = {
    type: Types.None,
    isAngle: false,
    angleValue: 0,
    id: [],
}

const dragConfig = {
    x: 0,
    y: 0,
    id: -1,
    type: Types.None,
};

const selectConfig = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: "rgba(100, 100, 100, 0.2)",
    stroke: "rgba(0, 0, 200, 1)",
    strokeWidth: 0.5,
    visible: false,
});

const commondPoint = {
    radius: 3,
    fill: "rgba(255, 50, 0, 1)",
    strokeWidth: 1,
    maskWidth: 2,
    mask: "rgba(255, 50, 0, 1)",
    visible: true,
    choosable: false,
};

const point = reactive({
    x: 0,
    y: 0,
    leaves: [-1],
    radius: 3,
    fill: "rgba(255, 50, 0, 1)",
    strokeWidth: 1,
    maskWidth: 2,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const line = reactive({
    points: [[0, 0]],
    leaves: [-1],
    stroke: "rgba(0, 0, 200, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const lineSegments = reactive({
    points: [0, 0, 0, 0],
    leaves: [-1, -1],
    stroke: "rgba(0, 0, 200, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const circle = reactive({
    x: 0,
    y: 0,
    inX: 0,
    inY: 0,
    radius: 1,
    leaves: [-1, -1],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const circleThreePoints = reactive({
    points: [0, 0, 0, 0, 0, 0],
    leaves: [-1, -1, -1],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const ellipse = reactive({
    x: 0,
    y: 0,
    rowX: 0,
    rowY: 0,
    colX: 0,
    colY: 0,
    leaves: [-1, -1, -1],
    params: [0, 0, 0, 0, 0, 0],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const ellipseFocus = reactive({
    x: 0,
    y: 0,
    focusX: 0,
    focusY: 0,
    inX: 0,
    inY: 0,
    leaves: [-1, -1, -1],
    params: [0, 0],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const hyperbola = reactive({
    x: 0,
    y: 0,
    rowX: 0,
    rowY: 0,
    colX: 0,
    colY: 0,
    leaves: [-1, -1, -1],
    params: [0, 0, 0, 0, 0, 0],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const hyperbolaFocus = reactive({
    x: 0,
    y: 0,
    focusX: 0,
    focusY: 0,
    inX: 0,
    inY: 0,
    leaves: [-1, -1, -1],
    params: [0],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const parabola = reactive({
    points: [0, 0, 0, 0, 0, 0],
    leaves: [-1, -1, -1],
    scope: [-200, 200],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const parabolaFocus = reactive({
    x: 0,
    y: 0,
    focusX: 0,
    focusY: 0,
    leaves: [-1, -1],
    scope: [-200, 200],
    p: 0,
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(46, 139, 87, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const quadraticBezier = reactive({
    points: [0, 0, 0, 0, 0, 0],
    leaves: [-1, -1, -1],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(160, 82, 45, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const cubicBezier = reactive({
    points: [0, 0, 0, 0, 0, 0, 0, 0],
    leaves: [-1, -1, -1, -1],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(160, 82, 45, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const rectangle = reactive({
    points: [0, 0, 0, 0, 0, 0],
    leaves: [-1, -1, -1],
    params: [0, 0, 0, 0, 0, 0],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(0, 0, 200, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const square = reactive({
    points: [0, 0, 0, 0, 0, 0],
    leaves: [-1, -1],
    params: [0, 0],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(0, 0, 200, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const polygon = reactive({
    points: [[0, 0]],
    leaves: [-1],
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(0, 0, 200, 1)",
    strokeWidth: 1,
    maskWidth: 1,
    mask: "rgba(255, 50, 0, 1)",
    visible: false,
    choosable: false,
});

const store = useGeometryStore();

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});

let stageConfig = reactive({
    width: 0,
    height: 0,
});

watch(() => props, () => {
    stageConfig.width = props.width;
    stageConfig.height = props.height;
}, {deep: true});

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

let stateString = ref("none");
let currentState: State = ref(State.None);
let clickTimes = 0;
let shift = false;
let selectedPoints: number[][] = [];

function resetState() {
    currentState.value = State.None;
    stateString.value = "none";
    store.global.drawing = false;
    clickTimes = 0;
    lenConfig.isLen = false;
    angleConfig.isAngle = false;

    hideAllShape();
}

function hideAllShape(isClear: boolean = true) {
    if(isClear) {
        selectedPoints = [];

        if(line.points.length >= 2) {
            line.points = line.points.slice(0, line.points.length - 1);
            store.addLine({...toRaw(line)} as any as lineConfig);
        }
        line.visible = false;
        line.points = [[0, 0]];
        line.leaves = [-1];

        if(polygon.points.length >= 2) {
            polygon.points = polygon.points.slice(0, polygon.points.length - 1);
            store.addPolygon({...toRaw(polygon)} as any as polygonConfig);
        }
        polygon.visible = false;
        polygon.points = [[0, 0]];
        polygon.leaves = [-1];
    }

    point.visible = false;
    lineSegments.visible = false;
    circle.visible = false;
    circleThreePoints.visible = false;
    ellipse.visible = false;
    ellipseFocus.visible = false;
    hyperbola.visible = false;
    hyperbolaFocus.visible = false;
    parabola.visible = false;
    parabolaFocus.visible = false;
    quadraticBezier.visible = false;
    cubicBezier.visible = false;
    rectangle.visible = false;
    square.visible = false;
}

function keyup(event: any) {
    if(event.key === "Shift") {
        shift = false;
    } else if(event.key === "Control") {
        store.global.ctrl = false;
    }
}

function keydown(event: any) {
    if(event.key === "Escape") {
        resetState();
    } else if(event.key === "Shift") {
        shift = true;
    } else if(event.key === "Control") {
        store.global.ctrl = true;
    } else if(event.key === "Backspace" || event.key === "Delete") {
        store.global.clicked.forEach((id: number) => {
            store.deleteShape(id);
        });
    } else if(event.key === "0" || event.key === "1" || event.key === "2" || event.key === "3" ||
              event.key === "4" || event.key === "5" || event.key === "6" || event.key === "7" ||
              event.key === "8" || event.key === "9") {
        if(lenConfig.isLen) {
            lenConfig.lenValue *= 10;
            lenConfig.lenValue += Number(event.key);
            stateString.value = `set len ${lenConfig.lenValue}`;
        } else if(angleConfig.isAngle) {
            angleConfig.angleValue *= 10;
            angleConfig.angleValue += Number(event.key);
            stateString.value = `set angle ${angleConfig.angleValue}`;
        } else if(store.global.clicked.length === 1) {
            const num = Number(event.key);
            store.changeHelper(store.global.clicked[0], num);
        }
    } else if(event.key === "Enter") {
        if(lenConfig.isLen) {
            store.changeLength(lenConfig.id, lenConfig.lenValue, lenConfig.type);
        } else if(angleConfig.isAngle) {
            store.changeAngle(angleConfig.id, angleConfig.angleValue, angleConfig.type);
        }
        resetState();
    } else if(event.key === "a") {
        if(store.global.clicked.length === 2) {
            const line1 = store.allShapes.get(store.global.clicked[0]);
            const line2 = store.allShapes.get(store.global.clicked[1]);
            if(line1 === Types.LineSegment && line2 === Types.LineSegment) {
                angleConfig.type = Types.LineSegment;
                angleConfig.isAngle = true;
                angleConfig.angleValue = 0;
                angleConfig.id = [store.global.clicked[0], store.global.clicked[1]];
                stateString.value = "set angle";
            }
        } else if(store.global.clicked.length === 3) {
            const point1 = store.allShapes.get(store.global.clicked[0]);
            const point2 = store.allShapes.get(store.global.clicked[1]);
            const point3 = store.allShapes.get(store.global.clicked[2]);
            if(point1 === Types.Point && point2 === Types.Point && point3 === Types.Point) {
                angleConfig.type = Types.Point;
                angleConfig.isAngle = true;
                angleConfig.angleValue = 0;
                angleConfig.id = [...store.global.clicked];
                stateString.value = "set angle";
            }
        } else {
            if(event.ctrlKey) {
                event.preventDefault();
                const arr: number[] = [];
                store.allShapes.forEach((_: Types, key: number) => {
                    arr.push(key);
                });
                store.global.clicked = arr;
            } else {
                store.global.drawing = true;
                clickTimes = 3;
                if(currentState.value === State.Point) {
                    currentState.value = State.Parabola;
                    stateString.value = "parabola";
                    point.visible = false;
                } else if(currentState.value === State.Parabola) {
                    currentState.value = State.MultiParabola;
                    stateString.value = "multi-parabola";
                } else {
                    resetState();
                }
            }
        }
    } else if(event.key === "p") {
        store.global.drawing = true;
        clickTimes = 1;
        if(currentState.value === State.None) {
            currentState.value = State.Point;
            stateString.value = "point";
            point.visible = true;
        } else if(currentState.value === State.Point) {
            currentState.value = State.MultiPoint;
            stateString.value = "multi-point";
            point.visible = true;
        } else if(currentState.value === State.Circle) {
            currentState.value = State.CircleThreePoints;
            stateString.value = "circle-point";
            clickTimes = 3;
        } else if(currentState.value === State.CircleThreePoints) {
            currentState.value = State.MultiCircleThreePoints;
            stateString.value = "multi-circle-point";
            clickTimes = 3;
        } else {
            resetState();
        }
    } else if(event.key === "l") {
        if(store.global.clicked.length === 1) {
            const line = store.allShapes.get(store.global.clicked[0]);
            if(line && line === Types.LineSegment) {
                lenConfig.type = Types.LineSegment;
                lenConfig.isLen = true;
                lenConfig.lenValue = 0;
                lenConfig.id = [store.global.clicked[0]];
                stateString.value = "set len";
            }
        } else if(store.global.clicked.length === 2) {
            const point1 = store.allShapes.get(store.global.clicked[0]);
            const point2 = store.allShapes.get(store.global.clicked[1]);
            if(point1 === Types.Point && point2 === Types.Point) {
                lenConfig.type = Types.Point;
                lenConfig.isLen = true;
                lenConfig.lenValue = 0;
                lenConfig.id = [store.global.clicked[0], store.global.clicked[1]];
                stateString.value = "set len";
            }
        } else {
            store.global.drawing = true;
            if(currentState.value === State.None) {
                currentState.value = State.Line;
                stateString.value = "line";
                clickTimes = 2;
            } else if(currentState.value === State.Line) {
                currentState.value = State.MultiLine;
                stateString.value = "multi-line";
                clickTimes = 1;
                line.visible = true;
            } else {
                resetState();
            }
        }
    } else if(event.key === "c") {
        store.global.drawing = true;
        clickTimes = 2;
        if(currentState.value === State.None) {
            currentState.value = State.Circle;
            stateString.value = "circle";
        } else if(currentState.value === State.Circle) {
            currentState.value = State.MultiCircle;
            stateString.value = "multi-circle";
        } else {
            resetState();
        }
    } else if(event.key === "s") {
        store.global.drawing = true;
        clickTimes = 2;
        if(currentState.value === State.None) {
            currentState.value = State.Square;
            stateString.value = "square";
        } else if(currentState.value === State.Square) {
            currentState.value = State.MultiSquare;
            stateString.value = "multi-square";
        } else if(currentState.value === State.Line) {
            currentState.value = State.LineSegment;
            stateString.value = "line-segments";
            clickTimes = 2;
        } else {
            resetState();
        }
    } else if(event.key === "r") {
        store.global.drawing = true;
        clickTimes = 3;
        if(currentState.value === State.None) {
            currentState.value = State.Rectangle;
            stateString.value = "rectangle";
        } else if(currentState.value === State.Rectangle) {
            currentState.value = State.MultiRectangle;
            stateString.value = "multi-rectangle";
        } else {
            resetState();
        }
    } else if(event.key === "e") {
        store.global.drawing = true;
        clickTimes = 3;
        if(currentState.value === State.None) {
            currentState.value = State.Ellipse;
            stateString.value = "ellipse";
        } else if(currentState.value === State.Ellipse) {
            currentState.value = State.MultiEllipse;
            stateString.value = "multi-ellipse";
        } else {
            resetState();
        }
    } else if(event.key === "h") {
        store.global.drawing = true;
        clickTimes = 3;
        if(currentState.value === State.None) {
            currentState.value = State.Hyperbola;
            stateString.value = "hyperbola";
        } else if(currentState.value === State.Hyperbola) {
            currentState.value = State.MultiHyperbola;
            stateString.value = "multi-hyperbola";
        } else {
            resetState();
        }
    } else if(event.key === "f") {
        store.global.drawing = true;
        clickTimes = 3;
        if(currentState.value === State.Ellipse) {
            currentState.value = State.EllipseFocus;
            stateString.value = "ellipse-focus";
        } else if(currentState.value === State.Hyperbola) {
            currentState.value = State.HyperbolaFocus;
            stateString.value = "hyperbola-focus";
        } else if(currentState.value === State.Parabola) {
            currentState.value = State.ParabolaFocus;
            stateString.value = "parabola-focus";
            clickTimes = 2;
        } else if(currentState.value === State.EllipseFocus) {
            currentState.value = State.MultiEllipseFocus;
            stateString.value = "multi-ellipse-focus";
        } else if(currentState.value === State.HyperbolaFocus) {
            currentState.value = State.MultiHyperbolaFocus;
            stateString.value = "multi-hyperbola-focus";
        } else if(currentState.value === State.ParabolaFocus) {
            currentState.value = State.MultiParabolaFocus;
            stateString.value = "multi-parabola-focus";
            clickTimes = 2;
        } else {
            resetState();
        }
    } else if(event.key === "o") {
        store.global.drawing = true;
        clickTimes = 1;
        if(currentState.value === State.Point) {
            currentState.value = State.Polygon;
            stateString.value = "polygon";
            clickTimes = 1;
            polygon.visible = true;
        }
    } else if(event.key === "q") {
        store.global.drawing = true;
        clickTimes = 3;
        if(currentState.value === State.None) {
            currentState.value = State.QuadraticBezier;
            stateString.value = "quadratic-bezier";
        } else if(currentState.value === State.QuadraticBezier) {
            currentState.value = State.MultiQuadraticBezier;
            stateString.value = "multi-quadratic-bezier";
        } else {
            resetState();
        }
    } else if(event.key === "b") {
        store.global.drawing = true;
        clickTimes = 4;
        if(currentState.value === State.Circle) {
            currentState.value = State.CubicBezier;
            stateString.value = "cubic-bezier";
        } else if(currentState.value === State.CubicBezier) {
            currentState.value = State.MultiCubicBezier;
            stateString.value = "multi-cubic-bezier";
        } else {
            resetState();
        }
    } else {
        resetState();
    }
}

function rightClick(event: any) {
    event.preventDefault();
    resetState();
}

function click(event: any) {
    let x = event.evt.layerX;
    let y = event.evt.layerY;
    let id = -1;

    if(store.global.hover.type !== Types.None) {
        x = store.global.hover.x;
        y = store.global.hover.y;
    }

    if(store.global.hover.type === Types.Point) {
        id = store.global.hover.id;
    }

    if(store.global.hover.id === -1 && !store.global.ctrl) {
        store.global.clicked = [];
    }

    if(clickTimes > 0 && currentState !== State.None) {
        clickTimes--;
        selectedPoints.push([x, y]);
        if(currentState.value === State.Point || currentState.value === State.MultiPoint) {
            point.leaves = [id];
            store.addPoint({...toRaw(point)} as any as pointConfig);
            point.leaves = [-1];
        } else if(currentState.value === State.Line || currentState.value === State.LineSegment) {
            if(clickTimes === 0) {
                store.addLineSegments({...toRaw(lineSegments)} as any as lineSegmentsConfig);
                point.leaves = [-1, -1];
                lineSegments.visible = false;
            } else if(clickTimes === 1) {
                lineSegments.visible = true;
                lineSegments.points = [x, y, x, y];
                lineSegments.leaves[0] = id;
            }
        } else if(currentState.value === State.Circle || currentState.value === State.MultiCircle) {
            if(clickTimes === 0) {
                store.addCircle({...toRaw(circle)} as any as circleConfig);
                point.leaves = [-1, -1];
            } else if(clickTimes === 1) {
                circle.visible = true;
                circle.x = x;
                circle.y = y;
                circle.inX = x;
                circle.inY = y;
                circle.radius = 1;
                circle.leaves[0] = id;
            }
        } else if(currentState.value === State.CircleThreePoints || currentState.value === State.MultiCircleThreePoints) {
            if(clickTimes === 0) {
                store.addCircleThreePoints({...toRaw(circleThreePoints)} as any as circleThreePointsConfig);
                point.leaves = [-1, -1, -1];
            } else if(clickTimes === 2) {
                circleThreePoints.visible = true;
                circleThreePoints.points = [x, y, x, y, x, y];
                circleThreePoints.leaves[0] = id;
            }
        } else if(currentState.value === State.MultiLine) {
            line.points.push([x, y]);
            line.leaves.push(-1);
        } else if(currentState.value === State.Ellipse || currentState.value === State.MultiEllipse) {
            if(clickTimes === 0) {
                store.addEllipse({...toRaw(ellipse)} as any as ellipseConfig);
                ellipse.params = [0, 0, 0, 0, 0, 0];
                point.leaves = [-1, -1, -1];
            } else if(clickTimes === 2) {
                ellipse.x = x;
                ellipse.y = y;
                ellipse.colX = x;
                ellipse.colY = y;
                ellipse.rowX = x;
                ellipse.rowY = y;
                ellipse.visible = true;
                ellipse.leaves[0] = id;
            }
        } else if(currentState.value === State.Hyperbola || currentState.value === State.MultiHyperbola) {
            if(clickTimes === 0) {
                store.addHyperbola({...toRaw(hyperbola)} as any as hyperbolaConfig);
                point.leaves = [-1, -1, -1];
                hyperbola.params = [0, 0, 0, 0, 0, 0];
            } else if(clickTimes === 2) {
                hyperbola.x = x;
                hyperbola.y = y;
                hyperbola.colX = x;
                hyperbola.colY = y;
                hyperbola.rowX = x;
                hyperbola.rowY = y;
                hyperbola.visible = true;
                hyperbola.leaves[0] = id;
            }
        } else if(currentState.value === State.Parabola || currentState.value === State.MultiParabola) {
            if(clickTimes === 0) {
                store.addParabola({...toRaw(parabola)} as any as parabolaConfig);
                point.leaves = [-1, -1, -1];
            } else if(clickTimes === 2) {
                parabola.points = [x, y, x, y, x, y];
                parabola.visible = true;
                parabola.leaves[0] = id;
            }
        } else if(currentState.value === State.EllipseFocus || currentState.value === State.MultiEllipseFocus) {
            if(clickTimes === 0) {
                store.addEllipseFocus({...toRaw(ellipseFocus)} as any as ellipseFocusConfig);
                point.leaves = [-1, -1, -1];
                ellipseFocus.params = [0];
            } else if(clickTimes === 2) {
                ellipseFocus.x = x;
                ellipseFocus.y = y;
                ellipseFocus.focusX = x;
                ellipseFocus.focusY = y;
                ellipseFocus.inX = x;
                ellipseFocus.inY = y;
                ellipseFocus.params = [0];
                ellipseFocus.visible = true;
                ellipseFocus.leaves[0] = id;
            }
        } else if(currentState.value === State.HyperbolaFocus || currentState.value === State.MultiHyperbolaFocus) {
            if(clickTimes === 0) {
                store.addHyperbolaFocus({...toRaw(hyperbolaFocus)} as any as hyperbolaFocusConfig);
                point.leaves = [-1, -1, -1];
                hyperbolaFocus.params = [0];
            } else if(clickTimes === 2) {
                hyperbolaFocus.x = x;
                hyperbolaFocus.y = y;
                hyperbolaFocus.focusX = x;
                hyperbolaFocus.focusY = y;
                hyperbolaFocus.inX = x;
                hyperbolaFocus.inY = y;
                hyperbolaFocus.params = [0];
                hyperbolaFocus.visible = true;
                hyperbolaFocus.leaves[0] = id;
            }
        } else if(currentState.value === State.ParabolaFocus || currentState.value === State.MultiParabolaFocus) {
            if(clickTimes === 0) {
                store.addParabolaFocus({...toRaw(parabolaFocus)} as any as parabolaFocusConfig);
                point.leaves = [-1, -1];
            } else if(clickTimes === 1) {
                parabolaFocus.x = x;
                parabolaFocus.y = y;
                parabolaFocus.focusX = x;
                parabolaFocus.focusY = y;
                parabolaFocus.p = 0;
                parabolaFocus.visible = true;
                parabolaFocus.leaves[0] = id;
            }
        } else if(currentState.value === State.Rectangle || currentState.value === State.MultiRectangle) {
            if(clickTimes === 0) {
                store.addRectangle({...toRaw(rectangle)} as any as rectangleConfig);
                point.leaves = [-1, -1, -1];
                rectangle.points = [0, 0, 0, 0, 0, 0];
                rectangle.params = [0, 0, 0, 0, 0, 0];
            } else if(clickTimes === 2) {
                rectangle.visible = true;
                rectangle.points = [x, y, x, y, x, y];
                rectangle.leaves[0] = id;
            }
        } else if(currentState.value === State.Square || currentState.value === State.MultiSquare) {
            if(clickTimes === 0) {
                store.addSquare({...toRaw(square)} as any as squareConfig);
                point.leaves = [-1, -1];
                square.points = [0, 0, 0, 0, 0, 0];
                square.params = [0, 0];
            } else if(clickTimes === 1) {
                square.visible = true;
                square.points = [x, y, x, y, x, y];
                square.params = [0, 0];
                square.leaves[0] = id;
            }
        } else if(currentState.value === State.QuadraticBezier || currentState.value === State.MultiQuadraticBezier) {
            if(clickTimes === 0) {
                store.addQuadraticBezier({...toRaw(quadraticBezier)} as any as quadraticBezierConfig);
                point.leaves = [-1, -1, -1];
                quadraticBezier.points = [0, 0, 0, 0, 0, 0];
            } else if(clickTimes === 2) {
                quadraticBezier.visible = true,
                quadraticBezier.points = [x, y, x, y, x, y];
                quadraticBezier.leaves[0] = id;
            }
        } else if(currentState.value === State.CubicBezier || currentState.value === State.MultiCubicBezier) {
            if(clickTimes === 0) {
                store.addCubicBezier({...toRaw(cubicBezier)} as any as cubicBezierConfig);
                point.leaves = [-1, -1, -1, -1];
                cubicBezier.points = [0, 0, 0, 0, 0, 0, 0, 0];
            } else if(clickTimes === 3) {
                cubicBezier.visible = true;
                cubicBezier.points = [x, y, x, y, x, y, x, y];
                cubicBezier.leaves[0] = id;
            }
        } else if(currentState.value === State.Polygon) {
            polygon.points.push([x, y]);
            polygon.leaves.push(-1);
        }
    }

    if(clickTimes === 0) {
        if(currentState.value === State.MultiPoint) {
            clickTimes = 1;
        } else if(currentState.value === State.LineSegment || currentState.value === State.MultiCircle ||
                  currentState.value === State.MultiParabolaFocus || currentState.value === State.MultiSquare) {
            clickTimes = 2;
            hideAllShape();
        } else if(currentState.value === State.MultiLine || currentState.value === State.Polygon) {
            clickTimes = 1;
            hideAllShape(false);
        } else if(currentState.value === State.MultiEllipse || currentState.value === State.MultiHyperbola ||
                  currentState.value === State.MultiEllipseFocus || currentState.value === State.MultiHyperbolaFocus ||
                  currentState.value === State.MultiParabola || currentState.value === State.MultiQuadraticBezier ||
                  currentState.value === State.MultiRectangle || currentState.value === State.MultiCircleThreePoints) {
            clickTimes = 3;
            hideAllShape();
        } else if(currentState.value === State.MultiCubicBezier) {
            clickTimes = 4;
            hideAllShape();
        } else {
            resetState();
        }
    }
}

function correctPoint(x: number, y: number) {
    if(shift && selectedPoints.length !== 0) {
        const prevX = selectedPoints[selectedPoints.length - 1][0];
        const prevY = selectedPoints[selectedPoints.length - 1][1];

        const theta = Math.atan2(prevY - y, prevX - x);
        const unitTheta = Math.PI / 8;

        if((theta < unitTheta && theta > -unitTheta) || (theta > Math.PI - unitTheta) || (theta < -Math.PI + unitTheta)) {
            return [x, prevY];
        } else if((theta < 5 * unitTheta && theta > 3 * unitTheta) || (theta > -5 * unitTheta && theta < -3 * unitTheta)) {
            return [prevX, y];
        } else if((theta < 7 * unitTheta && theta > 5 * unitTheta) || (theta > -3 * unitTheta && theta < -unitTheta)) {
            const newX = x - prevX;
            const newY = y - prevY;
            const distance = Math.sqrt((Math.pow(newY, 2) + Math.pow(newX, 2)) / 2);

            if(newX > 0) {
                return [prevX + distance, prevY - distance];
            } else {
                return [prevX - distance, prevY + distance];
            }
        } else if((theta < 3 * unitTheta && theta > unitTheta) || (theta > -7 * unitTheta && theta < -5 * unitTheta)) {
            const newX = x - prevX;
            const newY = y - prevY;
            const distance = Math.sqrt((Math.pow(newY, 2) + Math.pow(newX, 2)) / 2);

            if(newX > 0) {
                return [prevX + distance, prevY + distance];
            } else {
                return [prevX - distance, prevY - distance];
            }
        }
    }
    return [x, y];
}

function move(event: any) {
    let x = event.evt.layerX;
    let y = event.evt.layerY;
    let id = -1;

    if(isSelected) {
        selectConfig.width = x - selectConfig.x;
        selectConfig.height = y - selectConfig.y;
    }

    if(store.global.hover.type !== Types.None && (store.global.drawing || isDrag)) {
        x = store.global.hover.x;
        y = store.global.hover.y;
        id = store.global.hover.id;
    }

    const newPoint = correctPoint(x, y);

    if(isDrag) {
        dragHandle(event.evt.clientX, event.evt.clientY);
    }

    x = newPoint[0];
    y = newPoint[1];

    point.x = x;
    point.y = y;

    if(currentState.value === State.MultiLine) {
        const len = line.points.length;
        line.points[len - 1][0] = x;
        line.points[len - 1][1] = y;
        line.leaves[len - 1] = id;
    }

    if(currentState.value === State.Line || currentState.value === State.LineSegment) {
        if(clickTimes === 1) {
            lineSegments.leaves[1] = id;
            lineSegments.points[2] = x;
            lineSegments.points[3] = y;
        }
    }

    if(currentState.value === State.Circle || currentState.value === State.MultiCircle) {
        if(clickTimes === 1) {
            circle.leaves[1] = id;
            circle.inX = x;
            circle.inY = y;
            circle.radius = Math.abs(Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)));
        }
    }

    if(currentState.value === State.CircleThreePoints || currentState.value === State.MultiCircleThreePoints) {
        if(clickTimes === 2) {
            circleThreePoints.leaves[1] = id;
            circleThreePoints.points = [...circleThreePoints.points.slice(0, 2), x, y, x, y];
        } else if(clickTimes === 1) {
            circleThreePoints.leaves[2] = id;
            circleThreePoints.points = [...circleThreePoints.points.slice(0, 4), x, y];
        }
    }

    if(currentState.value === State.Ellipse || currentState.value === State.MultiEllipse) {
        if(clickTimes === 2) {
            ellipse.leaves[1] = id;
            ellipse.rowX = x;
            ellipse.rowY = y;
            ellipse.params = [ellipse.y - y, x - ellipse.x, ellipse.x * y - x * ellipse.y,
                              Math.atan2(ellipse.y - y, ellipse.x - x), Math.sqrt(Math.pow(ellipse.y - y, 2) + Math.pow(x - ellipse.x, 2)), 0];
        } else if(clickTimes === 1) {
            ellipse.leaves[2] = id;
            const distance = Math.abs(ellipse.params[0] * x + ellipse.params[1] * y + ellipse.params[2]) /
                             Math.sqrt(Math.pow(ellipse.params[0], 2) + Math.pow(ellipse.params[1], 2));
            ellipse.params[5] = distance;
            ellipse.colX = ellipse.x - distance * Math.sin(ellipse.params[3]);
            ellipse.colY = ellipse.y + distance * Math.cos(ellipse.params[3]);
        }
    }

    if(currentState.value === State.EllipseFocus || currentState.value === State.MultiEllipseFocus) {
        if(clickTimes === 2) {
            ellipseFocus.leaves[1] = id;
            ellipseFocus.focusX = x;
            ellipseFocus.focusY = y;
            ellipseFocus.params = [Math.sqrt(Math.pow(ellipseFocus.y - y, 2) + Math.pow(x - ellipseFocus.x, 2)),
                                   Math.atan2(ellipse.y - y, ellipse.x - x)];
        } else if(clickTimes === 1) {
            ellipseFocus.leaves[2] = id;
            ellipseFocus.inX = x;
            ellipseFocus.inY = y;
        }
    }

    if(currentState.value === State.Hyperbola || currentState.value === State.MultiHyperbola) {
        if(clickTimes === 2) {
            hyperbola.leaves[1] = id;
            hyperbola.rowX = x;
            hyperbola.rowY = y;
            hyperbola.params = [hyperbola.y - y, x - hyperbola.x, hyperbola.x * y - x * hyperbola.y, Math.atan2(hyperbola.y - y, hyperbola.x - x),
                                Math.sqrt(Math.pow(hyperbola.y - y, 2) + Math.pow(x - hyperbola.x, 2)), 0];
        } else if(clickTimes === 1) {
            hyperbola.leaves[2] = id;
            const distance = Math.abs(hyperbola.params[0] * x + hyperbola.params[1] * y + hyperbola.params[2]) /
                             Math.sqrt(Math.pow(hyperbola.params[0], 2) + Math.pow(hyperbola.params[1], 2));
            hyperbola.params[5] = distance;
            hyperbola.colX = hyperbola.x - distance * Math.sin(hyperbola.params[3]);
            hyperbola.colY = hyperbola.y + distance * Math.cos(hyperbola.params[3]);
        }
    }

    if(currentState.value === State.HyperbolaFocus || currentState.value === State.MultiHyperbolaFocus) {
        if(clickTimes === 2) {
            hyperbolaFocus.leaves[1] = id;
            hyperbolaFocus.focusX = x;
            hyperbolaFocus.focusY = y;
            hyperbolaFocus.params = [Math.sqrt(Math.pow(hyperbolaFocus.y - y, 2) + Math.pow(x - hyperbolaFocus.x, 2))];
        } else if(clickTimes === 1) {
            hyperbolaFocus.leaves[2] = id;
            hyperbolaFocus.inX = x;
            hyperbolaFocus.inY = y;
        }
    }

    if(currentState.value === State.Parabola || currentState.value === State.MultiParabola) {
        if(clickTimes === 2) {
            parabola.leaves[1] = id;
            parabola.points[2] = x;
            parabola.points[3] = y;
        } else if(clickTimes === 1) {
            parabola.leaves[2] = id;
            parabola.points[4] = x;
            parabola.points[5] = y;
        }
    }

    if(currentState.value === State.ParabolaFocus || currentState.value === State.MultiParabolaFocus) {
        if(clickTimes === 1) {
            parabolaFocus.leaves[1] = id;
            parabolaFocus.focusX = x;
            parabolaFocus.focusY = y;
            parabolaFocus.p = Math.sqrt(Math.pow(parabolaFocus.y - y, 2) + Math.pow(parabolaFocus.x - x, 2)) * 2;
        }
    }

    if(currentState.value === State.QuadraticBezier || currentState.value === State.MultiQuadraticBezier) {
        if(clickTimes === 2) {
            quadraticBezier.leaves[1] = id;
            quadraticBezier.points = [...quadraticBezier.points.slice(0, 2), x, y, x, y];
        } else if(clickTimes === 1) {
            quadraticBezier.leaves[2] = id;
            quadraticBezier.points = [...quadraticBezier.points.slice(0, 4), x, y];
        }
    }

    if(currentState.value === State.CubicBezier || currentState.value === State.MultiCubicBezier) {
        if(clickTimes === 3) {
            cubicBezier.leaves[1] = id;
            cubicBezier.points = [...cubicBezier.points.slice(0, 2), x, y, x, y, x, y];
        } else if(clickTimes === 2) {
            cubicBezier.leaves[2] = id;
            cubicBezier.points = [...cubicBezier.points.slice(0, 4), x, y, x, y];
        } else if(clickTimes === 1) {
            cubicBezier.leaves[3] = id;
            cubicBezier.points = [...cubicBezier.points.slice(0, 6), x, y];
        }
    }

    if(currentState.value === State.Rectangle || currentState.value === State.MultiRectangle) {
        if(clickTimes === 2) {
            rectangle.leaves[1] = id;
            rectangle.points = [...rectangle.points.slice(0, 2), x, y, x, y];
            rectangle.params = [rectangle.points[1] - y, x - rectangle.points[0], rectangle.points[0] * y - x * rectangle.points[1],
                                Math.atan2(rectangle.points[1] - y, rectangle.points[0] - x),
                                Math.sqrt(Math.pow(rectangle.points[1] - y, 2) + Math.pow(x - rectangle.points[0], 2)), 0];
        } else if(clickTimes === 1) {
            rectangle.leaves[2] = id;
            const distance = Math.abs(rectangle.params[0] * x + rectangle.params[1] * y + rectangle.params[2]) /
                             Math.sqrt(Math.pow(rectangle.params[0], 2) + Math.pow(rectangle.params[1], 2));
            const newX = rectangle.points[2] - distance * Math.sin(rectangle.params[3] + Math.PI);
            const newY = rectangle.points[3] + distance * Math.cos(rectangle.params[3] + Math.PI);
            rectangle.params[5] = distance;
            rectangle.points = [...rectangle.points.slice(0, 4), newX, newY];
        }
    }

    if(currentState.value === State.Square || currentState.value === State.MultiSquare) {
        if(clickTimes === 1) {
            square.leaves[1] = id;
            square.points = [...square.points.slice(0, 2), x, y, x, y];
            square.params = [Math.atan2(square.points[1] - y, square.points[0] - x),
                             Math.sqrt(Math.pow(square.points[1] - y, 2) + Math.pow(x - square.points[0], 2))];

            const distance = Math.sqrt(Math.pow(square.points[0] - square.points[2], 2) + Math.pow(square.points[1] - square.points[3], 2));
            const newX = square.points[2] - distance * Math.sin(square.params[0] + Math.PI);
            const newY = square.points[3] + distance * Math.cos(square.params[0] + Math.PI);

            square.points = [...square.points.slice(0, 4), newX, newY];
        }
    }

    if(currentState.value === State.Polygon) {
        const len = polygon.points.length;
        polygon.points[len - 1][0] = x;
        polygon.points[len - 1][1] = y;
        polygon.leaves[len - 1] = id;
    }

}

function mouseDown(event: any) {
    if(event.button !== 0) return;

    if(store.global.hover.id === -1 && !store.global.drawing) {
        const x = event.layerX;
        const y = event.layerY;

        isSelected = true;
        selectConfig.visible = true;
        selectConfig.x = x;
        selectConfig.y = y;
    } else if(store.global.hover.id !== -1 && store.global.clicked.length >= 1 && !store.global.drawing) {
        isDrag = true;
        dragConfig.id = store.global.hover.id;
        dragConfig.type = store.global.hover.type;
        dragConfig.x = event.clientX;
        dragConfig.y = event.clientY;
    }
}

function mouseUp() {
    if(isSelected) {
        isSelected = false;
        selectConfig.visible = false;
        selectConfig.x = 0;
        selectConfig.y = 0;
        selectConfig.width = 0;
        selectConfig.height = 0;

        const selectedNode = selected.value.getNode().getClientRect();
        const arr: number[] = [];
        layer.value.getNode().children.forEach(function(shape: any) {
            if(shape.attrs.type === "otherShapes" || shape.attrs.type === "points") {
                shape.children.forEach((child: any) => {
                    if(child.attrs.type === "outter") {
                        child.children.forEach((inner: any) => {
                            const rect = inner.getClientRect();
                            if((selectedNode.x < rect.x && selectedNode.y < rect.y) &&
                               (selectedNode.x + selectedNode.width > rect.x + rect.width) &&
                               (selectedNode.y + selectedNode.height > rect.y + rect.height)) {
                                arr.push(inner.attrs.index);
                            }
                        })
                    } else {
                        const rect = child.getClientRect();
                        if((selectedNode.x < rect.x && selectedNode.y < rect.y) &&
                           (selectedNode.x + selectedNode.width > rect.x + rect.width) &&
                           (selectedNode.y + selectedNode.height > rect.y + rect.height)) {
                            arr.push(child.attrs.index);
                        }
                    }
                });
            }
        });
        store.global.clicked = arr;
    }

    if(isDrag) {
        isDrag = false;
        dragConfig.id = -1;
        dragConfig.type = Types.None;
    }
}

function dragHandle(x: number, y: number) {
    const dx = x - dragConfig.x;
    const dy = y - dragConfig.y;

    const set: Set<number> = new Set();

    store.global.clicked.forEach((id: number) => {
        switch(store.allShapes.get(id)) {
            case Types.Point:
                set.add(id);
                break;
            case Types.Line:
                store.lineList.forEach((line: lineConfig) => {
                    if(line.index === id) {
                        line.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.LineSegment:
                store.lineSegmentsList.forEach((lineSegment: lineSegmentsConfig) => {
                    if(lineSegment.index === id) {
                        lineSegment.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        lineSegment.helps.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.Circle:
                store.circleList.forEach((circle: circleConfig) => {
                    if(circle.index === id) {
                        circle.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.CircleThreePoints:
                store.circleThreePointsList.forEach((circle: circleThreePointsConfig) => {
                    if(circle.index === id) {
                        circle.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.Ellipse:
                store.ellipseList.forEach((ellipse: ellipseConfig) => {
                    if(ellipse.index === id) {
                        ellipse.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        ellipse.prevX += dx;
                        ellipse.prevY += dy;
                    }
                });
                break;
            case Types.EllipseFocus:
                store.ellipseFocusList.forEach((ellipse: ellipseFocusConfig) => {
                    if(ellipse.index === id) {
                        ellipse.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        ellipse.prevX += dx;
                        ellipse.prevY += dy;
                    }
                });
                break;
            case Types.Hyperbola:
                store.hyperbolaList.forEach((hyperbola: hyperbolaConfig) => {
                    if(hyperbola.index === id) {
                        hyperbola.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        hyperbola.prevX += dx;
                        hyperbola.prevY += dy;
                    }
                });
                break;
            case Types.HyperbolaFocus:
                store.hyperbolaFocusList.forEach((hyperbola: hyperbolaFocusConfig) => {
                    if(hyperbola.index === id) {
                        hyperbola.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        hyperbola.prevX += dx;
                        hyperbola.prevY += dy;
                    }
                });
                break;
            case Types.Parabola:
                store.parabolaList.forEach((parabola: parabolaConfig) => {
                    if(parabola.index === id) {
                        parabola.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.ParabolaFocus:
                store.parabolaFocusList.forEach((parabola: parabolaFocusConfig) => {
                    if(parabola.index === id) {
                        parabola.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.QuadraticBezier:
                store.quadraticBezierList.forEach((curve: quadraticBezierConfig) => {
                    if(curve.index === id) {
                        curve.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.CubicBezier:
                store.cubicBezierList.forEach((curve: cubicBezierConfig) => {
                    if(curve.index === id) {
                        curve.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
            case Types.Rectangle:
                store.rectangleList.forEach((rectangle: rectangleConfig) => {
                    if(rectangle.index === id) {
                        rectangle.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        rectangle.prev[0][0] += dx;
                        rectangle.prev[0][1] += dy;
                    }
                });
                break;
            case Types.Square:
                store.squareList.forEach((square: squareConfig) => {
                    if(square.index === id) {
                        square.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                        square.prev[0][0] += dx;
                        square.prev[0][1] += dy;
                        square.prev[1][0] += dx;
                        square.prev[1][1] += dy;
                    }
                });
                break;
            case Types.Polygon:
                store.polygonList.forEach((polygon: polygonConfig) => {
                    if(polygon.index === id) {
                        polygon.leaves.forEach((leave: number) => {
                           set.add(leave);
                        });
                    }
                });
                break;
        }
    });

    set.forEach((value: number) => {
        const point = store.getPoint(value);
        if(point) {
            point.x += dx;
            point.y += dy;
        }
    });

    set.forEach((value: number) => {
        const point = store.getPoint(value);
        if(point) {
            point.callBack(0, 0);
        }
    });

    dragConfig.x = x;
    dragConfig.y = y;
}

const selected = ref();
const layer = ref();
const container = ref();
onMounted(() => {
    container.value.focus();
});

watch(currentState, () => {
    if(store.global.state !== currentState.value) {
        store.global.state = currentState.value;
    }

    if(currentState.value !== State.None) {
        point.visible = true;
    }
});

watch(() => store.global.state, () => {
    if(store.global.state !== currentState.value) {
        currentState.value = store.global.state;
        store.global.drawing = true;

        switch(currentState.value) {
            case State.None:
                stateString.value = "none";
                resetState();
                break;
            case State.Point:
                stateString.value = "point";
                clickTimes = 1;
                break;
            case State.Line:
                stateString.value = "line";
                clickTimes = 2;
                break;
            case State.MultiLine:
                stateString.value = "multi-line";
                line.visible = true;
                clickTimes = 1;
                break;
            case State.Circle:
                stateString.value = "circle";
                clickTimes = 2;
                break;
            case State.CircleThreePoints:
                stateString.value = "circle-point";
                clickTimes = 3;
                break;
            case State.Ellipse:
                stateString.value = "ellipse";
                clickTimes = 3;
                break;
            case State.EllipseFocus:
                stateString.value = "ellipse-focus";
                clickTimes = 3;
                break;
            case State.Hyperbola:
                stateString.value = "hyperbola";
                clickTimes = 3;
                break;
            case State.HyperbolaFocus:
                stateString.value = "hyperbola-focus";
                clickTimes = 3;
                break;
            case State.Parabola:
                stateString.value = "parabola";
                clickTimes = 3;
                break;
            case State.ParabolaFocus:
                stateString.value = "parabola-foucs";
                clickTimes = 2;
                break;
            case State.QuadraticBezier:
                stateString.value = "quadratic-bezier";
                clickTimes = 3;
                break;
            case State.CubicBezier:
                stateString.value = "cubic-bezier";
                clickTimes = 4;
                break;
            case State.Rectangle:
                stateString.value = "rectangle";
                clickTimes = 3;
                break;
            case State.Square:
                stateString.value = "square";
                clickTimes = 2;
                break;
            case State.Polygon:
                stateString.value = "polygon";
                polygon.visible = true;
                clickTimes = 1;
                break;
        }
    }
});
</script>

<style lang="scss" scoped>
.container:focus {
    outline: none;
}
</style>
