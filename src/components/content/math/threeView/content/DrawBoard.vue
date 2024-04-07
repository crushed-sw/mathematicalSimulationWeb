<template>
    <div
        tabindex="1"
        @contextmenu="rightClick"
        @focus="focus"
        @blur="blur"
        @keydown="keyDown"
        @keyup="keyUp"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
        class="h-full w-full overflow-hidden border-3 stage-container relative"
        :class="{ 'focus-style': isFocus, 'surface-border': !isFocus }"
    >
        <v-stage
            :x="0"
            :y="0"
            :width="width"
            :height="height"
            @click="click"
            @mousemove="mouseMove"
        >
            <v-layer>
                <RoundRectangle
                    :width="width"
                    :height="height"
                    :attr="attr"
                ></RoundRectangle>

                <Point :x="pointConfig.x" :y="pointConfig.y" :visible="pointConfig.visible"></Point>

                <Line :points="lineConfig.points" :visible="lineConfig.visible" :stroke="'rgba(0, 0, 0, 1)'"></Line>
                <Point :x="lineConfig.points[0]" :y="lineConfig.points[1]" :visible="lineConfig.visible"></Point>
                <Point :x="lineConfig.points[2]" :y="lineConfig.points[3]" :visible="lineConfig.visible"></Point>

                <DashLine :points="dashConfig.points" :visible="dashConfig.visible"></DashLine>
                <Point :x="dashConfig.points[0]" :y="dashConfig.points[1]" :visible="dashConfig.visible"></Point>
                <Point :x="dashConfig.points[2]" :y="dashConfig.points[3]" :visible="dashConfig.visible"></Point>
            </v-layer>

            <v-layer ref="layer">
                <Line v-for="line in store[props.attr + 'LineList']" :={...line}></Line>
                <DashLine v-for="dash in store[props.attr + 'DashList']" :={...dash}></DashLine>
                <Point v-for="point in store[props.attr + 'PointList']" :={...point}></Point>

                <v-rect ref="selected" :={...selectedConfig}></v-rect>
            </v-layer>
        </v-stage>
        <ShowState
            :stateValue="drawConfig.value"
        ></ShowState>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue"
import { useThreeViewStore, State, DrawBoardState, pointConfig, lineConfig, dashConfig } from "@/stores/threeViewStore.ts"
import ShowState from "./ShowState.vue"
import Point from "./baseShape/Point.vue"
import Line from "./baseShape/Line.vue"
import DashLine from "./baseShape/DashLine.vue"
import RoundRectangle from "./baseShape/RoundRectangle.vue"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    attr: {
        type: String,
        required: true,
    }
});

const store = useThreeViewStore();
const isFocus = ref(false);

const layer = ref();
const selected = ref();

const angleConfig = {
    type: State.None,
    isAngle: false,
    angleValue: 0,
    id: [],
};

const lengthConfig = {
    type: State.None,
    isLen: false,
    lenValue: 0,
    id: [],
}

const pointConfig = reactive({
    x: 0,
    y: 0,
    leaves: 0,
    visible: false,
    radius: 3,
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 1,
    fill: "rgba(255, 0, 0, 1)",
    hitStrokeWidth: 5,
});

const lineConfig = reactive({
    points: [0, 0, 0, 0],
    leaves: [0, 0],
    visible: false,
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 1,
    fill: "rgba(255, 0, 0, 1)",
    hitStrokeWidth: 5,
});

const dashConfig = reactive({
    points: [0, 0, 0, 0],
    leaves: [0, 0],
    dash: [10, 5],
    visible: false,
    stroke: "rgba(0, 0, 0, 1)",
    strokeWidth: 1,
    fill: "rgba(255, 0, 0, 1)",
    hitStrokeWidth: 5,
});

const drawConfig = reactive({
    state: State.None,
    value: "none",
    clickTimes: 0,
});

const selectedConfig = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    fill: "rgba(0, 0, 0, 0.2)",
    stroke: "rgba(0, 0, 255, 1)",
    strokeWidth: 1,
});

const dragConfig = reactive({
    x: 0,
    y: 0,
});

function resetDrawConfig() {
    setDrawConfig(State.None, 0);
    pointConfig.visible = false;
    lineConfig.visible = false;
    dashConfig.visible = false;

    lengthConfig.isLen = false;
    angleConfig.isAngle = false;
}

function setDrawConfig(state: State, clickNumber: number) {
    drawConfig.state = state;
    drawConfig.clickTimes = clickNumber;
    switch(state) {
        case State.None:
            drawConfig.value = "none";
            break;
        case State.Line:
            drawConfig.value = "line";
            break;
        case State.MultiLine:
            drawConfig.value = "multi-line";
            break;
        case State.Dash:
            drawConfig.value = "dash";
            break;
        case State.MultiDash:
            drawConfig.value = "multi-dash";
            break;
        case State.Point:
            drawConfig.value = "point";
            break;
        case State.MultiPoint:
            drawConfig.value = "multi-point";
            break;
    }

    if(state !== State.None) {
        store[props.attr + "Global"].drawing = true;
    } else {
        store[props.attr + "Global"].drawing = false;
    }
}

function keyUp(event: any) {
    if(event.key === "Control") {
        store.global.ctrl = false;
    } else if(event.key === "Shift") {
        store.global.shift = false;
    }
}

function keyDown(event: any) {
    if(event.key === "Control") {
        store.global.ctrl = true;
    } else if(event.key === "Shift") {
        store.global.shift = true;
    } else if(event.key === "Escape") {
        resetDrawConfig();
    } else if(event.key === "Backspace") {
        if(lengthConfig.isLen) {
            lengthConfig.lenValue /= 10;
            lengthConfig.lenValue = parseInt(String(lengthConfig.lenValue));
            drawConfig.value = "set length " + lengthConfig.lenValue;
        } else if(angleConfig.isAngle) {
            angleConfig.angleValue /= 10;
            angleConfig.angleValue = parseInt(String(angleConfig.angleValue));
            drawConfig.value = "set angle " + angleConfig.angleValue;
        } else {
            store[props.attr + "Global"].clicked.forEach((index: number) => {
                store.deleteShape(index, props.attr);
            });
        }
    } else if(event.key === "Delete") {
        store[props.attr + "Global"].clicked.forEach((index: number) => {
            store.deleteShape(index, props.attr);
        });
    } else if(event.key === "Enter") {
        if(lengthConfig.isLen) {
            store.changeLength(lengthConfig.id, lengthConfig.lenValue, lengthConfig.type, props.attr);
        } else if(angleConfig.isAngle) {
            store.changeAngle(angleConfig.id, angleConfig.angleValue, angleConfig.type, props.attr);
        }
        resetDrawConfig();
    }

    if(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
        if(lengthConfig.isLen) {
            lengthConfig.lenValue *= 10;
            lengthConfig.lenValue += Number(event.key);
            drawConfig.value = "set length " + lengthConfig.lenValue;
        } else if(angleConfig.isAngle) {
            angleConfig.angleValue *= 10;
            angleConfig.angleValue += Number(event.key);
            drawConfig.value = "set angle " + angleConfig.angleValue;
        } else {
            if(store[props.attr + "Global"].clicked.length === 1) {
                store.changeHelper(store[props.attr + "Global"].clicked[0], Number(event.key), props.attr);
            }
        }
    }

    if(event.key === "a") {
        if(store[props.attr + "Global"].clicked.length === 2) {
            const line1 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[0]);
            const line2 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[1]);

            if((line1 === State.Line || line1 === State.Dash) && (line2 === State.Line || line2 === State.Dash)) {
                angleConfig.type = State.Line;
                angleConfig.isAngle = true;
                angleConfig.angleValue = 0;
                angleConfig.id = [store[props.attr + "Global"].clicked[0], store[props.attr + "Global"].clicked[1]];
                drawConfig.value = "set angle";
            }
        } else if(store[props.attr + "Global"].clicked.length === 3) {
            const point1 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[0]);
            const point2 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[1]);
            const point3 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[2]);

            if(point1 === State.Point && point2 === State.Point && point3 === State.Point) {
                angleConfig.type = State.Point;
                angleConfig.isAngle = true;
                angleConfig.angleValue = 0;
                angleConfig.id = [...store[props.attr + "Global"].clicked];
                drawConfig.value = "set angle";
            }
        }
    } else if(event.key === "l") {
        if(store[props.attr + "Global"].clicked.length === 1) {
            const line = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[0]);

            if(line === State.Line || line === State.Dash) {
                lengthConfig.type = State.Line;
                lengthConfig.isLen = true;
                lengthConfig.lenValue = 0;
                lengthConfig.id = [store[props.attr + "Global"].clicked[0]];
                drawConfig.value = "set length";
            }
        } else if(store[props.attr + "Global"].clicked.length === 2) {
            const point1 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[0]);
            const point2 = store.allShape.get(props.attr + store[props.attr + "Global"].clicked[1]);

            if(point1 === State.Point || point2 === State.Point) {
                lengthConfig.type = State.Point;
                lengthConfig.isLen = true;
                lengthConfig.lenValue = 0;
                lengthConfig.id = [...store[props.attr + "Global"].clicked];
                drawConfig.value = "set length";
            }
        } else {
            if(drawConfig.state === State.None) {
                setDrawConfig(State.Line, 2);
                lineConfig.visible = true;
            } else if(drawConfig.state === State.Line) {
                setDrawConfig(State.MultiLine, 2);
                lineConfig.visible = true;
            } else {
                resetDrawConfig();
            }
        }
    } else if(event.key === "d") {
        if(drawConfig.state === State.None) {
            setDrawConfig(State.Dash, 2);
            dashConfig.visible = true;
        } else if(drawConfig.state === State.Dash) {
            setDrawConfig(State.MultiDash, 2);
            dashConfig.visible = true;
        } else {
            resetDrawConfig();
        }
    } else if(event.key === "p") {
        if(drawConfig.state === State.None) {
            pointConfig.visible = true;
            setDrawConfig(State.Point, 1);
        } else if(drawConfig.state === State.Point) {
            pointConfig.visible = true;
            setDrawConfig(State.MultiPoint, 1);
        } else {
            resetDrawConfig();
        }
    }
}

function click(event: any) {
    let x = event.evt.layerX;
    let y = event.evt.layerY;

    if(store[props.attr + "Global"].drawing || store[props.attr + "Global"].moving) {
        if(store[props.attr + "Global"].hover > 0) {
            x = store[props.attr + "Global"].x;
            y = store[props.attr + "Global"].y;
        }
    }

    if(store[props.attr + "Global"].hover === State.None && !store.global.ctrl) {
        store[props.attr + "Global"].clicked = [];
    }

    drawConfig.clickTimes--;
    if(drawConfig.state === State.Point || drawConfig.state === State.MultiPoint) {
        if(drawConfig.clickTimes === 0) {
            store.addPoint(pointConfig.x, pointConfig.y, props.attr, pointConfig.leaves);
        }
    } else if(drawConfig.state === State.Line || drawConfig.state === State.MultiLine) {
        if(drawConfig.clickTimes === 0) {
            store.addLine([...lineConfig.points], [...lineConfig.leaves], props.attr);
        }
    } else if(drawConfig.state === State.Dash || drawConfig.state === State.MultiDash) {
        if(drawConfig.clickTimes === 0) {
            store.addDash([...dashConfig.points], [...dashConfig.leaves], props.attr);
        } else if(drawConfig.clickTimes === 1) {
            dashConfig.points = [x, y, x, y];
            if(store.allShape.get(props.attr + store[props.attr + "Global"].hover) === State.Point) {
                dashConfig.leaves = [store[props.attr + "Global"].hover, 0];
            } else {
                lineConfig.leaves = [0, 0];
            }
            dashConfig.visible = true;
        }
    }

    if(drawConfig.clickTimes === 0) {
        if(drawConfig.state === State.MultiPoint) {
            drawConfig.clickTimes = 1;
        } else if(drawConfig.state === State.MultiLine || drawConfig.state === State.MultiDash) {
            drawConfig.clickTimes = 2;
            lineConfig.visible = false;
            dashConfig.visible = false;
        }
    }

    if(drawConfig.clickTimes === 0) {
        resetDrawConfig();
    }
}

function mouseUp() {
    if(selectedConfig.visible) {
        const selectedNode = selected.value.getNode().getClientRect();
        const arr: number[] = [];
        layer.value.getNode().children.forEach(function(shape: any) {
            const rect = shape.getClientRect();
            if((selectedNode.x < rect.x && selectedNode.y < rect.y) &&
               (selectedNode.x + selectedNode.width > rect.x + rect.width) &&
               (selectedNode.y + selectedNode.height > rect.y + rect.height)) {
                arr.push(shape.attrs.index);
            }
        });

        store[props.attr + "Global"].clicked = arr;

        selectedConfig.visible = false;
        selectedConfig.width = 0;
        selectedConfig.height = 0;
    }

    if(store[props.attr + "Global"].moving) {
        store[props.attr + "Global"].moving = false;
    }
}

function mouseDown(event: any) {
    if(event.button !== 0) return;

    if(store[props.attr + "Global"].hover <= 0 && !store[props.attr + "Global"].drawing) {
        const x = event.layerX;
        const y = event.layerY;

        selectedConfig.visible = true;
        selectedConfig.x = x;
        selectedConfig.y = y;
    } else if(store[props.attr + "Global"].hover > 0 &&
              store[props.attr + "Global"].clicked.length >= 1 &&
              !store[props.attr + "Global"].drawing) {
        store[props.attr + "Global"].moving = true;
        dragConfig.x = event.clientX;
        dragConfig.y = event.clientY;
    }
}

function standardPoint(x: number, y: number) {
    if(store.global.shift) {
        let prev = [-1, -1];
        if(drawConfig.state === State.Line || drawConfig.state === State.MultiLine) {
            if(drawConfig.clickTimes === 1) {
                prev = [lineConfig.points[0], lineConfig.points[1]];
            }
        } else if(drawConfig.state === State.Dash || drawConfig.state === State.MultiDash) {
            if(drawConfig.clickTimes === 1) {
                prev = [dashConfig.points[0], dashConfig.points[1]];
            }
        }

        if(prev[0] === -1 && prev[1] === -1) {
            return [x, y];
        }

        const prevX = prev[0];
        const prevY = prev[1];

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

function mouseMove(event: any) {
    let x = event.evt.layerX;
    let y = event.evt.layerY;

    if(store[props.attr + "Global"].moving) {
        dragHandle(event.evt.clientX, event.evt.clientY);
    }

    if(selectedConfig.visible) {
        selectedConfig.width = x - selectedConfig.x;
        selectedConfig.height = y - selectedConfig.y;
    }

    if(store[props.attr + "Global"].drawing) {
        if(store[props.attr + "Global"].hover > 0 || store[props.attr + "Global"].hover === -1) {
            x = store[props.attr + "Global"].x;
            y = store[props.attr + "Global"].y;
        }
    }

    const point = standardPoint(x, y);
    x = point[0];
    y = point[1];

    pointConfig.x = x;
    pointConfig.y = y;

    if(drawConfig.state === State.Point || drawConfig.state === State.MultiPoint) {
        pointConfig.leaves = store[props.attr + "Global"].hover;
    } else if(drawConfig.state === State.Line || drawConfig.state === State.MultiLine) {
        if(drawConfig.clickTimes === 1) {
            if(store.allShape.get(props.attr + store[props.attr + "Global"].hover) === State.Point) {
                lineConfig.leaves[1] = store[props.attr + "Global"].hover;
            } else {
                lineConfig.leaves[1] = 0;
            }

            lineConfig.points[2] = x;
            lineConfig.points[3] = y;
        } else if(drawConfig.clickTimes === 2) {
            if(store.allShape.get(props.attr + store[props.attr + "Global"].hover) === State.Point) {
                lineConfig.leaves[0] = store[props.attr + "Global"].hover;
            } else {
                lineConfig.leaves[0] = 0;
            }

            lineConfig.points = [x, y, x, y];
        }
    } else if(drawConfig.state === State.Dash || drawConfig.state === State.MultiDash) {
        if(drawConfig.clickTimes === 1) {
            if(store.allShape.get(props.attr + store[props.attr + "Global"].hover) === State.Point) {
                dashConfig.leaves[1] = store[props.attr + "Global"].hover;
            } else {
                dashConfig.leaves[1] = 0;
            }

            dashConfig.points[2] = x;
            dashConfig.points[3] = y;
        } else if(drawConfig.clickTimes === 2) {
            if(store.allShape.get(props.attr + store[props.attr + "Global"].hover) === State.Point) {
                dashConfig.leaves[0] = store[props.attr + "Global"].hover;
            } else {
                dashConfig.leaves[0] = 0;
            }

            dashConfig.points = [x, y, x, y];
        }
    }
}

function focus() {
    isFocus.value = true;
    if(props.attr === "font") {
        store.drawBoardState = DrawBoardState.Font;
    } else if(props.attr === "left") {
        store.drawBoardState = DrawBoardState.Left;
    } else if(props.attr === "top") {
        store.drawBoardState = DrawBoardState.Top;
    }
}

function blur() {
    isFocus.value = false;
    store.drawBoardState = DrawBoardState.None;
    store[props.attr + "Global"].clicked = [];
    store[props.attr + "Global"].hover = 0;
    store[props.attr + "Global"].hoverState = State.None;
    resetDrawConfig();
}

const maskSet: Set<number> = new Set();
watch(() => store[props.attr + "Global"].clicked, () => {
    const tempSet = new Set(maskSet);
    store[props.attr + "Global"].clicked.forEach((index: number) => {
        const state = store.allShape.get(`${props.attr}${index}`);
        if(state) {
            if(!tempSet.has(index)) {
                maskSet.add(index);
            } else {
                tempSet.delete(index);
            }

            switch(state) {
                case State.Point:
                    const pointList = store.getPointList(props.attr);
                    if(pointList) {
                        const point = store.getPoint(index, pointList);
                        if(point) {
                            point.mask = true;
                        }
                    }
                    break;
                case State.Line:
                    const lineList = store.getLineList(props.attr);
                    if(lineList) {
                        const line = store.getLine(index, lineList);
                        if(line) {
                            line.mask = true;
                        }
                    }
                    break;
                case State.Dash:
                    const dashList = store.getDashList(props.attr);
                    if(dashList) {
                        const dash = store.getDash(index, dashList);
                        if(dash) {
                            dash.mask = true;
                        }
                    }
                    break;
            }
        }
    });

    tempSet.forEach((index: number) => {
        const state = store.allShape.get(`${props.attr}${index}`);
        if(state) {
            switch(state) {
                case State.Point:
                    const list = store.getPointList(props.attr);
                    if(list) {
                        const point = store.getPoint(index, list);
                        if(point) {
                            point.mask = false;
                        }
                    }
                break;
            case State.Line:
                const lineList = store.getLineList(props.attr);
                if(lineList) {
                    const line = store.getLine(index, lineList);
                    if(line) {
                        line.mask = false;
                    }
                }
                break;
            case State.Dash:
                const dashList = store.getDashList(props.attr);
                if(dashList) {
                    const dash = store.getDash(index, dashList);
                    if(dash) {
                        dash.mask = false;
                    }
                }
                break;
            }
        }
    });
}, {deep: true});

function rightClick(event: any) {
    event.preventDefault();
    resetDrawConfig();
}

function dragHandle(x: number, y: number) {
    const dx = x - dragConfig.x;
    const dy = y - dragConfig.y;

    const set: Set<number> = new Set();

    store[props.attr + "Global"].clicked.forEach((index: number) => {
        const state = store.allShape.get(props.attr + index);
        switch(state) {
            case State.Point:
                set.add(index);
                break;
            case State.Line:
                store[props.attr + "LineList"].forEach((line: lineConfig) => {
                    if(line.index === index) {
                        line.leaves.forEach((leave: number) => {
                            set.add(leave);
                        });
                    }
                });
                break;
            case State.Dash:
                store[props.attr + "DashList"].forEach((line: lineConfig) => {
                    if(line.index === index) {
                        line.leaves.forEach((leave: number) => {
                            set.add(leave);
                        });
                    }
                });
                break;
        }
    });

    set.forEach((index: number) => {
        const list = store.getPointList(props.attr);
        if(list) {
            const point = store.getPoint(index, list);
            if(point) {
                point.x += dx;
                point.y += dy;
            }
        }
    });

    set.forEach((index: number) => {
        const list = store.getPointList(props.attr);
        if(list) {
            const point = store.getPoint(index, list);
            if(point) {
                point.callBack();
            }
        }
    });

    dragConfig.x = x;
    dragConfig.y = y;
}
</script>

<style lang="scss" scoped>
.stage-container:focus {
    outline: none;
}

.focus-style {
    border-color: "rgba(0, 0, 0, 1)";
}
</style>
