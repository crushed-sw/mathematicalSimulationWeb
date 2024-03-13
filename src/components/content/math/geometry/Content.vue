<template>
    <div>
        <v-stage :config="stageConfig">
            <v-layer>
                <Circle
                    :={...circle}
                ></Circle>

                <Ellipse
                    :={...ellipse}
                ></Ellipse>

                <Hyperbola
                    :={...hyperbola}
                ></Hyperbola>

                <Line
                    :={...line}
                ></Line>

                <Point
                    :={...point}
                ></Point>
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts" setup>
import Circle from "./content/basicShape/Circle.vue"
import Ellipse from "./content/basicShape/Ellipse.vue"
import Hyperbola from "./content/basicShape/Hyperbola.vue"
import Line from "./content/basicShape/Line.vue"
import Parabola from "./content/basicShape/Parabola.vue"
import Point from "./content/basicShape/Point.vue"
import Rectangle from "./content/basicShape/Rectangle.vue"

let stageConfig = {
    width: 1000,
    height: 1000,
};

const circle = {
    x: 100,
    y: 100,
    radius: 50,
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 2,
    mask: "rgba(255, 0, 0, 1)",
    maskWidth: 4,
    draggable: true,
}

const ellipse = {
    x: 200,
    y: 300,
    radiusX: 100,
    radiusY: 50,
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 2,
    mask: "rgba(255, 0, 0, 1)",
    maskWidth: 4,
    draggable: true,
}

const hyperbola = {
    x: 300,
    y: 500,
    radiusX: 100,
    radiusY: 50,
    fill: "rgba(0, 0, 0, 0)",
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 2,
    mask: "rgba(255, 0, 0, 1)",
    maskWidth: 4,
    draggable: true,
}

const line = {
    points: [500, 100, 700, 100],
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 2,
    mask: "rgba(255, 0, 0, 1)",
    maskWidth: 4,
    draggable: true,
}

const point = {
    x: 100,
    y: 100,
    radius: 4,
    fill: "rgba(255, 0, 0, 1)",
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 2,
    mask: "rgba(255, 0, 0, 1)",
    maskWidth: 2,
    draggable: true,
}
</script>

<style lang="scss" scoped>

</style>
