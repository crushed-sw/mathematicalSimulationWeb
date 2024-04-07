<template>
    <div ref="container" class="bg-white container">
    </div>
</template>

<script lang="ts" setup>
import Matter from "matter-js"

import { onMounted, ref, nextTick } from "vue"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    }
});

type vector = {
    x: number,
    y: number,
}

function getDistance(v1: vector, v2: vector): number {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
}

function getUnitVector(v: vector): vector {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return {
        x: v.x / len,
        y: v.y / len,
    };
}

function getVectorWidthLen(v: vector, len: number): vector {
    const unitVector = getUnitVector(v);
    return {
        x: unitVector.x * len,
        y: unitVector.y * len,
    };
}

function subVector(v1: vector, v2: vector): vector {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
    };
}

const container = ref();
const canvas = ref();
onMounted(() => {
    nextTick(() => {
        const Engine = Matter.Engine,
              Render = Matter.Render,
              Runner = Matter.Runner,
              Bodies = Matter.Bodies,
              Body = Matter.Body,
              Events = Matter.Events,
              Constraint = Matter.Constraint,
              Composite = Matter.Composite;

        const engine = Engine.create();

        const render = Render.create({
            element: container.value,
            engine: engine,
            options: {
                width: props.width,
                height: props.height,
                wireframes: false,
                background: "#ffffff",
            }
        })

        const boxA: Body = Bodies.rectangle(200, 565, 30, 30, {
            friction: 0,
            frictionAir: 0,
            render: {
                fillStyle: "#ff0000",
            }
        });
        const boxB: Body = Bodies.rectangle(100, 565, 30, 30, {
            friction: 0,
            frictionAir: 0,
            render: {
                fillStyle: "#0000ff",
            }
        });
        const ground = Bodies.rectangle(400, 610, 2000, 60, {
            isStatic: true,
            friction: 0,
        });

        Body.setInertia(boxA, Infinity);
        Body.setInertia(boxB, Infinity);

        Body.setMass(boxA, 10);
        Body.setMass(boxB, 10);

        engine.timing.timeScale = 0.5;

        const boxAConfig = {
            velocity: [] as vector[],
            force: [] as vector[],
        };

        const boxBConfig = {
            velocity: [] as vector[],
            force: [] as vector[],
        }

        const springConstraint = {
            bodyA: boxA,
            bodyB: boxB,
            k: 0.01,
            len: 100,
        }

        const constraint = Constraint.create({
            pointA: { x: 0, y: 0 },
            bodyA: boxA,
            pointB: { x: 0, y: 0 },
            bodyB: boxB,
        })

        boxAConfig.velocity.push({ x: 0, y: -10 })
        boxAConfig.force.push({ x: 0, y: 0 })

        boxBConfig.velocity.push({ x: 0, y: 0 });
        boxBConfig.force.push({ x: 0, y: 0 });

        // Body.setVelocity(boxB, boxBConfig.velocity[0])
        Body.setVelocity(boxA, boxAConfig.velocity[0])

        const positions: vector[] = [];
        // Events.on(engine, 'afterUpdate', () => {
        //     Render.startViewTransform(render);
        //     render.context.fillStyle = "rgba(0, 0, 0, 1)";
        //     positions.forEach((v: vector) => {
        //         render.context.fillRect(v.x, v.y, 2, 2);
        //     });
        //     positions.push({ x: boxA.position.x, y: boxA.position.y });
        //     Render.endViewTransform(render);
        // });

        Events.on(engine, 'beforeUpdate', () => {
            // const distance = getDistance(boxA.position, boxB.position);
            // // 根据绳子长度调整约束的长度
            // // console.log(distance);
            // if (distance <= ropeLen) {
            //     constraint.bodyA = null
            //     constraint.bodyB = null;
            // } else {
            //     constraint.bodyA = boxA;
            //     constraint.bodyB = boxB;
            // }

            // const aPosition = boxA.position;
            // const bPosition = boxB.position;

            // const distance = getDistance(aPosition, bPosition);
            // const moreDistance = Math.abs(distance - springConstraint.len);
            // if(moreDistance > 0.0001) {
            //     let springForce = moreDistance * springConstraint.k;
            //     if(distance < springConstraint.len) {
            //         springForce *= -1;
            //     }

            //     const boxAForce = getVectorWidthLen(subVector(bPosition, aPosition), springForce);
            //     const boxBForce = getVectorWidthLen(subVector(aPosition, bPosition), springForce);
            //     boxAConfig.force[0] = boxAForce;
            //     boxBConfig.force[0] = boxBForce
            // }

            // Body.applyForce(boxA, boxA.position, boxAConfig.force[0])
            // Body.applyForce(boxB, boxB.position, boxBConfig.force[0]);
        });

        Composite.add(engine.world, [boxA, boxB, ground, constraint ]);

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
    });
});
</script>

<style lang="scss" scoped>
.container {
    canvas {
        background-color: #ffffff;
    }
}
</style>
