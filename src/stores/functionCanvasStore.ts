import { defineStore } from "pinia";

type normalFunctionConfig = {
    id: number,
    color: string,
    func: Function,
    points: number[][],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D | null,
    linear: number,
    unknowns: string[],
    interval: number,
    left: number,
    right: number,
    reverse: boolean,
    equals: boolean,
    scope: number[],
};

type polarFunctionConfig = {
    id: number,
    color: string,
    points: number[][],
    func: Function,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D | null,
    scope: number[],
    left: number,
    right: number,
}

type parameterFunctionConfig = {
    id: number,
    color: string,
    points: number[][],
    funcX: Function,
    funcY: Function,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D | null,
    scope: number[],
    left: number,
    right: number,
}

type implicitFunctionConfig = {
    id: number,
    color: string,
    contour: number[][],
    points: number[][][],
    interval: number,
    func: Function,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D | null,
    left: number,
    right: number,
    top: number,
    bottom: number,
}

type customPointConfig = {
    color: string,
    x: number,
    y: number,
}

type tangentLineConfig = {
    color: string,
    x: number,
    y: number,
    k: number,
    b: number,
}

type LineConfig = {
    points: any[],
    lineWidth?: number,
    color?: string,
    close?: boolean,
    fill?: boolean,
    dash?: number[],
    globalAlpha?: number
};

type CircleConfig = {
    points: any[],
    lineWidth?: number,
    color?: string,
    close?: boolean,
    fill?: boolean,
    dash?: number[],
    globalAlpha?: number
};

const useFunctionCanvasStore = defineStore("functionCanvasStore", () => {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    let offDrawCanvas: HTMLCanvasElement = document.createElement("canvas");
    let offDrawCtx: CanvasRenderingContext2D | null = offDrawCanvas.getContext("2d");

    let normalFunctionCanvas: HTMLCanvasElement = document.createElement("canvas");
    let normalFunctionCtx: CanvasRenderingContext2D | null = normalFunctionCanvas.getContext("2d");

    let polarFunctionCanvas: HTMLCanvasElement = document.createElement("canvas");
    let polarFunctionCtx: CanvasRenderingContext2D | null = polarFunctionCanvas.getContext("2d");

    let parameterFunctionCanvas: HTMLCanvasElement = document.createElement("canvas");
    let parameterFunctionCtx: CanvasRenderingContext2D | null = parameterFunctionCanvas.getContext("2d");

    let implicitFunctionCanvas: HTMLCanvasElement = document.createElement("canvas");
    let implicitFunctionCtx: CanvasRenderingContext2D | null = implicitFunctionCanvas.getContext("2d");

    let normalFunctions: Map<number, normalFunctionConfig> = new Map();
    let polarFunctions: Map<number, polarFunctionConfig> = new Map();
    let parameterFunctions: Map<number, parameterFunctionConfig> = new Map();
    let implicitFunctions: Map<number, implicitFunctionConfig> = new Map();

    let singlePoints: Map<number, number[][]> = new Map();
    let customPoints: Map<number, customPointConfig[]> = new Map();
    let tangentLine: Map<number, tangentLineConfig[]> = new Map();

    let visiblePoints: number[][] = [];

    let focus = -1;
    let isInit = true;

    let coordinate: number = 1;

    let xMainAxis: number = 0;
    let yMainAxis: number = 0;

    let isXAxis: boolean = true;
    let isYAxis: boolean= true;
    let isMinorAxis: boolean = true;
    let isGride: boolean = true;

    let numberInterval: number = 0;
    let minorNumberInterval: number = 0;

    let xOffset: number = 0;
    let yOffset: number = 0;
    let xMinorOffset: number = 0;
    let yMinorOffset: number = 0;

    let minCircleDistance: number = 0;
    let maxCircleDistance: number = 0;
    let minCircleOffset: number = 0;
    let minMinorCircleOffset: number = 0;

    let xScope = [0, 0];
    let yScope = [0, 0];

    let xRatio = 0;
    let yRatio = 0;

    function getXScope() {
        return xScope;
    }

    function getYScope() {
        return yScope;
    }

    function init(container: HTMLElement) {
        resize(window.innerWidth, window.innerHeight, [0, 0], [0, 0]);
        container.appendChild(canvas);
    }

    function resize(width: number, height: number, xArr: number[], yArr: number[]) {
        canvas.width = width;
        canvas.height = height;

        offDrawCanvas.width = width;
        offDrawCanvas.height = height;

        normalFunctionCanvas.width = width;
        normalFunctionCanvas.height = height;

        polarFunctionCanvas.width = width;
        polarFunctionCanvas.height = height;

        parameterFunctionCanvas.width = width;
        parameterFunctionCanvas.height = height;

        implicitFunctionCanvas.width = width;
        implicitFunctionCanvas.height = height;

        normalFunctions.forEach((value: normalFunctionConfig) => {
            value.canvas.width = width;
            value.canvas.height = height;
        });
        polarFunctions.forEach((value: polarFunctionConfig) => {
            value.canvas.width = width;
            value.canvas.height = height;
        });
        parameterFunctions.forEach((value: parameterFunctionConfig) => {
            value.canvas.width = width;
            value.canvas.height = height;
        });
        implicitFunctions.forEach((value: implicitFunctionConfig) => {
            value.canvas.width = width;
            value.canvas.height = height;
        });

        xScope = [xArr[0], xArr[1]];
        yScope = [yArr[0], yArr[1]];

        xRatio = width / (xScope[1] - xScope[0]);
        yRatio = height / (yScope[1] - yScope[0]);
    }

    function xScaleToPx(numX: number) {
        return xRatio * (numX - xScope[0]);
    }

    function yScaleToPx(numY: number) {
        return yRatio * (yScope[1] - numY);
    }

    function drawLine(tempCtx: CanvasRenderingContext2D | null | undefined, lineConfig: LineConfig) {
        if(tempCtx === undefined) {
            return;
        }

        const points = lineConfig.points;
        if(tempCtx && points.length >= 4) {
            const ctxDash = tempCtx.getLineDash();
            if(lineConfig.dash && lineConfig.dash.length === 2) {
                if(ctxDash.length !== 2 || (ctxDash[0] !== lineConfig.dash[0] && ctxDash[1] !== lineConfig.dash[1])) {
                    tempCtx.setLineDash(lineConfig.dash);
                }
            } else {
                if(ctxDash.length !== 0) {
                    tempCtx.setLineDash([]);
                }
            }
            const alpha = lineConfig.globalAlpha === undefined ? 1 : lineConfig.globalAlpha;
            if(alpha !== tempCtx.globalAlpha) {
                tempCtx.globalAlpha = alpha;
            }

            let flag = false;
            tempCtx.beginPath();
            for(let i = 0; i + 1 < points.length; i += 2) {
                if(points[i + 1] === null || points[i] === null || !isFinite(points[i + 1]) || !isFinite(points[i])) {
                    flag = true;
                } else if(i === 0 || flag) {
                    tempCtx.moveTo(points[i], points[i + 1]);
                    flag = false;
                } else {
                    tempCtx.lineTo(points[i], points[i + 1]);
                }
            }
            if(lineConfig.close) {
                tempCtx.lineTo(points[0], points[1]);
            }

            const lineWidth = lineConfig.lineWidth === undefined ? 1 : lineConfig.lineWidth;
            if(tempCtx.lineWidth !== lineWidth) {
                tempCtx.lineWidth = lineWidth;
            }

            const color = lineConfig.color === undefined ? "rgba(0, 0, 0, 1)" : lineConfig.color;
            if(lineConfig.fill) {
                if(tempCtx.fillStyle !== color) {
                    tempCtx.fillStyle = color;
                }
                tempCtx.fill();
            } else {
                if(tempCtx.strokeStyle !== color) {
                    tempCtx.strokeStyle = color;
                }
                tempCtx.stroke();
            }

            if(tempCtx.globalAlpha !== 1) {
                tempCtx.globalAlpha = 1;
            }
        }
    }

    function drawLineSegments(tempCtx: CanvasRenderingContext2D | null, lineConfig: LineConfig) {
        const points = lineConfig.points;
        if(tempCtx && points.length >= 4) {
            const ctxDash = tempCtx.getLineDash();
            if(lineConfig.dash && lineConfig.dash.length === 2) {
                if(ctxDash.length !== 2 || (ctxDash[0] !== lineConfig.dash[0] && ctxDash[1] !== lineConfig.dash[1])) {
                    tempCtx.setLineDash(lineConfig.dash);
                }
            } else {
                if(ctxDash.length !== 0) {
                    tempCtx.setLineDash([]);
                }
            }

            tempCtx.beginPath();
            for(let i = 0; i + 3 < points.length; i += 4) {
                tempCtx.moveTo(points[i], points[i + 1]);
                tempCtx.lineTo(points[i + 2], points[i + 3]);
            }

            const lineWidth = lineConfig.lineWidth === undefined ? 1 : lineConfig.lineWidth;
            if(tempCtx.lineWidth !== lineWidth) {
                tempCtx.lineWidth = lineWidth;
            }

            const color = lineConfig.color === undefined ? "rgba(0, 0, 0, 1)" : lineConfig.color;
            if(lineConfig.fill) {
                if(tempCtx.fillStyle !== color) {
                    tempCtx.fillStyle = color;
                }
                tempCtx.fill();
            } else {
                if(tempCtx.strokeStyle !== color) {
                    tempCtx.strokeStyle = color;
                }
                tempCtx.stroke();
            }
        }
    }

    function drawCircles(tempCtx: CanvasRenderingContext2D | null, circleConfig: CircleConfig) {
        const points = circleConfig.points;
        if(tempCtx && points.length >= 3) {
            const ctxDash = tempCtx.getLineDash();
            if(circleConfig.dash && circleConfig.dash.length === 2) {
                if(ctxDash.length !== 2 || (ctxDash[0] !== circleConfig.dash[0] && ctxDash[1] !== circleConfig.dash[1])) {
                    tempCtx.setLineDash(circleConfig.dash);
                }
            } else {
                if(ctxDash.length !== 0) {
                    tempCtx.setLineDash([]);
                }
            }

            const alpha = circleConfig.globalAlpha === undefined ? 1 : circleConfig.globalAlpha;
            if(alpha !== tempCtx.globalAlpha) {
                tempCtx.globalAlpha = alpha;
            }

            tempCtx.beginPath();
            for(let i = 0; i + 2 < points.length; i += 3) {
                tempCtx.moveTo(points[i + 0] + points[i + 2], points[i + 1]);
                tempCtx.arc(points[i + 0], points[i + 1], points[i + 2], 0, 2 * Math.PI);
            }

            const lineWidth = circleConfig.lineWidth === undefined ? 1 : circleConfig.lineWidth;
            if(tempCtx.lineWidth !== lineWidth) {
                tempCtx.lineWidth = lineWidth;
            }

            const color = circleConfig.color === undefined ? "rgba(0, 0, 0, 1)" : circleConfig.color;
            if(circleConfig.fill) {
                if(tempCtx.fillStyle !== color) {
                    tempCtx.fillStyle = color;
                }
                tempCtx.fill();
            } else {
                if(tempCtx.strokeStyle !== color) {
                    tempCtx.strokeStyle = color;
                }
                tempCtx.stroke();
            }

            if(tempCtx.globalAlpha !== 1) {
                tempCtx.globalAlpha = 1;
            }
        }
    }

    function drawPoints(tempCtx: CanvasRenderingContext2D | null, circleConfig: CircleConfig, isAdd: boolean) {
        const points = circleConfig.points;
        let tempPoints = [];

        if(isAdd) {
            for(let i = 0; i + 1 < points.length; i += 2) {
                tempPoints.push(points[i], points[i + 1], 5);
            }
        } else {
            tempPoints = points
        }

        circleConfig.points = tempPoints;
        circleConfig.fill = true;

        drawCircles(tempCtx, circleConfig);
    }

    function drawBack() {
        offDrawCtx?.clearRect(0, 0, offDrawCanvas.width, offDrawCanvas.height);
        drawRectangularCoordinate();
        drawPolarCoordinate();
        drawMainAxis();
    }

    function updateZero(dx: number, dy: number, scopeDx: number, distanceX: number, scopeDy: number, distanceY: number, isAdd: boolean = false) {
        if(isAdd) {
            xScope[0] += scopeDx;
            xScope[1] += scopeDx;
            yScope[0] += scopeDy;
            yScope[1] += scopeDy;

            xMainAxis += dx;
            yMainAxis += dy;

            xOffset = (xOffset + dx) % numberInterval;
            yOffset = (yOffset + dy) % numberInterval;

            xMinorOffset = (xMinorOffset + dx) % minorNumberInterval;
            yMinorOffset = (yMinorOffset + dy) % minorNumberInterval;

            const leftMin = Math.abs(xMainAxis);
            const rightMin = Math.abs(yMainAxis);
            const topMin = Math.abs(canvas.width - xMainAxis);
            const bottomMin = Math.abs(canvas.height - yMainAxis);

            const leftTopMax = Math.sqrt(Math.pow(xMainAxis, 2) + Math.pow(yMainAxis, 2));
            const rightTopMax = Math.sqrt(Math.pow(xMainAxis, 2) + Math.pow(canvas.height - yMainAxis, 2));
            const leftBottomMax = Math.sqrt(Math.pow(canvas.width - xMainAxis, 2) + Math.pow(yMainAxis, 2));
            const rightBottomMax = Math.sqrt(Math.pow(canvas.width - xMainAxis, 2) +
                                           Math.pow(canvas.height - yMainAxis, 2));

            minCircleDistance = Math.min(Math.min(leftMin, rightMin), Math.min(topMin, bottomMin));
            maxCircleDistance = Math.max(Math.max(leftTopMax, rightTopMax), Math.max(leftBottomMax, rightBottomMax));

            minCircleOffset = Math.ceil(minCircleDistance / numberInterval) * numberInterval;
            minMinorCircleOffset = Math.ceil(minCircleDistance / minorNumberInterval) * minorNumberInterval;
            if(xMainAxis >= 0 && xMainAxis <= canvas.width &&
               yMainAxis >= 0 && yMainAxis <= canvas.height) {
                minCircleOffset = 0;
                minMinorCircleOffset = 0;
                minCircleDistance = 0;
            }
        } else {
            xMainAxis = dx;
            yMainAxis = dy;

            xScope[0] = scopeDx;
            xScope[1] = distanceX;
            yScope[0] = scopeDy;
            yScope[1] = distanceY;

            xRatio = canvas.width / (xScope[1] - xScope[0]);
            yRatio = canvas.height / (yScope[1] - yScope[0]);
        }
        drawBack();
        if(isInit) {
            update()
            isInit = false;
        }
    }

    function updateScale(minorAxis: boolean, gride: boolean, xAxis: boolean, yAxis: boolean) {
        isMinorAxis = minorAxis;
        isGride = gride;
        isXAxis = xAxis;
        isYAxis = yAxis;
    }

    function updateCircle(minOffset: number, minMinorOffset: number, minDistance: number, maxDistance: number) {
        minCircleOffset = minOffset;
        minMinorCircleOffset = minMinorOffset;
        minCircleDistance = minDistance;
        maxCircleDistance = maxDistance;
    }

    function updateNumberInterval(interval: number, x: number, y: number) {
        numberInterval = interval;
        xOffset = x;
        yOffset = y;
    }

    function updateMinorNumberInterval(interval: number, x: number, y: number) {
        minorNumberInterval = interval;
        xMinorOffset = x;
        yMinorOffset = y;
    }

    function updateCoordinate(value: number) {
        coordinate = value;
    }

    function drawRectangularCoordinate() {
        if(coordinate === 1) {
            if(isGride && numberInterval !== 0) {
                const yAxisPoints = [];
                const xAxisPoints = [];

                for(let i = xOffset; i <= canvas.width; i += numberInterval) {
                    yAxisPoints.push(i, 0, i, canvas.height);
                }
                for(let i = yOffset; i <= canvas.height; i += numberInterval) {
                    xAxisPoints.push(0, i, canvas.width, i);
                }

                drawLineSegments(offDrawCtx, {
                    points: yAxisPoints,
                    lineWidth: 1,
                    color: "rgba(100, 100, 100, 0.5)"
                });
                drawLineSegments(offDrawCtx, {
                    points: xAxisPoints,
                    lineWidth: 1,
                    color: "rgba(100, 100, 100, 0.5)"
                });
            }

            if(isGride && isMinorAxis && minorNumberInterval !== 0) {
                const yAxisPoints = [];
                const xAxisPoints = [];

                for(let i = xMinorOffset; i <= canvas.width; i += minorNumberInterval) {
                    yAxisPoints.push(i, 0, i, canvas.height);
                }
                for(let i = yMinorOffset; i <= canvas.height; i += minorNumberInterval) {
                    xAxisPoints.push(0, i, canvas.width, i);
                }

                drawLineSegments(offDrawCtx, {
                    points: yAxisPoints,
                    lineWidth: 1,
                    color: "rgba(150, 150, 150, 0.3)"
                });
                drawLineSegments(offDrawCtx, {
                    points: xAxisPoints,
                    lineWidth: 1,
                    color: "rgba(150, 150, 150, 0.3)"
                });
            }
        }


    }

    function drawPolarCoordinate() {
        if(coordinate === 2) {
            let lineNumber = 6;
            if(yMainAxis < 0 || yMainAxis > canvas.height) {
                lineNumber += 6;
            }
            if(xMainAxis < 0 || xMainAxis > canvas.width) {
                lineNumber += 6;
            }

            let lineStartAngle = 0;
            let lineEndAngle = 2 * Math.PI;

            if(lineNumber === 12) {
                if(yMainAxis < 0) {
                    lineStartAngle = 0;
                    lineEndAngle = Math.PI;
                } else if(yMainAxis > canvas.height) {
                    lineStartAngle = -Math.PI;
                    lineEndAngle = 0;
                } else if(xMainAxis < 0) {
                    lineStartAngle = -Math.PI * 0.5;
                    lineEndAngle = Math.PI * 0.5;
                } else if(xMainAxis > canvas.width) {
                    lineStartAngle = Math.PI * 0.5;
                    lineEndAngle = Math.PI * 1.5;
                }
            } else if(lineNumber === 18) {
                if(yMainAxis < 0 && xMainAxis < 0) {
                    lineStartAngle = 0;
                    lineEndAngle = Math.PI * 0.5;
                } else if(yMainAxis > canvas.height && xMainAxis < 0) {
                    lineStartAngle = -Math.PI * 0.5;
                    lineEndAngle = 0;
                } else if(yMainAxis < 0 && xMainAxis > canvas.width) {
                    lineStartAngle = Math.PI * 0.5;
                    lineEndAngle = Math.PI;
                } else if(yMainAxis > canvas.height && xMainAxis > canvas.width) {
                    lineStartAngle = -Math.PI;
                    lineEndAngle = -Math.PI * 0.5;
                }
            }

            if(isGride && numberInterval !== 0) {
                const scaleCircle = [];
                for(let i = minCircleOffset; i <= maxCircleDistance; i += numberInterval) {
                    scaleCircle.push(xMainAxis, yMainAxis, i);
                }

                drawCircles(offDrawCtx, {
                    points: scaleCircle,
                    lineWidth: 1,
                    color: "rgba(100, 100, 100, 0.5)"
                });

                if(!isMinorAxis) {
                    const linesPoints = [];

                    const lineInterval = Math.PI / (lineNumber * (0.666666666));

                    for(let i = lineStartAngle; i <= lineEndAngle; i += lineInterval) {
                        linesPoints.push(
                            xMainAxis + minCircleDistance * Math.cos(i),
                            yMainAxis + minCircleDistance * Math.sin(i),
                            xMainAxis + maxCircleDistance * Math.cos(i),
                            yMainAxis + maxCircleDistance * Math.sin(i),
                        );
                    }

                    drawLineSegments(offDrawCtx, {
                        points: linesPoints,
                        lineWidth: 1,
                        color: "rgba(100, 100, 100, 0.5)"
                    });
                }
            }

            if(isGride && isMinorAxis && minorNumberInterval !== 0) {
                const scaleCircle = [];
                const linesPoints = [];

                const lineInterval = Math.PI / (lineNumber * 2);

                for(let i = minMinorCircleOffset; i <= maxCircleDistance; i += minorNumberInterval) {
                    scaleCircle.push(xMainAxis, yMainAxis, i);
                }
                for(let i = lineStartAngle; i <= lineEndAngle; i += lineInterval) {
                    linesPoints.push(
                        xMainAxis + minCircleDistance * Math.cos(i),
                        yMainAxis + minCircleDistance * Math.sin(i),
                        xMainAxis + maxCircleDistance * Math.cos(i),
                        yMainAxis + maxCircleDistance * Math.sin(i),
                    );
                }

                drawCircles(offDrawCtx, {
                    points: scaleCircle,
                    lineWidth: 1,
                    color: "rgba(150, 150, 150, 0.3)"
                });
                drawLineSegments(offDrawCtx, {
                    points: linesPoints,
                    lineWidth: 1,
                    color: "rgba(150, 150, 150, 0.3)"
                })
            }
        }
    }

    function drawMainAxis() {
        if(isXAxis && yMainAxis >= 0 && yMainAxis <= canvas.height) {
            drawLine(offDrawCtx, {
                points: [0, yMainAxis, canvas.width, yMainAxis],
                lineWidth: 1.75,
                color: "rgba(0, 0, 0, 1)",
            });
        }

        if(isYAxis) {
            drawLine(offDrawCtx, {
                points: [xMainAxis, 0, xMainAxis, canvas.height],
                lineWidth: 1.75,
                color: "rgba(0, 0, 0, 1)",
            });
        }
    }

    function drawNormalFunction() {
        normalFunctionCtx?.clearRect(0, 0, normalFunctionCanvas.width, normalFunctionCanvas.height);
        normalFunctions.forEach((value: normalFunctionConfig, _: number) => {
            normalFunctionCtx?.drawImage(value.canvas, 0, 0);
        });
    }

    function drawAllPolarFunction() {
        polarFunctionCtx?.clearRect(0, 0, polarFunctionCanvas.width, polarFunctionCanvas.height);
        polarFunctions.forEach((value: polarFunctionConfig, _: number) => {
            polarFunctionCtx?.drawImage(value.canvas, 0, 0);
        });
    }

    function drawAllParameterFunction() {
        parameterFunctionCtx?.clearRect(0, 0, parameterFunctionCanvas.width, parameterFunctionCanvas.height);
        parameterFunctions.forEach((value: parameterFunctionConfig, _: number) => {
            parameterFunctionCtx?.drawImage(value.canvas, 0, 0);
        });
    }

    function drawAllImplicitFunction() {
        implicitFunctionCtx?.clearRect(0, 0, implicitFunctionCanvas.width, implicitFunctionCanvas.height);
        implicitFunctions.forEach((value: implicitFunctionConfig, _: number) => {
            implicitFunctionCtx?.drawImage(value.canvas, 0, 0);
        });
    }

    function drawFocusPoints() {
        const item = singlePoints.get(focus);
        const funcItem = normalFunctions.get(focus);
        if(item && funcItem) {
            const points: number[] = [];
            item.forEach((point: number[]) => {
                if(point[0] >= funcItem.scope[0] && point[1] <= funcItem.scope[1]) {
                    points.push(xScaleToPx(point[0]), yScaleToPx(point[1]));
                }
            });
            drawPoints(ctx, {
                points,
                color: "rgba(175, 175, 175, 1)",
            }, true);
        }
    }

    function drawCustomPoints() {
        customPoints.forEach((points: customPointConfig[], id: number) => {
            const funcItem = normalFunctions.get(id);
            if(funcItem) {
                points.forEach((point: customPointConfig) => {
                    if(point.x >= funcItem.scope[0] && point.x <= funcItem.scope[1]) {
                        const scaleX = xScaleToPx(point.x);
                        const scaleY = yScaleToPx(point.y);
                        drawPoints(ctx, {
                            points: [scaleX, scaleY, 4],
                            color: point.color,
                            globalAlpha: 0.8,
                        }, false);
                        drawPoints(ctx, {
                            points: [scaleX, scaleY, 8],
                            color: point.color,
                            globalAlpha: 0.4,
                        }, false);
                    }
                });
            } else {
                points.forEach((point: customPointConfig) => {
                    const scaleX = xScaleToPx(point.x);
                    const scaleY = yScaleToPx(point.y);

                    drawPoints(ctx, {
                        points: [scaleX, scaleY, 4],
                        color: point.color,
                        globalAlpha: 0.8,
                    }, false);
                    drawPoints(ctx, {
                        points: [scaleX, scaleY, 8],
                        color: point.color,
                        globalAlpha: 0.4,
                    }, false);
                });
            }
        });
    }

    function drawTangentLine() {
        tangentLine.forEach((lines: tangentLineConfig[], id: number) => {
            const funcItem = normalFunctions.get(id);
            if(funcItem) {
                lines.forEach((line: tangentLineConfig) => {
                    if(line.x >= funcItem.scope[0] && line.x <= funcItem.scope[1]) {
                        const scaleX = xScaleToPx(line.x);
                        const scaleY = yScaleToPx(line.y);
                        drawPoints(ctx, {
                            points: [scaleX, scaleY, 4],
                            color: line.color,
                            globalAlpha: 0.8,
                        }, false);
                        drawPoints(ctx, {
                            points: [scaleX, scaleY, 8],
                            color: line.color,
                            globalAlpha: 0.4,
                        }, false);

                        const points = [];
                        points.push([xScope[0], line.k * xScope[0] + line.b]);
                        points.push([xScope[1], line.k * xScope[1] + line.b]);
                        points.push([(yScope[0] - line.b) / line.k, yScope[0]]);
                        points.push([(yScope[1] - line.b) / line.k, yScope[1]]);
                        points.sort((a: number[], b: number[]) => {
                            return a[0] - b[0];
                        });

                        drawLine(ctx, {
                            points: [xScaleToPx(points[1][0]), yScaleToPx(points[1][1]), xScaleToPx(points[2][0]), yScaleToPx(points[2][1])],
                            lineWidth: 2,
                            color: line.color,
                            globalAlpha: 0.4,
                        });
                    }
                });
            }
        });
    }

    function update() {
        drawNormalFunction();
        drawAllPolarFunction();
        drawAllParameterFunction();
        drawAllImplicitFunction();

        if(ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(offDrawCanvas, 0, 0);
            ctx.drawImage(normalFunctionCanvas, 0, 0);
            ctx.drawImage(polarFunctionCanvas, 0, 0);
            ctx.drawImage(parameterFunctionCanvas, 0, 0);
            ctx.drawImage(implicitFunctionCanvas, 0, 0);

            drawFocusPoints();
            drawCustomPoints();
            drawTangentLine();
        }
    }

    return {
        init,
        resize,
        update,
        updateZero,
        updateScale,
        updateNumberInterval,
        updateMinorNumberInterval,
        updateCoordinate,
        updateCircle,

        drawLine,
        drawLineSegments,
        drawCircles,
        drawPoints,
        drawBack,

        ctx,
        canvas,

        getXScope,
        getYScope,

        normalFunctions,
        polarFunctions,
        parameterFunctions,
        implicitFunctions,
        singlePoints,
        customPoints,
        tangentLine,

        xScaleToPx,
        yScaleToPx,
    }
});

export { useFunctionCanvasStore };
export type { normalFunctionConfig, polarFunctionConfig, parameterFunctionConfig, customPointConfig, tangentLineConfig, implicitFunctionConfig };
