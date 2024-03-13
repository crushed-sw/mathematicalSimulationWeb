<template>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useFunctionStore } from "@/stores/functionStore"
import { useFunctionCanvasStore, normalFunctionConfig, customPointConfig, tangentLineConfig } from "@/stores/functionCanvasStore"

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

const normalFunctionMap = new Map<number, string>;
const reverseFunctionMap = new Map<number, string>;
const normalEqualFunctionMap = new Map<number, string>;
const reverseEqualFunctionMap = new Map<number, string>;
const functionScopeMap = new Map<number, number[]>;

const normalPointsMap = new Map<number, Map<number, number[]>>;
const normalTangentLineMap = new Map<number, Map<number, number[]>>;

const tolerance = 0.0001;
const maxIterations = 25;

function findZeroPoints(guess: number, func: Function) {
    let x0 = guess;
    let x1 = guess + 0.0001;
    let iterations = 0;

    while (Math.abs(func(x1)) > tolerance && iterations < maxIterations) {
        const numerator = func(x1) * (x1 - x0);
        const denominator = func(x1) - func(x0);
        const deltaX = -numerator / denominator;
        x0 = x1;
        x1 = x1 + deltaX;
        iterations++;
    }

    if (Math.abs(func(x1)) < tolerance) {
        return x1;
    } else {
        return null;
    }
}

function findAsymptoticPoint(guess: number, func: Function) {
    return findZeroPoints(guess, (x: number) => 1 / func(x));
}

function findExtremumPoint(guess: number, func: Function) {
    return findZeroPoints(guess, (x: number) => computeNumericalGradient(func, x));
}

function computeNumericalGradient(func: Function, point: number, prevValue: number | null = null): number {
    const perturbation = 0.0001;

    const funcValuePlus = func(point + perturbation);
    let partialDerivative = 0;
    if(prevValue === null) {
        partialDerivative = (funcValuePlus - func(point)) / perturbation;
    } else {
        partialDerivative = (funcValuePlus - prevValue) / perturbation;
    }

    return partialDerivative;
}

function dealPoints(points: number[][], scope: number[], reverse : boolean, flag: boolean = false): number[][] {
    let xMin = scope[0];
    let xMax = scope[1];
    let yMin = scope[2];
    let yMax = scope[3];
    let scopeMin = scope[4];
    let scopeMax = scope[5];
    if(!flag) {
        xMin = 2 * scope[0] - scope[1];
        xMax = 2 * scope[1] - scope[0];
        yMin = 2 * scope[2] - scope[3];
        yMax = 2 * scope[3] - scope[2];
    }

    let result :number[][] = [];

    let prevNan = false;
    const length = points.length;
    for(let i = 0; i < length; ++i) {
        const element = points[i];
        const x = points[i][reverse ? 1 : 0];
        const y = points[i][reverse ? 0 : 1];

        if(x >= Math.max(xMin, scopeMin) && x <= Math.min(xMax, scopeMax)) {
            if(isNaN(y)) {
                if(!prevNan) {
                    result.push(reverse ? [NaN, x] : [x, NaN]);
                    prevNan = true;
                }
            } else if(y >= yMin && y <= yMax) {
                result.push(element);
                prevNan = false;
            } else {
                if(i > 0 && i < length - 1) {
                    let reverseFlag = reverse ? 0 : 1;
                    if((points[i - 1][reverseFlag] < yMax && points[i - 1][reverseFlag] > yMin) ||
                       (points[i + 1][reverseFlag] < yMax && points[i + 1][reverseFlag] > yMin)) {
                        if(y > yMax + (yMax - yMin)) {
                            result.push(reverse ? [yMax + (yMax - yMin), x] : [x, yMax + (yMax - yMin)]);
                        } else if(y < yMin - (yMax - yMin)) {
                            result.push(reverse ? [yMin - (yMax - yMin), x] : [x, yMin - (yMax - yMin)]);
                        } else {
                            result.push(element);
                        }
                        prevNan = false;
                    } else {
                        if(!prevNan) {
                            result.push(reverse ? [NaN, x] : [x, NaN]);
                            prevNan = true;
                        }
                    }
                }
            }
        }
    };
    return result;
}

function getSpecialPoints(resultPoints: number[][], func: Function, reverse: boolean, isPoints: boolean) {
    let asymptoticArr = [];
    let zeroArr = [];
    let extremeArr = [];

    let activeFlag = false;
    let diffActiveFlag = false;
    let pointsInit = true;

    for(let i = 0; i < resultPoints.length; ++i) {
        const x = resultPoints[i][reverse ? 1 : 0];
        const y = resultPoints[i][reverse ? 0 : 1];

        if(!isNaN(y)) {
            let into = false;
            if(pointsInit || activeFlag !== (y > 0)) {
                const zeroValue = findZeroPoints(x, func);
                if(zeroValue !== null && !isNaN(zeroValue)) {
                    zeroArr.push(reverse ? [func(zeroValue), zeroValue] : [zeroValue, func(zeroValue)]);
                }

                if(!isPoints) {
                    const asymptoticValue = findAsymptoticPoint(x, func);
                    if(asymptoticValue !== null && !isNaN(asymptoticValue)) {
                        asymptoticArr.push(reverse ? [1 / func(asymptoticValue), asymptoticValue] : [asymptoticValue, 1 / func(asymptoticValue)]);
                    }
                }
                activeFlag = y > 0;
                into = true;
            }

            const diffValue = computeNumericalGradient(func, x, y);
            if(pointsInit || diffActiveFlag !== (diffValue > 0)) {
                const extremeValue = findExtremumPoint(x, func);
                if(extremeValue !== null && !isNaN(extremeValue)) {
                    extremeArr.push(reverse ? [func(extremeValue), extremeValue] : [extremeValue, func(extremeValue)]);
                }
                diffActiveFlag = diffValue > 0;
                into = true;
            }

            if(into) {
                pointsInit = false;
            }
        }
    }

    return [zeroArr, extremeArr, asymptoticArr];
}

function uniqueAndSort(arr: number[][], reverse: boolean) {
    const uniqueArr = arr.reduce((accumulator: number[][], currentNum: number[]) => {
        let found = undefined;
        if(!reverse) {
            found = accumulator.find(num => Math.abs(num[0] - currentNum[0]) < 0.01);
        } else {
            found = accumulator.find(num => Math.abs(num[1] - currentNum[1]) < 0.01);
        }
        if (found === undefined) {
            accumulator.push(currentNum);
        }
        return accumulator;
    }, []);
    uniqueArr.sort((a: number[], b: number[]) => {
        if(reverse) {
            return a[1] - b[1];
        } else {
            return a[0] - b[0];
        }
    });

    return uniqueArr;
}

function dealLinear(point0: number[], point1: number[], value: number, isX: boolean) {
    if(isX) {
        return ((point1[1] - point0[1]) / (point1[0] - point0[0])) * (value - point0[0]) + point0[1];
    } else {
        return ((point1[0] - point0[0]) / (point1[1] - point0[1])) * (value - point0[1]) + point0[0];
    }
}

function drawFocusPoints(ctx: any) {
    const item = canvasStore.singlePoints.get(store.focus);
    const funcItem = canvasStore.normalFunctions.get(store.focus);
    if(item && funcItem) {
        const points: number[] = [];
        item.forEach((point: number[]) => {
            if(point[0] >= funcItem.scope[0] && point[1] <= funcItem.scope[1]) {
                points.push(canvasStore.xScaleToPx(point[0]), canvasStore.yScaleToPx(point[1]));
            }
        });
        canvasStore.drawPoints(ctx, {
            points,
            color: "rgba(175, 175, 175, 1)",
        }, true);
    }
}

function drawLinearFunction(id: number) {
    const item = canvasStore.normalFunctions.get(id);
    const pointItem = canvasStore.singlePoints.get(id);

    const xScope = canvasStore.getXScope();
    const yScope = canvasStore.getYScope();

    if(item && pointItem) {
        const reverse = item.reverse;
        const isPoints = item.equals;

        let points: number[] = [];
        if(item.unknowns.length === 0) {
            const funcValue = item.func();
            if(funcValue >= yScope[0] && funcValue <= yScope[1]) {
                points.push(canvasStore.xScaleToPx(xScope[0]), canvasStore.yScaleToPx(funcValue));
                points.push(canvasStore.xScaleToPx(xScope[1]), canvasStore.yScaleToPx(funcValue));

                pointItem.splice(0, pointItem.length);
                pointItem.push([0, funcValue]);
            }
        } else if((item.unknowns.includes("x") || item.unknowns.includes("y")) && item.unknowns.length === 1) {
            let pointArr: number[][] = [];
            if(reverse) {
                let point1: number[] = [item.func(yScope[0]), yScope[0]];
                let point2: number[] = [item.func(yScope[1]), yScope[1]];
                let point3: number[] = [xScope[0], dealLinear(point1, point2, xScope[0], true)];
                let point4: number[] = [xScope[1], dealLinear(point1, point2, xScope[1], true)];
                pointArr = [point1, point2, point3, point4];
            } else {
                let point1: number[] = [xScope[0], item.func(xScope[0])];
                let point2: number[] = [xScope[1], item.func(xScope[1])];
                let point3: number[] = [dealLinear(point1, point2, yScope[0], false), yScope[0]];
                let point4: number[] = [dealLinear(point1, point2, yScope[1], false), yScope[1]];
                pointArr = [point1, point2, point3, point4];
            }

            pointArr.sort((a: number[], b: number[]): number => {
                if(reverse) {
                    return a[1] - b[1];
                } else {
                    return a[0] - b[0];
                }
            });

            points.push(canvasStore.xScaleToPx(pointArr[1][0]), canvasStore.yScaleToPx(pointArr[1][1]));
            points.push(canvasStore.xScaleToPx(pointArr[2][0]), canvasStore.yScaleToPx(pointArr[2][1]));

            pointItem.splice(0, pointItem.length);
            if(reverse) {
                const y0 = dealLinear(pointArr[1], pointArr[2], 0, true);
                if(!isPoints) {
                    pointItem.push([item.func(0), 0]);
                } else {
                    const valueY = canvasStore.yScaleToPx(y0);
                    points = [0, valueY, canvasStore.canvas.width, valueY];
                }

                if(Math.abs(y0) > 0.0001) {
                    pointItem.push([0, y0]);
                }
            } else {
                const x0 = dealLinear(pointArr[1], pointArr[2], 0, false);
                if(!isPoints) {
                    pointItem.push([0, item.func(0)]);
                } else {
                    const valueX = canvasStore.xScaleToPx(x0);
                    points = [valueX, 0, valueX, canvasStore.canvas.height];
                }
                if(Math.abs(x0) > 0.0001) {
                    pointItem.push([x0, 0]);
                }
            }
        }

        let lineWidth = 2;
        if(store.focus === item.id) {
            lineWidth = 3;
        }
        if(points.length !== 0) {
            item.ctx?.clearRect(0, 0, item.canvas.width, item.canvas.height);
            canvasStore.drawLine(item.ctx, {
                points,
                lineWidth,
                color: item.color
            });
            if(store.focus === item.id) {
                drawFocusPoints(item.ctx);
            }
        }
    }
}

function dragCommonFunction(item: normalFunctionConfig, left: number, right: number, reverse: boolean, func: Function) {
    if(item.right < right) {
        let tempPoints = [];
        let i = 0;
        for(i = item.right + item.interval; i <= right; i += item.interval) {
            tempPoints.push(reverse ? [func(i), i] : [i, func(i)]);
        }

        item.points = [...item.points, ...tempPoints];
        item.right = i - item.interval;
    }
    if(item.left > left) {
        let tempPoints = [];
        let i = 0;
        for(i = item.left - item.interval; i >= left; i -= item.interval) {
            tempPoints.push(reverse ? [func(i), i] : [i, func(i)]);
        }
        tempPoints.reverse();

        item.points = [...tempPoints, ...item.points];
        item.left = i + item.interval;
    }
}

function zoomCommonFunction(item: normalFunctionConfig, interval: number, reverse: boolean, left: number, right: number, lenValue: number) {
    if(interval > item.interval * 2) {
        const tempPoints = item.points.filter((value: number[], index: number) => {
            if(index % 2 === 0) {
                return value;
            }
            if(reverse && value[1] === 0) {
                return value;
            }
            if(!reverse && value[0] === 0) {
                return value;
            }
        });

        const len = tempPoints.length;

        item.points = tempPoints;
        item.interval = item.interval * 2;
        item.left = reverse ? tempPoints[0][1] : tempPoints[0][0];
        item.right = reverse ? tempPoints[len - 1][1] : tempPoints[len - 1][0];
    } else if(interval < item.interval / 2) {
        const tempPoints = [];
        const newInterval = item.interval / 2;

        const newPointsArr: number[][] = item.points.filter((value: number[]) => {
            let currentValue: number;
            if(reverse) {
                currentValue = value[1];
            } else {
                currentValue = value[0];
            }

            if(currentValue >= left - lenValue && currentValue <= right + lenValue) {
                return value;
            }
        });

        const len = newPointsArr.length;
        for(let i = 0; i < len; ++i) {
            tempPoints.push(newPointsArr[i]);
            if(i > 0 && i < len - 1) {
                if(!reverse) {
                    const newX = newPointsArr[i][0] + newInterval;
                    if(newX > newPointsArr[i][0] && newX < newPointsArr[i + 1][0]) {
                        tempPoints.push([newX, item.func(newX)]);
                    }
                } else {
                    const newY = newPointsArr[i][1] + newInterval;
                    if(newY > newPointsArr[i][1] && newY < newPointsArr[i + 1][1]) {
                        tempPoints.push([item.func(newY), newY]);
                    }
                }
            }
        }

        item.points = tempPoints;
        item.interval = item.interval / 2;
    }
}

function drawCommonFunction(id: number, init: boolean = false) {
    const item = canvasStore.normalFunctions.get(id);
    const pointsItem = canvasStore.singlePoints.get(id);

    const xScope = canvasStore.getXScope();
    const yScope = canvasStore.getYScope();

    if (item && pointsItem) {
        const reverse = item.reverse;
        const isPoints = item.equals;
        const func = item.func;

        let lenValue: number;
        let left: number;
        let right: number;
        if(!reverse) {
            lenValue = xScope[1] - xScope[0];
            left = xScope[0];
            right = xScope[1];
        } else {
            lenValue = yScope[1] - yScope[0];
            left = yScope[0];
            right = yScope[1];
        }
        let interval = lenValue / 500;
        if(init) {
            let tempPoints = [];

            let i = 0;
            for(i = left; i <= right; i += interval) {
                if(i - interval < 0 && i > 0) {
                    tempPoints.push(reverse ? [func(0), 0] : [0, func(0)]);
                }
                tempPoints.push(reverse ? [func(i), i] : [i, func(i)]);
            }

            item.points = tempPoints;
            item.interval = interval;
            item.left = reverse ? yScope[0] : xScope[0];
            item.right = i - interval;

            pointsItem.push(reverse ? [func(0), 0] : [0, func(0)]);
        } else {
            zoomCommonFunction(item, interval, reverse, left, right, lenValue);
            dragCommonFunction(item, left, right, reverse, func);
        }

        item.ctx?.clearRect(0, 0, item.canvas.width, item.canvas.height);
        let lineWidth = 2;
        if(store.focus === item.id) {
            lineWidth = 3;
        }

        if(!isPoints) {
            let resultPoints = dealPoints(item.points, reverse ? [...yScope, ...xScope, ...item.scope] :
                                          [...xScope, ...yScope, ...item.scope], reverse, true);
            const specialPoints = getSpecialPoints(resultPoints, func, reverse, isPoints);

            pointsItem.splice(0, pointsItem.length);
            pointsItem.push(reverse ? [func(0), 0] : [0, func(0)]);
            pointsItem.push(...specialPoints[0], ...specialPoints[1]);

            const uniqueArr = uniqueAndSort(specialPoints[2], reverse);
            const newArr: number[][] = [];
            let index = 0;
            let asymIndex = 0;

            if(reverse) {
                while(index < resultPoints.length && asymIndex < uniqueArr.length) {
                    if(resultPoints[index][1] >= uniqueArr[asymIndex][1]) {
                        const left = uniqueArr[asymIndex][1] - 0.001;
                        const right = uniqueArr[asymIndex][1] + 0.001;

                        newArr.push([canvasStore.xScaleToPx(func(left) > 0 ? xScope[1] : xScope[0]),
                                    canvasStore.yScaleToPx(left)]);
                        newArr.push([NaN, canvasStore.yScaleToPx(uniqueArr[asymIndex][1])]);
                        newArr.push([canvasStore.xScaleToPx(func(right) > 0 ? xScope[1] : xScope[0]),
                                    canvasStore.yScaleToPx(right)]);
                        asymIndex++;
                    } else {
                        newArr.push([canvasStore.xScaleToPx(resultPoints[index][0]), canvasStore.yScaleToPx(resultPoints[index][1])]);
                        index++;
                    }
                }
                while(index < resultPoints.length) {
                    newArr.push([canvasStore.xScaleToPx(resultPoints[index][0]), canvasStore.yScaleToPx(resultPoints[index][1])]);
                    index++;
                }
            } else {
                while(index < resultPoints.length && asymIndex < uniqueArr.length) {
                    if(resultPoints[index][0] >= uniqueArr[asymIndex][0]) {
                        const left = uniqueArr[asymIndex][0] - 0.001;
                        const right = uniqueArr[asymIndex][0] + 0.001;

                        newArr.push([canvasStore.xScaleToPx(left),
                                    canvasStore.yScaleToPx(func(left) > 0 ? yScope[1] : yScope[0])]);
                        newArr.push([canvasStore.xScaleToPx(uniqueArr[asymIndex][0]), NaN]);
                        newArr.push([canvasStore.xScaleToPx(right),
                                    canvasStore.yScaleToPx(func(right) > 0 ? yScope[1] : yScope[0])]);
                        asymIndex++;
                    } else {
                        newArr.push([canvasStore.xScaleToPx(resultPoints[index][0]), canvasStore.yScaleToPx(resultPoints[index][1])]);
                        index++;
                    }
                }
                while(index < resultPoints.length) {
                    newArr.push([canvasStore.xScaleToPx(resultPoints[index][0]), canvasStore.yScaleToPx(resultPoints[index][1])]);
                    index++;
                }
            }

            canvasStore.drawLine(item.ctx, {
                points: newArr.flat(),
                lineWidth,
                color: item.color
            });
            if(store.focus === item.id) {
                drawFocusPoints(item.ctx);
            }

        } else {
            let resultPoints = dealPoints(item.points, reverse ? [...yScope, -Infinity, Infinity] :
                                                       [...xScope, -Infinity, Infinity], reverse, true);
            const specialPoints = getSpecialPoints(resultPoints, func, reverse, isPoints);
            const uniqueArr = uniqueAndSort(specialPoints.flat(), reverse);
            pointsItem.splice(0, pointsItem.length);
            const newArr: number[][] = [];

            uniqueArr.forEach((value: number[]) => {
                if(reverse) {
                    if(Math.abs(value[0]) < 0.001) {
                        const y = canvasStore.yScaleToPx(value[1]);
                        newArr.push([0, y]);
                        newArr.push([canvasStore.canvas.width, y]);
                        pointsItem.push([0, value[1]]);
                    }
                } else {
                    if(Math.abs(value[1]) < 0.001) {
                        const x = canvasStore.xScaleToPx(value[0]);
                        newArr.push([x, 0]);
                        newArr.push([x, canvasStore.canvas.height]);
                        pointsItem.push([value[0], 0]);
                    }
                }
            });

            canvasStore.drawLineSegments(item.ctx, {
                points: newArr.flat(),
                lineWidth,
                color: item.color
            });
            if(store.focus === item.id) {
                drawFocusPoints(item.ctx);
            }
        }
    }
}

function initNormalFunctions(id: number) {
    if(!canvasStore.normalFunctions.has(id)) {
        return;
    }

    const item = canvasStore.normalFunctions.get(id);
    if(item?.linear !== 0) {
        drawLinearFunction(id);
    } else {
        drawCommonFunction(id, true);
    }
}

function updateOneNormalFunction(id: number) {
    const item = canvasStore.normalFunctions.get(id);
    if(item) {
        if(item.linear !== 0) {
            drawLinearFunction(item.id);
        } else {
            drawCommonFunction(item.id);
        }
    }
}

function addNormalFunction(
    id: number,
    funcValue: Function,
    linear: number,
    unknowns: string[],
    scope: number[],
    color: string,
    reverse: boolean,
    equals: boolean
) {
    const tempNormalCanvas: HTMLCanvasElement = document.createElement("canvas");
    const tempNormalCtx: CanvasRenderingContext2D | null = tempNormalCanvas.getContext("2d");
    tempNormalCanvas.width = canvasStore.canvas.width;
    tempNormalCanvas.height = canvasStore.canvas.height;

    const config = {
        id,
        color,
        func: funcValue,
        points: [] as number[][],
        canvas: tempNormalCanvas,
        ctx: tempNormalCtx,
        linear,
        unknowns,
        interval: 0,
        left: 0,
        right: 0,
        reverse,
        equals,
        scope
    } as normalFunctionConfig;

    canvasStore.normalFunctions.set(id, config);
    canvasStore.singlePoints.set(id, []);

    initNormalFunctions(id);
    canvasStore.update();
}

function updateNormalFunctionScope(id: number, scope: number[]) {
    const item = canvasStore.normalFunctions.get(id);
    if(item) {
        item.scope = scope;
        updateOneNormalFunction(id);
        canvasStore.update();
    }
}

function updateNormalFunction(
    id: number,
    funcValue: Function,
    linear: number,
    unknowns: string[],
    scope: number[],
    color: string,
    reverse: boolean,
    equals: boolean,
) {
    canvasStore.normalFunctions.delete(id);
    canvasStore.singlePoints.delete(id);
    addNormalFunction(id, funcValue, linear, unknowns, scope, color, reverse, equals);
}

function removeNormalFunction(id: number) {
    canvasStore.normalFunctions.delete(id);
    canvasStore.singlePoints.delete(id);
    canvasStore.update();
}

function resolveNormalFuntion(functionMap: Map<number, string>, value: any, reverse: boolean, equal: boolean) {
    const set = new Set(functionMap.keys());

    for(let i = 0; i != value.length; ++i) {
        const id = value[i].id;

        if(value[i].isValid) {
            if(!set.has(id)) {
                functionMap.set(id, value[i].result.value);
                functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);

                normalPointsMap.set(id, new Map<number, number[]>);
                normalTangentLineMap.set(id, new Map<number, number[]>);

                addNormalFunction(
                    id,
                    value[i].func,
                    value[i].result.linear,
                    Array.from(value[i].variables),
                    value[i].scope,
                    value[i].color,
                    reverse,
                    equal
                );
            } else {
                if(functionMap.get(id) !== value[i].result.value) {
                    functionMap.set(id, value[i].result.value);
                    functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);

                    updateNormalFunction(
                        id,
                        value[i].func,
                        value[i].result.linear,
                        Array.from(value[i].variables),
                        value[i].scope,
                        value[i].color,
                        reverse,
                        equal
                    );
                } else {
                    const scope = functionScopeMap.get(id);
                    if(scope) {
                        if(value[i].scope[0] !== scope[0] || value[i].scope[1] !== scope[1]) {
                            updateNormalFunctionScope(id, value[i].scope);
                            functionScopeMap.set(id, [value[i].scope[0], value[i].scope[1]]);
                        }
                    }
                }
                set.delete(id);
            }
        }
    }

    set.forEach((id: number) => {
        functionMap.delete(id);
        functionScopeMap.delete(id);
        normalPointsMap.delete(id);
        normalTangentLineMap.delete(id);

        removeNormalFunction(id);
        removePoints(id);
        removeTangentLine(id);
    });
}

function addPoint(id: number, x: number, y: number, color: string) {
    if(!canvasStore.customPoints.has(id)) {
        canvasStore.customPoints.set(id, []);
    }

    canvasStore.customPoints.get(id)?.push({x, y, color} as customPointConfig);
    canvasStore.update();
}

function removePoints(id: number) {
    canvasStore.customPoints.delete(id);
    canvasStore.update();
}

function removeOnePoint(id: number, x: number) {
    const index = canvasStore.customPoints.get(id)?.findIndex((point: customPointConfig) => {
        return point.x === x;
    });
    if(index !== undefined && index !== -1) {
        canvasStore.customPoints.get(id)?.splice(index, 1);
    }
    canvasStore.update();
}

function addTangentLine(id: number, x: number, y: number, k: number, b: number, color: string) {
    if(!canvasStore.tangentLine.has(id)) {
        canvasStore.tangentLine.set(id, []);
    }

    canvasStore.tangentLine.get(id)?.push({ x, y, k, b, color } as tangentLineConfig);
    canvasStore.update();
}

function removeTangentLine(id: number) {
    canvasStore.tangentLine.delete(id);
    canvasStore.update();
}

function removeOneTangentLine(id: number, x: number) {
    const index = canvasStore.tangentLine.get(id)?.findIndex((line: tangentLineConfig) => {
        return line.x === x;
    });
    if(index !== undefined && index !== -1) {
        canvasStore.tangentLine.get(id)?.splice(index, 1);
    }
    canvasStore.update();
}

function resolvePoints(value: any, reverse: boolean) {
    value.forEach((funcValue: any) => {
        if(funcValue.isValid) {
            const pointMap = normalPointsMap.get(funcValue.id);
            if(pointMap) {
                const set = new Set(pointMap.keys());
                const hasSet: Set<number> = new Set();

                funcValue.points.forEach((point: any) => {
                    let x = point.x;
                    let y = point.y;
                    if(reverse) {
                        x = point.y;
                        y = point.x;
                    }

                    hasSet.add(x);
                    if(!set.has(x)) {
                        pointMap.set(x, [x, y]);
                        addPoint(funcValue.id, x, y, funcValue.color);
                        set.add(x);
                    } else {
                        const pointValue = pointMap.get(x);
                        if(pointValue) {
                            if(pointValue[1] !== y) {
                                pointMap.delete(x);
                                pointMap.set(x, [x, y]);
                                removeOnePoint(funcValue.id, x);
                                addPoint(funcValue.id, x, y, funcValue.color);
                            }
                        }
                    }
                });

                hasSet.forEach((x: number) => {
                    set.delete(x);
                });

                set.forEach((x: number) => {
                    removeOnePoint(funcValue.id, x);
                    pointMap.delete(x);
                });
            }
        }
    });
}

function resolveTangentLine(value: any, reverse: boolean) {
    value.forEach((funcValue: any) => {
        if(funcValue.isValid) {
            const lineMap = normalTangentLineMap.get(funcValue.id);
            if(lineMap) {
                const set = new Set(lineMap.keys());
                const hasSet: Set<number> = new Set();

                funcValue.tangentLine.forEach((line: any) => {
                    let x = line.x;
                    let y = line.y;
                    let k = line.k;
                    let b = line.b;
                    if(reverse) {
                        x = line.y;
                        y = line.x;
                        k = 1 / line.k;
                        b = -line.b / line.k;
                    }

                    hasSet.add(x);
                    if(!set.has(x)) {
                        lineMap.set(x, [x, y]);
                        addTangentLine(funcValue.id, x, y, k, b, funcValue.color);
                        set.add(x);
                    } else {
                        const pointValue = lineMap.get(x);
                        if(pointValue) {
                            if(pointValue[1] !== y) {
                                lineMap.delete(x);
                                lineMap.set(x, [x, y]);
                                removeOneTangentLine(funcValue.id, x);
                                addTangentLine(funcValue.id, x, y, k, b, funcValue.color);
                            }
                        }
                    }
                });

                hasSet.forEach((x: number) => {
                    set.delete(x);
                });

                set.forEach((x: number) => {
                    removeOneTangentLine(funcValue.id, x);
                    lineMap.delete(x);
                });
            }
        }
    });
}

watch(() => store.normalFunctionLists, (value: any) => {
    resolveNormalFuntion(normalFunctionMap, value, false, false);
    resolvePoints(value, false);
    resolveTangentLine(value, false);
}, {deep: true});

watch(() => store.reverseFunctionLists, (value: any) => {
    resolveNormalFuntion(reverseFunctionMap, value, true, false);
    resolvePoints(value, true);
    resolveTangentLine(value, true);
}, {deep: true});


watch(() => store.normalEqualFunctionLists, (value: any) => {
    resolveNormalFuntion(normalEqualFunctionMap, value, false, true);
}, {deep: true});


watch(() => store.reverseEqualFunctionLists, (value: any) => {
    resolveNormalFuntion(reverseEqualFunctionMap, value, false, true);
}, {deep: true});

function updateCanvas() {
    store.updateAllFunctionFlag.commondFunction = true;
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
        updateOneNormalFunction(value);
    }
    if(old !== -1) {
        updateOneNormalFunction(old);
    }
    updateCanvas();
});

watch([() => props.dragFlag, () => props.zoomFlag], () => {
    canvasStore.normalFunctions.forEach((value: normalFunctionConfig, _: number) => {
        updateOneNormalFunction(value.id);
    });
    updateCanvas();
});
</script>

<style lang="scss" scoped>
</style>
