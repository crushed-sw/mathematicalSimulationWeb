<template>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import { useFunctionCanvasStore, implicitFunctionConfig } from "@/stores/functionCanvasStore"

const props = defineProps({
    zoomFlag: {
        type: Boolean,
        required: true,
    },
    dragFlag: {
        type: Boolean,
        required: true,
    },
});

const store = useFunctionStore();
const canvasStore = useFunctionCanvasStore();

const implicitFunctionMap = new Map<number, string>;

function isInScope(line: number[][], xScope: number[], yScope: number[]) {
    const xMax = Math.max(line[0][0], line[1][0]);
    const xMin = Math.min(line[0][0], line[1][0]);
    const yMax = Math.max(line[0][1], line[1][1]);
    const yMin = Math.min(line[0][1], line[1][1]);

    if(xMax < xScope[0] || xMin > xScope[1] || yMax < yScope[0] || yMin > yScope[1]) {
        return false;
    }

    return true;
}

function getMarchingSquaresPoints(leftTop: number[], rightTop: number[], leftBottom: number[], rightBottom: number[], item: any) {
    const currentPoint = [leftTop, rightTop, leftBottom, rightBottom, [item.interval]];
    if((leftTop[2] > 0 && rightTop[2] <= 0 && leftBottom[2] <= 0 && rightBottom[2] <= 0) ||
       (leftTop[2] <= 0 && rightTop[2] > 0 && leftBottom[2] > 0 && rightBottom[2] > 0)) {
        const leftValue = [leftBottom[0], leftTop[1] - leftTop[2] * ((leftTop[1] - leftBottom[1]) / (leftTop[2] - leftBottom[2]))];
        const topValue = [leftTop[0] - leftTop[2] * ((leftTop[0] - rightTop[0]) / (leftTop[2] - rightTop[2])), leftTop[1]];
        return [[leftValue, topValue, ...currentPoint]];
    } else if((leftTop[2] <= 0 && rightTop[2] <= 0 && leftBottom[2] <= 0 && rightBottom[2] > 0) ||
              (leftTop[2] > 0 && rightTop[2] > 0 && leftBottom[2] > 0 && rightBottom[2] <= 0)) {
        const rightValue = [rightBottom[0], rightTop[1] - rightTop[2] * ((rightTop[1] - rightBottom[1]) / (rightTop[2] - rightBottom[2]))];
        const bottomValue = [leftBottom[0] - leftBottom[2] * ((leftBottom[0] - rightBottom[0]) / (leftBottom[2] - rightBottom[2])), leftBottom[1]];
        return [[rightValue, bottomValue, ...currentPoint]];
    } else if((leftTop[2] <= 0 && rightTop[2] > 0 && leftBottom[2] <= 0 && rightBottom[2] <= 0) ||
              (leftTop[2] > 0 && rightTop[2] <= 0 && leftBottom[2] > 0 && rightBottom[2] > 0)) {
        const rightValue = [rightBottom[0], rightTop[1] - rightTop[2] * ((rightTop[1] - rightBottom[1]) / (rightTop[2] - rightBottom[2]))];
        const topValue = [leftTop[0] - leftTop[2] * ((leftTop[0] - rightTop[0]) / (leftTop[2] - rightTop[2])), leftTop[1]];
        return [[rightValue, topValue, ...currentPoint]];
    } else if((leftTop[2] <= 0 && rightTop[2] <= 0 && leftBottom[2] > 0 && rightBottom[2] <= 0) ||
              (leftTop[2] > 0 && rightTop[2] > 0 && leftBottom[2] <= 0 && rightBottom[2] > 0)) {
        const leftValue = [leftBottom[0], leftTop[1] - leftTop[2] * ((leftTop[1] - leftBottom[1]) / (leftTop[2] - leftBottom[2]))];
        const bottomValue = [leftBottom[0] - leftBottom[2] * ((leftBottom[0] - rightBottom[0]) / (leftBottom[2] - rightBottom[2])), leftBottom[1]];
        return [[leftValue, bottomValue, ...currentPoint]];
    } else if((leftTop[2] > 0 && rightTop[2] <= 0 && leftBottom[2] > 0 && rightBottom[2] <= 0) ||
              (leftTop[2] <= 0 && rightTop[2] > 0 && leftBottom[2] <= 0 && rightBottom[2] > 0)) {
        const topValue = [leftTop[0] - leftTop[2] * ((leftTop[0] - rightTop[0]) / (leftTop[2] - rightTop[2])), leftTop[1]];
        const bottomValue = [leftBottom[0] - leftBottom[2] * ((leftBottom[0] - rightBottom[0]) / (leftBottom[2] - rightBottom[2])), leftBottom[1]];
        return [[topValue, bottomValue, ...currentPoint]];
    } else if((leftTop[2] > 0 && rightTop[2] > 0 && leftBottom[2] <= 0 && rightBottom[2] <= 0) ||
              (leftTop[2] <= 0 && rightTop[2] <= 0 && leftBottom[2] > 0 && rightBottom[2] > 0)) {
        const leftValue = [leftBottom[0], leftTop[1] - leftTop[2] * ((leftTop[1] - leftBottom[1]) / (leftTop[2] - leftBottom[2]))];
        const rightValue = [rightBottom[0], rightTop[1] - rightTop[2] * ((rightTop[1] - rightBottom[1]) / (rightTop[2] - rightBottom[2]))];
        return [[leftValue, rightValue, ...currentPoint]];
    } else if(leftTop[2] > 0 && rightTop[2] <= 0 && leftBottom[2] <= 0 && rightBottom[2] > 0) {
        const leftValue = [leftBottom[0], leftTop[1] - leftTop[2] * ((leftTop[1] - leftBottom[1]) / (leftTop[2] - leftBottom[2]))];
        const rightValue = [rightBottom[0], rightTop[1] - rightTop[2] * ((rightTop[1] - rightBottom[1]) / (rightTop[2] - rightBottom[2]))];
        const topValue = [leftTop[0] - leftTop[2] * ((leftTop[0] - rightTop[0]) / (leftTop[2] - rightTop[2])), leftTop[1]];
        const bottomValue = [leftBottom[0] - leftBottom[2] * ((leftBottom[0] - rightBottom[0]) / (leftBottom[2] - rightBottom[2])), leftBottom[1]];

        const middleValue = [(leftTop[0] + rightBottom[0]) / 2, (leftTop[1] + rightBottom[1]) / 2];
        middleValue.push(item.func(...middleValue));
        currentPoint.push([1]);

        if(middleValue[2] > 0) {
            const leftBottomMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - leftBottom[0]) / (middleValue[2] - leftBottom[2])),
                                      middleValue[1] - middleValue[2] * ((middleValue[1] - leftBottom[1]) / (middleValue[2] - leftBottom[2]))];
            const rightTopMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - rightTop[0]) / (middleValue[2] - rightTop[2])),
                                    middleValue[1] - middleValue[2] * ((middleValue[1] - rightTop[1]) / (middleValue[2] - rightTop[2]))];
            return [[leftValue, leftBottomMiddle, ...currentPoint], [leftBottomMiddle, bottomValue, ...currentPoint],
                    [rightValue, rightTopMiddle, ...currentPoint], [rightTopMiddle, topValue, ...currentPoint]];
        } else {
            const leftTopMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - leftTop[0]) / (middleValue[2] - leftTop[2])),
                                   middleValue[1] - middleValue[2] * ((middleValue[1] - leftTop[1]) / (middleValue[2] - leftTop[2]))];
            const rightBottomMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - rightBottom[0]) / (middleValue[2] - rightBottom[2])),
                                       middleValue[1] - middleValue[2] * ((middleValue[1] - rightBottom[1]) / (middleValue[2] - rightBottom[2]))];
            return [[leftValue, leftTopMiddle, ...currentPoint], [leftTopMiddle, topValue, ...currentPoint],
                    [rightValue, rightBottomMiddle, ...currentPoint], [rightBottomMiddle, bottomValue, ...currentPoint]];
        }
    } else if(leftTop[2] <= 0 && rightTop[2] > 0 && leftBottom[2] > 0 && rightBottom[2] <= 0) {
        const leftValue = [leftBottom[0], leftTop[1] - leftTop[2] * ((leftTop[1] - leftBottom[1]) / (leftTop[2] - leftBottom[2]))];
        const rightValue = [rightBottom[0], rightTop[1] - rightTop[2] * ((rightTop[1] - rightBottom[1]) / (rightTop[2] - rightBottom[2]))];
        const topValue = [leftTop[0] - leftTop[2] * ((leftTop[0] - rightTop[0]) / (leftTop[2] - rightTop[2])), leftTop[1]];
        const bottomValue = [leftBottom[0] - leftBottom[2] * ((leftBottom[0] - rightBottom[0]) / (leftBottom[2] - rightBottom[2])), leftBottom[1]];

        const middleValue = [(leftTop[0] + rightBottom[0]) / 2, (leftTop[1] + rightBottom[1]) / 2];
        middleValue.push(item.func(...middleValue));
        currentPoint.push([1]);

        if(middleValue[2] > 0) {
            const leftTopMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - leftTop[0]) / (middleValue[2] - leftTop[2])),
                                   middleValue[1] - middleValue[2] * ((middleValue[1] - leftTop[1]) / (middleValue[2] - leftTop[2]))];
            const rightBottomMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - rightBottom[0]) / (middleValue[2] - rightBottom[2])),
                                       middleValue[1] - middleValue[2] * ((middleValue[1] - rightBottom[1]) / (middleValue[2] - rightBottom[2]))];
            return [[leftValue, leftTopMiddle, ...currentPoint], [leftTopMiddle, topValue, ...currentPoint],
                    [rightValue, rightBottomMiddle, ...currentPoint], [rightBottomMiddle, bottomValue, ...currentPoint]];
        } else {
            const leftBottomMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - leftBottom[0]) / (middleValue[2] - leftBottom[2])),
                                      middleValue[1] - middleValue[2] * ((middleValue[1] - leftBottom[1]) / (middleValue[2] - leftBottom[2]))];
            const rightTopMiddle = [middleValue[0] - middleValue[2] * ((middleValue[0] - rightTop[0]) / (middleValue[2] - rightTop[2])),
                                    middleValue[1] - middleValue[2] * ((middleValue[1] - rightTop[1]) / (middleValue[2] - rightTop[2]))];
            return [[leftValue, leftBottomMiddle, ...currentPoint], [leftBottomMiddle, bottomValue, ...currentPoint],
                    [rightValue, rightTopMiddle, ...currentPoint], [rightTopMiddle, topValue, ...currentPoint]];
        }
    }

    return [] as number[][][];
}

function isLineIn(leftTop: number, rightTop: number, leftBottom: number, rightBottom: number) {
    if(leftTop === 0 || rightTop === 0 || leftBottom === 0 || rightBottom === 0) {
        return true;
    }

    const leftTopFlag = leftTop > 0;
    const rightTopFlag = rightTop > 0;
    const leftBottomFlag = leftBottom > 0;
    const rightBottomFlag = rightBottom > 0;

    if(leftTopFlag && rightTopFlag && leftBottomFlag && rightBottomFlag) {
        return false;
    }
    if(!leftTopFlag && !rightTopFlag && !leftBottomFlag && !rightBottomFlag) {
        return false;
    }

    return true;
}

function resolveMinSquare(leftTop: number[], rightTop: number[], leftBottom: number[], rightBottom: number[], time: number, item: any) {
    if(time < 3) {
        const middleValue = [(leftTop[0] + rightBottom[0]) / 2, (leftTop[1] + rightBottom[1]) / 2];
        const topValue = [middleValue[0], leftTop[1]];
        const bottomValue = [middleValue[0], leftBottom[1]];
        const leftValue = [leftBottom[0], middleValue[1]];
        const rightValue = [rightBottom[0], middleValue[1]];

        const top = item.func(...topValue);
        const bottom = item.func(...bottomValue);
        const left = item.func(...leftValue);
        const right = item.func(...rightValue);
        const middle = item.func(...middleValue);

        middleValue.push(middle);
        topValue.push(top);
        bottomValue.push(bottom);
        leftValue.push(left);
        rightValue.push(right);

        const result: number[][][] = []
        if(isLineIn(leftTop[2], top, left, middle)) {
            result.push(...resolveMinSquare(leftTop, topValue, leftValue, middleValue, time + 1, item));
        }
        if(isLineIn(top, rightTop[2], middle, right)) {
            result.push(...resolveMinSquare(topValue, rightTop, middleValue, rightValue, time + 1, item));
        }
        if(isLineIn(left, middle, leftBottom[2], bottom)) {
            result.push(...resolveMinSquare(leftValue, middleValue, leftBottom, bottomValue, time + 1, item));
        }
        if(isLineIn(middle, right, bottom, rightBottom[2])) {
            result.push(...resolveMinSquare(middleValue, rightValue, bottomValue, rightBottom, time + 1, item));
        }

        return result;
    } else {
        const result: number[][][] = [];
        if(isLineIn(leftTop[2], rightTop[2], leftBottom[2], rightBottom[2])) {
            result.push(...getMarchingSquaresPoints(leftTop, rightTop, leftBottom, rightBottom, item));
        }
        return result;
    }
}

function resolveContour(contourValue: number[][][], item: any) {
    let tempPoint: number[][][] = [];

    for(let i = 0; i != contourValue.length; ++i) {
        for(let j = 0; j != contourValue[i].length; ++j) {
            if(i > 0 && j > 0) {
                if(isLineIn(contourValue[i - 1][j - 1][2], contourValue[i - 1][j][2],
                            contourValue[i][j - 1][2], contourValue[i][j][2])) {
                    tempPoint.push(...resolveMinSquare(contourValue[i - 1][j - 1], contourValue[i - 1][j],
                                     contourValue[i][j - 1], contourValue[i][j], 1, item));
                }
            }
        }
    }

    return tempPoint;
}

function drawImplicitFunction(id: number) {
    const item = canvasStore.implicitFunctions.get(id);
    const xScope = canvasStore.getXScope();
    const yScope = canvasStore.getYScope();
    let interval = Math.max(xScope[1] - xScope[0], yScope[1] - yScope[0]) / 50;

    if(item) {
        const left = Math.floor(xScope[0] / interval);
        const right = Math.ceil(xScope[1] / interval);
        const bottom = Math.floor(yScope[0] / interval);
        const top = Math.ceil(yScope[1] / interval);

        const leftValue = left * interval;
        const rightValue = right * interval;
        const bottomValue = bottom * interval;
        const topValue = top * interval;

        if(item.interval === 0) {
            item.interval = interval;
            const rowMiddle = Math.floor((left + right) / 2) * interval;

            item.left = rowMiddle;
            item.right = rowMiddle;
            item.top = topValue;
            item.bottom = bottomValue;
        } else if(item.interval / 2 >= interval) {
            const tempPoints: number[][][] = [];
            const pointMap: Map<number, number[]> = new Map();

            item.points.forEach((value: number[][]) => {
                if(value[6][0] / 2 >= interval) {
                    if(value[7]) {
                        if(!pointMap.has(value[2][0])) { pointMap.set(value[2][0], []); }
                        const currentPoint = pointMap.get(value[2][0]);
                        const index = currentPoint?.findIndex((pointY: number) => {
                            return pointY === value[2][1];
                        });
                        if(index === -1) {
                            tempPoints.push(...resolveMinSquare(value[2], value[3], value[4], value[5], 2, item));
                            currentPoint?.push(value[2][1]);
                        }
                    } else {
                        tempPoints.push(...resolveMinSquare(value[2], value[3], value[4], value[5], 2, item));
                    }
                }
            });

            item.left = leftValue;
            item.right = rightValue;
            item.top = topValue;
            item.bottom = bottomValue;
            item.points = tempPoints;
            item.interval /= 2;;
        } else if(item.interval * 2 <= interval) {
            const rowMiddle = Math.floor((left + right) / 2) * interval;

            item.left = rowMiddle;
            item.right = rowMiddle;
            item.top = topValue;
            item.bottom = bottomValue;
            item.interval *= 2;
        }

        interval = item.interval;
        if(xScope[0] < item.left) {
            const tempPoints: number[][][] = [];
            for(let j = item.bottom; j <= item.top + interval; j += interval) {
                const rowPoints: number[][] = [];
                for(let i = item.left; i >= leftValue - interval; i -= interval) {
                    rowPoints.push([i, j, item.func(i, j)]);
                }
                tempPoints.push(rowPoints);
            }

            item.points.push(...resolveContour(tempPoints, item));
            item.left = leftValue;
        }
        if(xScope[1] > item.right) {
            const tempPoints: number[][][] = [];
            for(let j = item.bottom; j <= item.top + interval; j += interval) {
                const rowPoints: number[][] = [];
                for(let i = item.right; i <= rightValue + interval; i += interval) {
                    rowPoints.push([i, j, item.func(i, j)]);
                }
                tempPoints.push(rowPoints);
            }
            item.points.push(...resolveContour(tempPoints, item));
            item.right = rightValue;
        }
        if(yScope[0] < item.bottom) {
            const tempPoints: number[][][] = [];
            for(let j = item.bottom; j >= bottomValue - interval; j -= interval) {
                const rowPoints: number[][] = [];
                for(let i = item.left; i <= item.right + interval; i += interval) {
                    rowPoints.push([i, j, item.func(i, j)]);
                }
                tempPoints.push(rowPoints);
            }
            item.points.push(...resolveContour(tempPoints, item));
            item.bottom = bottomValue;
        }
        if(yScope[1] > item.top) {
            const tempPoints: number[][][] = [];
            for(let j = item.top; j <= topValue + interval; j += interval) {
                const rowPoints: number[][] = [];
                for(let i = item.left; i <= item.right + interval; i += interval) {
                    rowPoints.push([i, j, item.func(i, j)]);
                }
                tempPoints.push(rowPoints);
            }
            item.points.push(...resolveContour(tempPoints, item));
            item.top = topValue;
        }

        const resolvePoints = item.points.filter((point: number[][]) => {
            if(isInScope(point, [item.left, item.right], [item.bottom, item.top])) {
                return point;
            }
        });
        item.points = resolvePoints;

        const points = resolvePoints.map((point: number[][]) => {
            return [canvasStore.xScaleToPx(point[0][0]), canvasStore.yScaleToPx(point[0][1]),
                    canvasStore.xScaleToPx(point[1][0]), canvasStore.yScaleToPx(point[1][1])];
        });

        let lineWidth = 2;
        if(store.focus === item.id) {
            lineWidth = 3;
        }

        item.ctx?.clearRect(0, 0, item.canvas.width, item.canvas.height);
        canvasStore.drawLineSegments(item.ctx, {
            points: points.flat(),
            color: item.color,
            lineWidth,
        });
    }
}

function addImplicitFunction(id: number, func: Function, color: string) {
    const tempNormalCanvas: HTMLCanvasElement = document.createElement("canvas");
    const tempNormalCtx: CanvasRenderingContext2D | null = tempNormalCanvas.getContext("2d");
    tempNormalCanvas.width = canvasStore.canvas.width;
    tempNormalCanvas.height = canvasStore.canvas.height;

    const config = {
        id,
        color,
        contour: [] as number[][],
        points: [] as number[][][],
        interval: 0,
        func,
        canvas: tempNormalCanvas,
        ctx: tempNormalCtx,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    } as implicitFunctionConfig;

    canvasStore.implicitFunctions.set(id, config);

    drawImplicitFunction(id);
    canvasStore.update();
}

function updateImplicitFunction(id: number, func: Function, color: string) {
    canvasStore.implicitFunctions.delete(id);
    addImplicitFunction(id, func, color);
}

function removeImplicitFunction(id: number) {
    canvasStore.implicitFunctions.delete(id);
    canvasStore.update();
}

function resolveImplicitFunction(value: any) {
    const set = new Set(implicitFunctionMap.keys());

    for(let i = 0; i != value.length; ++i) {
        const id = value[i].id;

        if(value[i].isValid) {
            if(!set.has(id)) {
                implicitFunctionMap.set(id, value[i].result.value);

                addImplicitFunction(
                    id,
                    value[i].func,
                    value[i].color,
                );
            } else {
                if(implicitFunctionMap.get(id) !== value[i].result.value) {
                    implicitFunctionMap.set(id, value[i].result.value);

                    updateImplicitFunction(
                        id,
                        value[i].func,
                        value[i].color,
                    );
                }
                set.delete(id);
            }
        }
    }

    set.forEach((id: number) => {
        implicitFunctionMap.delete(id);

        removeImplicitFunction(id);
    });
}

watch(() => store.implicitFunctionLists, (value: any) => {
    resolveImplicitFunction(value);
}, {deep: true});

function updateCanvas() {
    store.updateAllFunctionFlag.implicitFunction = true;
    if(store.updateAllFunctionFlag.commondFunction && store.updateAllFunctionFlag.polarFunction &&
       store.updateAllFunctionFlag.parameterFunction && store.updateAllFunctionFlag.implicitFunction)
    {
        canvasStore.update();
        store.updateAllFunctionFlag.commondFunction = false;
        store.updateAllFunctionFlag.polarFunction = false;
        store.updateAllFunctionFlag.parameterFunction = false;
        store.updateAllFunctionFlag.implicitFunction = false;
    }
}

watch(() => store.focus, (value: any, old: any) => {
    if(value !== -1) {
        drawImplicitFunction(value);
    }
    if(old !== -1) {
        drawImplicitFunction(old);
    }

    updateCanvas();
});

watch([() => props.dragFlag, () => props.zoomFlag], () => {
    canvasStore.implicitFunctions.forEach((value: implicitFunctionConfig, _: number) => {
        drawImplicitFunction(value.id);
    });
    updateCanvas();
});
</script>

<style lang="scss" scoped>
</style>
