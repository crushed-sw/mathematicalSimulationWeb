<template>
    <v-group :type="'otherShapes'">
        <Line v-for="line in store.lineList" :={...line} />
        <LineSegment v-for="lineSegment in store.lineSegmentsList" :={...lineSegment} />
        <Circle v-for="circle in store.circleList" :={...circle} />
        <CircleThreePoints v-for="circle in store.circleThreePointsList" :={...circle} />
        <Ellipse v-for="ellipse in store.ellipseList" :={...ellipse} />
        <EllipseFocus v-for="ellipseFocus in store.ellipseFocusList" :={...ellipseFocus} />
        <Hyperbola v-for="hyperbola in store.hyperbolaList" :={...hyperbola} />
        <HyperbolaFocus v-for="hyperbolaFocus in store.hyperbolaFocusList" :={...hyperbolaFocus} />
        <Parabola v-for="parabola in store.parabolaList" :={...parabola} />
        <ParabolaFocus v-for="parabolaFocus in store.parabolaFocusList" :={...parabolaFocus} />
        <QuadraticBezier v-for="quadraticBezier in store.quadraticBezierList" :={...quadraticBezier} />
        <CubicBezier v-for="cubicBezier in store.cubicBezierList" :={...cubicBezier} />
        <Rectangle v-for="rectangle in store.rectangleList" :={...rectangle} />
        <Square v-for="square in store.squareList" :={...square} />
        <Polygon v-for="polygon in store.polygonList" :={...polygon} />
    </v-group>
    <v-group :type="'points'">
        <Point v-for="point in store.pointList" :={...point} />
    </v-group>
</template>

<script lang="ts" setup>
import { watch } from "vue"
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

import {
    useGeometryStore,
    Types,
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
    polygonConfig,
} from "@/stores/geometryStore"

const store = useGeometryStore();

const maskSet: Set<number> = new Set();

watch(() => store.global, () => {
    const tempSet = new Set(maskSet);
    store.global.clicked.forEach((id: number) => {
        const value = store.allShapes.get(id);
        if(value) {
            if(!tempSet.has(id)) {
                maskSet.add(id);
            } else {
                tempSet.delete(id);
            }

            switch (value) {
                case Types.Point:
                    store.pointList.forEach((point: pointConfig) => {
                        if(point.index === id) {
                            point.isMask = true;
                        }
                    });
                    break;
                case Types.Line:
                    store.lineList.forEach((line: lineConfig) => {
                        if(line.index === id) {
                            line.isMask = true;
                        }
                    });
                    break;
                case Types.LineSegment:
                    store.lineSegmentsList.forEach((lineSegment: lineSegmentsConfig) => {
                        if(lineSegment.index === id) {
                            lineSegment.isMask = true;
                        }
                    });
                    break;
                case Types.Circle:
                    store.circleList.forEach((circle: circleConfig) => {
                        if(circle.index === id) {
                            circle.isMask = true;
                        }
                    });
                    break;
                case Types.CircleThreePoints:
                    store.circleThreePointsList.forEach((circle: circleThreePointsConfig) => {
                        if(circle.index === id) {
                            circle.isMask = true;
                        }
                    });
                    break;
                case Types.Ellipse:
                    store.ellipseList.forEach((ellipse: ellipseConfig) => {
                        if(ellipse.index === id) {
                            ellipse.isMask = true;
                        }
                    });
                    break;
                case Types.EllipseFocus:
                    store.ellipseFocusList.forEach((ellipseFocus: ellipseFocusConfig) => {
                        if(ellipseFocus.index === id) {
                            ellipseFocus.isMask = true;
                        }
                    });
                    break;
                case Types.Hyperbola:
                    store.hyperbolaList.forEach((hyperbola: hyperbolaConfig) => {
                        if(hyperbola.index === id) {
                            hyperbola.isMask = true;
                        }
                    });
                    break;
                case Types.HyperbolaFocus:
                    store.hyperbolaFocusList.forEach((hyperbolaFocus: hyperbolaFocusConfig) => {
                        if(hyperbolaFocus.index === id) {
                            hyperbolaFocus.isMask = true;
                        }
                    });
                    break;
                case Types.Parabola:
                    store.parabolaList.forEach((parabola: parabolaConfig) => {
                        if(parabola.index === id) {
                            parabola.isMask = true;
                        }
                    });
                    break;
                case Types.ParabolaFocus:
                    store.parabolaFocusList.forEach((parabolaFocus: parabolaFocusConfig) => {
                        if(parabolaFocus.index === id) {
                            parabolaFocus.isMask = true;
                        }
                    });
                    break;
                case Types.QuadraticBezier:
                    store.quadraticBezierList.forEach((quadraticBezier: quadraticBezierConfig) => {
                        if(quadraticBezier.index === id) {
                            quadraticBezier.isMask = true;
                        }
                    });
                    break;
                case Types.CubicBezier:
                    store.cubicBezierList.forEach((cubicBezier: cubicBezierConfig) => {
                        if(cubicBezier.index === id) {
                            cubicBezier.isMask = true;
                        }
                    });
                    break;
                case Types.Rectangle:
                    store.rectangleList.forEach((rectangle: rectangleConfig) => {
                        if(rectangle.index === id) {
                            rectangle.isMask = true;
                        }
                    });
                    break;
                case Types.Square:
                    store.squareList.forEach((square: squareConfig) => {
                        if(square.index === id) {
                            square.isMask = true;
                        }
                    });
                    break;
                case Types.Polygon:
                    store.polygonList.forEach((polygon: polygonConfig) => {
                        if(polygon.index === id) {
                            polygon.isMask = true;
                        }
                    });
                    break;
            }
        }
    });

    tempSet.forEach((id: number) => {
        const value = store.allShapes.get(id);
        if(value) {
            maskSet.delete(id);
            switch (value) {
                case Types.Point:
                    store.pointList.forEach((point: pointConfig) => {
                        if(point.index === id) {
                            point.isMask = false;
                        }
                    });
                    break;
                case Types.Line:
                    store.lineList.forEach((line: lineConfig) => {
                        if(line.index === id) {
                            line.isMask = false;
                        }
                    });
                    break;
                case Types.LineSegment:
                    store.lineSegmentsList.forEach((lineSegment: lineSegmentsConfig) => {
                        if(lineSegment.index === id) {
                            lineSegment.isMask = false;
                        }
                    });
                    break;
                case Types.Circle:
                    store.circleList.forEach((circle: circleConfig) => {
                        if(circle.index === id) {
                            circle.isMask = false;
                        }
                    });
                    break;
                case Types.CircleThreePoints:
                    store.circleThreePointsList.forEach((circle: circleThreePointsConfig) => {
                        if(circle.index === id) {
                            circle.isMask = false;
                        }
                    });
                    break;
                case Types.Ellipse:
                    store.ellipseList.forEach((ellipse: ellipseConfig) => {
                        if(ellipse.index === id) {
                            ellipse.isMask = false;
                        }
                    });
                    break;
                case Types.EllipseFocus:
                    store.ellipseFocusList.forEach((ellipseFocus: ellipseFocusConfig) => {
                        if(ellipseFocus.index === id) {
                            ellipseFocus.isMask = false;
                        }
                    });
                    break;
                case Types.Hyperbola:
                    store.hyperbolaList.forEach((hyperbola: hyperbolaConfig) => {
                        if(hyperbola.index === id) {
                            hyperbola.isMask = false;
                        }
                    });
                    break;
                case Types.HyperbolaFocus:
                    store.hyperbolaFocusList.forEach((hyperbolaFocus: hyperbolaFocusConfig) => {
                        if(hyperbolaFocus.index === id) {
                            hyperbolaFocus.isMask = false;
                        }
                    });
                    break;
                case Types.Parabola:
                    store.parabolaList.forEach((parabola: parabolaConfig) => {
                        if(parabola.index === id) {
                            parabola.isMask = false;
                        }
                    });
                    break;
                case Types.ParabolaFocus:
                    store.parabolaFocusList.forEach((parabolaFocus: parabolaFocusConfig) => {
                        if(parabolaFocus.index === id) {
                            parabolaFocus.isMask = false;
                        }
                    });
                    break;
                case Types.QuadraticBezier:
                    store.quadraticBezierList.forEach((quadraticBezier: quadraticBezierConfig) => {
                        if(quadraticBezier.index === id) {
                            quadraticBezier.isMask = false;
                        }
                    });
                    break;
                case Types.CubicBezier:
                    store.cubicBezierList.forEach((cubicBezier: cubicBezierConfig) => {
                        if(cubicBezier.index === id) {
                            cubicBezier.isMask = false;
                        }
                    });
                    break;
                case Types.Rectangle:
                    store.rectangleList.forEach((rectangle: rectangleConfig) => {
                        if(rectangle.index === id) {
                            rectangle.isMask = false;
                        }
                    });
                    break;
                case Types.Square:
                    store.squareList.forEach((square: squareConfig) => {
                        if(square.index === id) {
                            square.isMask = false;
                        }
                    });
                    break;
                case Types.Polygon:
                    store.polygonList.forEach((polygon: polygonConfig) => {
                        if(polygon.index === id) {
                            polygon.isMask = false;
                        }
                    });
                    break;
            }
        }
    });
}, {deep: true});
</script>

<style lang="scss" scoped>
</style>
