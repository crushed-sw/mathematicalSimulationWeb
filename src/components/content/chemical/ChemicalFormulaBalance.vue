<template>
    <div class="w-full h-full">
        <v-stage
            :width="900"
            :height="900"
        >
            <v-layer>
                <v-circle
                    v-for="point in points"
                    :x="point.x"
                    :y="point.y"
                    :radius="4"
                    :fill="'red'"
                ></v-circle>

                <v-path
                    :data="data"
                    :stroke="'red'"
                    :strokeWidth="2"
                ></v-path>
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts" setup>
import { getBezierControlPointC } from "@/util/mathUtil"

let points = [
    {
        x: 100,
        y: 100,
    },
    {
        x: 300,
        y: 200,
    },
    {
        x: 500,
        y: 200,
    },
    {
        x: 700,
        y: 100,
    },
]

const result = getBezierControlPointC(points);

const data=`M 100 100 C ${result[0].x} ${result[0].y}, ${result[1].x} ${result[1].y}, 700 100`;
</script>

<style lang="scss" scoped>

</style>
