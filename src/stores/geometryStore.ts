import { defineStore } from "pinia";
import { reactive, toRaw } from "vue"

function getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

type pointConfig = {
    len: number,
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    radius: number,
    fill: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    callBack: Function,
    leaves: number[],
    isHelp: boolean,
    roots: {
        index: number,
        type: Types,
        minType: PointTypes,
        attr: string,
    }[],
};

type lineConfig = {
    index: number,
    isMask: boolean,
    points: number[][],
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type lineSegmentsConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    helps: number[],
}

type circleConfig = {
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    inX: number,
    inY: number,
    radius: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type circleThreePointsConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type ellipseConfig = {
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    rowX: number,
    rowY: number,
    colX: number,
    colY: number,
    params: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    prevX: number,
    prevY: number,
};

type ellipseFocusConfig = {
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    focusX: number,
    focusY: number,
    inX: number,
    inY: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    prevX: number,
    prevY: number,
};

type hyperbolaConfig = {
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    rowX: number,
    rowY: number,
    colX: number,
    colY: number,
    params: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    prevX: number,
    prevY: number,
};

type hyperbolaFocusConfig = {
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    focusX: number,
    focusY: number,
    inX: number,
    inY: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    prevX: number,
    prevY: number,
};

type parabolaConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    scope: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type parabolaFocusConfig = {
    index: number,
    isMask: boolean,
    x: number,
    y: number,
    focusX: number,
    focusY: number,
    scope: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type quadraticBezierConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type cubicBezierConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    fill: string,
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

type rectangleConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    params: number[],
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    prev: number[][],
};

type squareConfig = {
    index: number,
    isMask: boolean,
    points: number[],
    params: number[],
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
    prev: number[][],
};

type polygonConfig = {
    index: number,
    isMask: boolean,
    fill: string,
    points: number[][],
    stroke: string,
    strokeWidth: number,
    maskWidth: number,
    mask: string,
    visible: boolean,
    choosable: boolean,
    leaves: number[],
};

enum Types {
    None,
    HelpPoint,
    Point,
    Line,
    LineSegment,
    Circle,
    CircleThreePoints,
    Ellipse,
    EllipseFocus,
    Hyperbola,
    HyperbolaFocus,
    Parabola,
    ParabolaFocus,
    QuadraticBezier,
    CubicBezier,
    Rectangle,
    Square,
    Polygon,
};

enum PointTypes {
    Center,
    Right,
    Left,
    Top,
    Bottom,
    FocusCenter,
    In,
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
};

const useGeometryStore = defineStore("geometryStore", () => {
    const allShapes: Map<number, Types> = new Map();
    const global = reactive({
        isRight: false,
        state: 0,
        clicked: [] as number[],
        ctrl: false,
        drawing: false,
        hover: {
            type: Types.None,
            id: -1,
            x: 0,
            y: 0,
        },
    });

    let id = 1;

    const pointList: pointConfig[] = reactive([]);
    const lineList: lineConfig[] = reactive([]);
    const lineSegmentsList: lineSegmentsConfig[] = reactive([]);
    const circleList: circleConfig[] = reactive([]);
    const circleThreePointsList: circleThreePointsConfig[] = reactive([]);
    const ellipseList: ellipseConfig[] = reactive([]);
    const ellipseFocusList: ellipseFocusConfig[] = reactive([]);
    const hyperbolaList: hyperbolaConfig[] = reactive([]);
    const hyperbolaFocusList: hyperbolaFocusConfig[] = reactive([]);
    const parabolaList: parabolaConfig[] = reactive([]);
    const parabolaFocusList: parabolaFocusConfig[] = reactive([]);
    const quadraticBezierList: quadraticBezierConfig[] = reactive([]);
    const cubicBezierList: cubicBezierConfig[] = reactive([]);
    const rectangleList: rectangleConfig[] = reactive([]);
    const squareList: squareConfig[] = reactive([]);
    const polygonList: polygonConfig[] = reactive([]);

    function getPoint(index: number): pointConfig | undefined {
        for(let i = 0; i !== pointList.length; ++i) {
            if(pointList[i].index === index) {
                return pointList[i];
            }
        }
        return undefined;
    }

    function getLine(index: number): lineConfig | undefined {
        for(let i = 0; i !== lineList.length; ++i) {
            if(lineList[i].index === index) {
                return lineList[i];
            }
        }
        return undefined;
    }

    function getLineSegment(index: number): lineSegmentsConfig | undefined {
        for(let i = 0; i !== lineSegmentsList.length; ++i) {
            if(lineSegmentsList[i].index === index) {
                return lineSegmentsList[i];
            }
        }
        return undefined;
    }

    function getCircle(index: number): circleConfig | undefined {
        for(let i = 0; i !== circleList.length; ++i) {
            if(circleList[i].index === index) {
                return circleList[i];
            }
        }
        return undefined;
    }

    function getCircleThreePoints(index: number): circleThreePointsConfig | undefined {
        for(let i = 0; i !== circleThreePointsList.length; ++i) {
            if(circleThreePointsList[i].index === index) {
                return circleThreePointsList[i];
            }
        }
        return undefined;
    }

    function getEllipse(index: number): ellipseConfig | undefined {
        for(let i = 0; i !== ellipseList.length; ++i) {
            if(ellipseList[i].index === index) {
                return ellipseList[i];
            }
        }
        return undefined;
    }

    function getEllipseFocus(index: number): ellipseFocusConfig | undefined {
        for(let i = 0; i !== ellipseFocusList.length; ++i) {
            if(ellipseFocusList[i].index === index) {
                return ellipseFocusList[i];
            }
        }
        return undefined;
    }

    function getHyperbola(index: number): hyperbolaConfig | undefined {
        for(let i = 0; i !== hyperbolaList.length; ++i) {
            if(hyperbolaList[i].index === index) {
                return hyperbolaList[i];
            }
        }
        return undefined;
    }

    function getHyperbolaFocus(index: number): hyperbolaFocusConfig | undefined {
        for(let i = 0; i !== hyperbolaFocusList.length; ++i) {
            if(hyperbolaFocusList[i].index === index) {
                return hyperbolaFocusList[i];
            }
        }
        return undefined;
    }

    function getParabola(index: number): parabolaConfig | undefined {
        for(let i = 0; i !== parabolaList.length; ++i) {
            if(parabolaList[i].index === index) {
                return parabolaList[i];
            }
        }
        return undefined;
    }

    function getParabolaFocus(index: number): parabolaFocusConfig | undefined {
        for(let i = 0; i !== parabolaFocusList.length; ++i) {
            if(parabolaFocusList[i].index === index) {
                return parabolaFocusList[i];
            }
        }
        return undefined;
    }

    function getQuadraticBezier(index: number): quadraticBezierConfig | undefined {
        for(let i = 0; i !== quadraticBezierList.length; ++i) {
            if(quadraticBezierList[i].index === index) {
                return quadraticBezierList[i];
            }
        }
        return undefined;
    }

    function getCubicBezier(index: number): cubicBezierConfig | undefined {
        for(let i = 0; i !== cubicBezierList.length; ++i) {
            if(cubicBezierList[i].index === index) {
                return cubicBezierList[i];
            }
        }
        return undefined;
    }

    function getRectangle(index: number): rectangleConfig | undefined {
        for(let i = 0; i !== rectangleList.length; ++i) {
            if(rectangleList[i].index === index) {
                return rectangleList[i];
            }
        }
        return undefined;
    }

    function getSquare(index: number): squareConfig | undefined {
        for(let i = 0; i !== squareList.length; ++i) {
            if(squareList[i].index === index) {
                return squareList[i];
            }
        }
        return undefined;
    }

    function getPolygon(index: number): polygonConfig | undefined {
        for(let i = 0; i !== polygonList.length; ++i) {
            if(polygonList[i].index === index) {
                return polygonList[i];
            }
        }
        return undefined;
    }

    function pointCallBack(x: number, y: number, index: number, parentIndex: number = -1) {
        const config = getPoint(index);
        if(config) {
            config.x += x;
            config.y += y;
            config.roots.forEach((root) => {
                if(root.index !== parentIndex) {
                    switch(root.type) {
                        case Types.Line:
                            linePointsHandle(root.index);
                            break;
                        case Types.LineSegment:
                            lineSegmentPointsHandle(root.index);
                            break;
                        case Types.Circle:
                            circlePointsHandle(root.index);
                            break;
                        case Types.CircleThreePoints:
                            circleThreePointsHandle(root.index);
                            break;
                        case Types.Ellipse:
                            resolveEllipsePoints(x, y, config.x, config.y, root.index, root.minType);
                            ellipseHandle(root.index);
                            break;
                        case Types.EllipseFocus:
                            resolveEllipseFocusPoints(x, y, config.x, config.y, root.index, root.minType);
                            ellipseFocusHandle(root.index);
                            break;
                        case Types.Hyperbola:
                            resolveHyperbolaPoints(x, y, config.x, config.y, root.index, root.minType);
                            hyperbolaHandle(root.index);
                            break;
                        case Types.HyperbolaFocus:
                            resolveHyperbolaFocusPoints(x, y, config.x, config.y, root.index, root.minType);
                            hyperbolaFocusHandle(root.index);
                            break;
                        case Types.Parabola:
                            parabolaHandle(root.index);
                            break;
                        case Types.ParabolaFocus:
                            parabolaFocusHandle(root.index);
                            break;
                        case Types.QuadraticBezier:
                            quadraticBezierHandle(root.index);
                            break;
                        case Types.CubicBezier:
                            cubicBezierHandle(root.index);
                            break;
                        case Types.Rectangle:
                            resolveRectanglePoints(x, y, config.x, config.y, root.index, root.minType);
                            rectangleHandle(root.index);
                            break;
                        case Types.Square:
                            resolveSquarePoints(x, y, config.x, config.y, root.index, root.minType);
                            squareHandle(root.index);
                            break;
                        case Types.Polygon:
                            polygonPointsHandle(root.index);
                            break;
                    }
                }
            });
        }
    }

    function pointMove(x: number, y: number, index: number) {
        for(let i = 0; i !== pointList.length; ++i) {
            const config: pointConfig = pointList[i];
            if(config.index === index) {
                config.x += x;
                config.y += y;
            }
        };
    }

    function linePointsHandle(id: number) {
        const config = getLine(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = [pointConfig.x, pointConfig.y];
                }
            });
        }
    }

    function lineSegmentPointsHandle(id: number) {
        const config = getLineSegment(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });

            const num = config.helps.length;
            const unitX = (config.points[2] - config.points[0]) / (num + 1);
            const unitY = (config.points[3] - config.points[1]) / (num + 1);

            for(let i = 0; i < num; ++i) {
                const pointConfig = getPoint(config.helps[i]);
                if(pointConfig) {
                    pointConfig.x = config.points[0] + (i + 1) * unitX;
                    pointConfig.y = config.points[1] + (i + 1) * unitY;
                }
            }

            config.helps.forEach((leave: number) => {
                pointCallBack(0, 0, leave, id);
            });
        }
    }

    function circlePointsHandle(id: number) {
        const config = getCircle(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    if(index === 0) {
                        config.x = pointConfig.x;
                        config.y = pointConfig.y;
                    } else if(index === 1) {
                        config.inX = pointConfig.x;
                        config.inY = pointConfig.y;
                        config.radius = getDistance(config.x, config.y, config.inX, config.inY);
                    }
                }
                index++;
            });
        }
    }

    function circleThreePointsHandle(id: number) {
        const config = getCircleThreePoints(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });
        }
    }

    function resolveEllipsePoints(dx: number, dy: number, x: number, y: number, index: number, minType: PointTypes) {
        const config = getEllipse(index);
        if(config) {
            if(minType === PointTypes.Center) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    let deltaX = x - config.prevX;
                    let deltaY = y - config.prevY;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(dx, dy, leave);
                        } else {
                            config.prevX = x;
                            config.prevY = y;
                        }
                        i++;
                    });
                }
            } else if(minType === PointTypes.Right) {
                let i = 0;
                let center: number[] = [];
                let top: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(point.y - y, point.x - x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 2) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            top = [point.x, point.y];
                        } else if(i === 3) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        } else if(i === 4) {
                            point.x = 2 * center[0] - top[0];
                            point.y = 2 * center[1] - top[1];
                        }
                    }
                    i++;
                });
            } else if(minType === PointTypes.Left) {
                let i = 0;
                let center: number[] = [];
                let top: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(y - point.y, x - point.x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 1) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        } else if(i === 2) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            top = [point.x, point.y];
                        } else if(i === 4) {
                            point.x = 2 * center[0] - top[0];
                            point.y = 2 * center[1] - top[1];
                        }
                    }
                    i++;
                });
            } else if(minType === PointTypes.Top) {
                let i = 0;
                let center: number[] = [];
                let right: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(y - point.y, x - point.x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 1) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            right = [point.x, point.y];
                        } else if(i === 3) {
                            point.x = 2 * center[0] - right[0];
                            point.y = 2 * center[1] - right[1];
                        } else if(i === 4) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        }
                    }
                    i++;
                });
            } else if(minType === PointTypes.Bottom) {
                let i = 0;
                let center: number[] = [];
                let right: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(point.y - y, point.x - x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 1) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            right = [point.x, point.y];
                        } else if(i === 2) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        } else if(i === 3) {
                            point.x = 2 * center[0] - right[0];
                            point.y = 2 * center[1] - right[1];
                        }
                    }
                    i++;
                });
            }
        }
    }

    function ellipseHandle(id: number) {
        const config = getEllipse(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    if(index === 0) {
                        config.x = pointConfig.x;
                        config.y = pointConfig.y;
                        config.prevX = config.x;
                        config.prevY = config.y;
                    } else if(index === 1) {
                        config.rowX = pointConfig.x;
                        config.rowY = pointConfig.y;
                    } else if(index === 2) {
                        config.colX = pointConfig.x;
                        config.colY = pointConfig.y;
                    }
                }
                index++;
            });
        }
    }

    function resolveEllipseFocusPoints(dx: number, dy: number, x: number, y: number, index: number, minType: PointTypes) {
        const config = getEllipseFocus(index);
        if(config) {
            if(minType === PointTypes.Center) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    const deltaX = x - config.prevX;
                    const deltaY = y - config.prevY;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(dx, dy, leave);
                        } else {
                            config.prevX = x;
                            config.prevY = y;
                        }
                        i++;
                    });
                }
            } else if(minType === PointTypes.Right) {
                const center = getPoint(config.leaves[0]);
                const point = getPoint(config.leaves[3]);
                if(point && center) {
                    point.x = 2 * center.x - x;
                    point.y = 2 * center.y - y;
                }
            } else if(minType === PointTypes.Left) {
                const center = getPoint(config.leaves[0]);
                const point = getPoint(config.leaves[1]);
                if(point && center) {
                    point.x = 2 * center.x - x;
                    point.y = 2 * center.y - y;
                }
            }
        }
    }

    function ellipseFocusHandle(id: number) {
        const config = getEllipseFocus(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    if(index === 0) {
                        config.x = pointConfig.x;
                        config.y = pointConfig.y;
                        config.prevX = config.x;
                        config.prevY = config.y;
                    } else if(index === 1) {
                        config.focusX = pointConfig.x;
                        config.focusY = pointConfig.y;
                    } else if(index === 2) {
                        config.inX = pointConfig.x;
                        config.inY = pointConfig.y;
                    }
                }
                index++;
            });
        }
    }

    function resolveHyperbolaPoints(dx: number, dy: number, x: number, y: number, index: number, minType: PointTypes) {
        const config = getHyperbola(index);
        if(config) {
            if(minType === PointTypes.Center) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    let deltaX = x - config.prevX;
                    let deltaY = y - config.prevY;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(dx, dy, leave);
                        } else {
                            config.prevX = x;
                            config.prevY = y;
                        }
                        i++;
                    });
                }
            } else if(minType === PointTypes.Right) {
                let i = 0;
                let center: number[] = [];
                let top: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(point.y - y, point.x - x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 2) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            top = [point.x, point.y];
                        } else if(i === 3) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        } else if(i === 4) {
                            point.x = 2 * center[0] - top[0];
                            point.y = 2 * center[1] - top[1];
                        }
                    }
                    i++;
                });
            } else if(minType === PointTypes.Left) {
                let i = 0;
                let center: number[] = [];
                let top: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(y - point.y, x - point.x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 1) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        } else if(i === 2) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            top = [point.x, point.y];
                        } else if(i === 4) {
                            point.x = 2 * center[0] - top[0];
                            point.y = 2 * center[1] - top[1];
                        }
                    }
                    i++;
                });
            } else if(minType === PointTypes.Top) {
                let i = 0;
                let center: number[] = [];
                let right: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(y - point.y, x - point.x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 1) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            right = [point.x, point.y];
                        } else if(i === 3) {
                            point.x = 2 * center[0] - right[0];
                            point.y = 2 * center[1] - right[1];
                        } else if(i === 4) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        }
                    }
                    i++;
                });
            } else if(minType === PointTypes.Bottom) {
                let i = 0;
                let center: number[] = [];
                let right: number[] = [];
                config.leaves.forEach((leave: number) => {
                    const point = getPoint(leave);
                    if(point) {
                        if(i === 0) {
                            config.params = [0, 0, 0, Math.atan2(point.y - y, point.x - x), 0, 0];
                            center = [point.x, point.y];
                        } else if(i === 1) {
                            const distance = getDistance(center[0], center[1], point.x, point.y);
                            point.x = center[0] - distance * Math.sin(config.params[3]);
                            point.y = center[1] + distance * Math.cos(config.params[3]);
                            right = [point.x, point.y];
                        } else if(i === 2) {
                            point.x = 2 * center[0] - x;
                            point.y = 2 * center[1] - y;
                        } else if(i === 3) {
                            point.x = 2 * center[0] - right[0];
                            point.y = 2 * center[1] - right[1];
                        }
                    }
                    i++;
                });
            }
        }
    }

    function hyperbolaHandle(id: number) {
        const config = getHyperbola(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    if(index === 0) {
                        config.x = pointConfig.x;
                        config.y = pointConfig.y;
                        config.prevX = config.x;
                        config.prevY = config.y;
                    } else if(index === 1) {
                        config.rowX = pointConfig.x;
                        config.rowY = pointConfig.y;
                    } else if(index === 2) {
                        config.colX = pointConfig.x;
                        config.colY = pointConfig.y;
                    }
                }
                index++;
            });
        }
    }

    function resolveHyperbolaFocusPoints(dx: number, dy: number, x: number, y: number, index: number, minType: PointTypes) {
        const config = getHyperbolaFocus(index);
        if(config) {
            if(minType === PointTypes.Center) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    const deltaX = x - config.prevX;
                    const deltaY = y - config.prevY;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(dx, dy, leave);
                        } else {
                            config.prevX = x;
                            config.prevY = y;
                        }
                        i++;
                    });
                }
            } else if(minType === PointTypes.Right) {
                const center = getPoint(config.leaves[0]);
                const point = getPoint(config.leaves[3]);
                if(point && center) {
                    point.x = 2 * center.x - x;
                    point.y = 2 * center.y - y;
                }
            } else if(minType === PointTypes.Left) {
                const center = getPoint(config.leaves[0]);
                const point = getPoint(config.leaves[1]);
                if(point && center) {
                    point.x = 2 * center.x - x;
                    point.y = 2 * center.y - y;
                }
            }
        }
    }

    function hyperbolaFocusHandle(id: number) {
        const config = getHyperbolaFocus(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    if(index === 0) {
                        config.x = pointConfig.x;
                        config.y = pointConfig.y;
                        config.prevX = config.x;
                        config.prevY = config.y;
                    } else if(index === 1) {
                        config.focusX = pointConfig.x;
                        config.focusY = pointConfig.y;
                    } else if(index === 2) {
                        config.inX = pointConfig.x;
                        config.inY = pointConfig.y;
                    }
                }
                index++;
            });
        }
    }

    function parabolaHandle(id: number) {
        const config = getParabola(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });
        }
    }

    function parabolaFocusHandle(id: number) {
        const config = getParabolaFocus(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    if(index === 0) {
                        config.x = pointConfig.x;
                        config.y = pointConfig.y;
                    } else if(index === 1) {
                        config.focusX = pointConfig.x;
                        config.focusY = pointConfig.y;
                    }
                }
                index++;
            });
        }
    }

    function quadraticBezierHandle(id: number) {
        const config = getQuadraticBezier(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });
        }
    }

    function cubicBezierHandle(id: number) {
        const config = getCubicBezier(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });
        }
    }

    function resolveRectanglePoints(dx: number, dy: number, x: number, y: number, index: number, minType: PointTypes) {
        const config = getRectangle(index);
        if(config) {
            if(minType === PointTypes.TopLeft) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    const deltaX = x - config.prev[0][0];
                    const deltaY = y - config.prev[0][1];
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(dx, dy, leave);
                        }
                        i++;
                    });
                    config.prev[0][0] += dx;
                    config.prev[0][1] += dy;
                }
            } else if(minType === PointTypes.TopRight) {
                const leftTop = getPoint(config.leaves[0]);
                const leftBottom = getPoint(config.leaves[3]);
                const rightBottom = getPoint(config.leaves[2]);
                if(leftTop && leftBottom && rightBottom) {
                    config.params = [0, 0, 0, Math.atan2(leftTop.y - y, leftTop.x - x), 0, 0];
                    const distance = getDistance(leftTop.x, leftTop.y, leftBottom.x, leftBottom.y);

                    leftBottom.x = leftTop.x + distance * Math.sin(config.params[3]);
                    leftBottom.y = leftTop.y - distance * Math.cos(config.params[3]);

                    rightBottom.x = leftBottom.x + (x - leftTop.x);
                    rightBottom.y = leftBottom.y + (y - leftTop.y);
                }
            } else if(minType === PointTypes.BottomLeft) {
                const leftTop = getPoint(config.leaves[0]);
                const rightTop = getPoint(config.leaves[1]);
                const rightBottom = getPoint(config.leaves[2]);
                if(leftTop && rightTop && rightBottom) {
                    config.params = [0, 0, 0, Math.atan2(leftTop.y - y, leftTop.x - x), 0, 0];
                    const distance = getDistance(leftTop.x, leftTop.y, rightTop.x, rightTop.y);

                    rightTop.x = leftTop.x - distance * Math.sin(config.params[3]);
                    rightTop.y = leftTop.y + distance * Math.cos(config.params[3]);

                    rightBottom.x = x + (rightTop.x - leftTop.x);
                    rightBottom.y = y + (rightTop.y - leftTop.y);
                }
            } else if(minType === PointTypes.BottomRight) {
                const leftTop = getPoint(config.leaves[0]);
                const rightTop = getPoint(config.leaves[1]);
                const leftBottom = getPoint(config.leaves[3]);

                if(leftTop && rightTop && leftBottom) {
                    const A1 = leftTop.y - rightTop.y;
                    const B1 = rightTop.x - leftTop.x;
                    const C1 = (leftTop.x * rightTop.y) - (rightTop.x * leftTop.y);
                    const theta1 = Math.atan2(leftTop.y - rightTop.y, leftTop.x - rightTop.x);
                    const distance1 = Math.abs(A1 * x + B1 * y + C1) /
                                      Math.sqrt(Math.pow(A1, 2) + Math.pow(B1, 2));

                    const A2 = leftTop.y - leftBottom.y;
                    const B2 = leftBottom.x - leftTop.x;
                    const C2 = (leftTop.x * leftBottom.y) - (leftBottom.x * leftTop.y);
                    const theta2 = Math.atan2(leftTop.y - leftBottom.y, leftTop.x - leftBottom.x);
                    const distance2 = Math.abs(A2 * x + B2 * y + C2) /
                                      Math.sqrt(Math.pow(A2, 2) + Math.pow(B2, 2));

                    rightTop.x = leftTop.x - distance2 * Math.sin(theta2);
                    rightTop.y = leftTop.y + distance2 * Math.cos(theta2);

                    leftBottom.x = leftTop.x + distance1 * Math.sin(theta1);
                    leftBottom.y = leftTop.y - distance1 * Math.cos(theta1);
                }
            }
        }
    }

    function rectangleHandle(id: number) {
        const config = getRectangle(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });
            config.prev = [[config.points[0], config.points[1]]];
        }
    }

    function resolveSquarePoints(dx: number, dy: number, x: number, y: number, index: number, minType: PointTypes) {
        const config = getSquare(index);
        if(config) {
            if(minType === PointTypes.TopLeft) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    const deltaX = x - config.prev[0][0];
                    const deltaY = y - config.prev[0][1];
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 0) {
                            pointMove(dx, dy, leave);
                        }
                        i++;
                    });
                    config.prev[0][0] += dx;
                    config.prev[0][1] += dy;
                    config.prev[1][0] += dx;
                    config.prev[1][1] += dy;
                }
            } else if(minType === PointTypes.TopRight) {
                const leftTop = getPoint(config.leaves[0]);
                const leftBottom = getPoint(config.leaves[3]);
                const rightBottom = getPoint(config.leaves[2]);
                if(leftTop && leftBottom && rightBottom) {
                    config.params = [0, 0, 0, Math.atan2(leftTop.y - y, leftTop.x - x), 0, 0];
                    const distance = getDistance(leftTop.x, leftTop.y, x, y);

                    leftBottom.x = leftTop.x + distance * Math.sin(config.params[3]);
                    leftBottom.y = leftTop.y - distance * Math.cos(config.params[3]);

                    rightBottom.x = leftBottom.x + (x - leftTop.x);
                    rightBottom.y = leftBottom.y + (y - leftTop.y);
                }
            } else if(minType === PointTypes.BottomLeft) {
                const leftTop = getPoint(config.leaves[0]);
                const rightTop = getPoint(config.leaves[1]);
                const rightBottom = getPoint(config.leaves[2]);
                if(leftTop && rightTop && rightBottom) {
                    config.params = [0, 0, 0, Math.atan2(leftTop.y - y, leftTop.x - x), 0, 0];
                    const distance = getDistance(leftTop.x, leftTop.y, x, y);

                    rightTop.x = leftTop.x - distance * Math.sin(config.params[3]);
                    rightTop.y = leftTop.y + distance * Math.cos(config.params[3]);

                    rightBottom.x = x + (rightTop.x - leftTop.x);
                    rightBottom.y = y + (rightTop.y - leftTop.y);
                }
            } else if(minType === PointTypes.BottomRight) {
                if(dx === 0 && dy === 0) {
                    let i = 0;
                    const deltaX = x - config.prev[1][0];
                    const deltaY = y - config.prev[1][1];
                    config.leaves.forEach((leave: number) => {
                        if(i !== 2) {
                            pointMove(deltaX, deltaY, leave);
                        }
                        i++;
                    });
                } else {
                    let i = 0;
                    config.leaves.forEach((leave: number) => {
                        if(i !== 2) {
                            pointMove(dx, dy, leave);
                        }
                        i++;
                    });
                    config.prev[0][0] += dx;
                    config.prev[0][1] += dy;
                    config.prev[1][0] += dx;
                    config.prev[1][1] += dy;
                }
            }
        }
    }

    function squareHandle(id: number) {
        const config = getSquare(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = pointConfig.x;
                    config.points[index++] = pointConfig.y;
                }
            });
            config.prev = [[config.points[0], config.points[1]], [config.points[4], config.points[5]]];
        }
    }

    function polygonPointsHandle(id: number) {
        const config = getPolygon(id);
        if(config) {
            let index = 0;
            config.leaves.forEach((leave: number) => {
                const pointConfig = getPoint(leave);
                if(pointConfig) {
                    config.points[index++] = [pointConfig.x, pointConfig.y];
                }
            });
        }
    }

    const commondPoint = {
        radius: 3,
        fill: "rgba(255, 50, 0, 1)",
        strokeWidth: 1,
        maskWidth: 2,
        mask: "rgba(255, 50, 0, 1)",
        visible: true,
        choosable: false,
    };

    function addCommondPoint(x: number, y: number, index: number, type: Types, pointId: number, minType: PointTypes, attr: string = ""): number {
        global.clicked = [];

        if(pointId > 0) {
            pointList.forEach((point: pointConfig) => {
                if(point.index === pointId) {
                    point.roots.push({ index, type, minType, attr });
                }
            });
            return pointId;
        } else {
            const old = id;
            allShapes.set(id, Types.Point);

            const config = {
                x,
                y,
                ...commondPoint
            } as pointConfig;

            config.index = id++;
            config.callBack = (x: number, y: number) => { return pointCallBack(x, y, config.index) };
            config.roots = [{ index, type, minType, attr }];

            pointList.push(config);

            return old;
        }
    }

    function addPoint(config: pointConfig) {
        if(config.leaves[0] > 0) return;

        global.clicked = [];
        allShapes.set(id, Types.Point);
        config.index = id++;
        config.roots = [];
        config.callBack = (x: number, y: number) => { return pointCallBack(x, y, config.index) };
        pointList.push(config);
    }

    function addLine(config: lineConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Line);
        config.index = id++;

        const arr: number[] = [];
        const points: number[][] = [];
        let index = 0;
        config.points.forEach((point: number[]) => {
            arr.push(addCommondPoint(point[0], point[1], config.index, Types.Line, config.leaves[index], PointTypes.In));
            points.push([point[0], point[1]]);
            index++;
        });

        config.points = points;
        config.leaves = arr;
        lineList.push(config);
    }

    function addLineSegments(config: lineSegmentsConfig) {
        global.clicked = [];
        allShapes.set(id, Types.LineSegment);
        config.index = id++;
        const left = addCommondPoint(config.points[0], config.points[1], config.index, Types.LineSegment,
                                     config.leaves[0], PointTypes.Left);
        const right = addCommondPoint(config.points[2], config.points[3], config.index, Types.LineSegment,
                                      config.leaves[1], PointTypes.Right);
        config.leaves = [left, right];
        config.helps = [];
        lineSegmentsList.push(config);
    }

    function addCircle(config: circleConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Circle);
        config.index = id++;
        const center = addCommondPoint(config.x, config.y, config.index, Types.Circle, config.leaves[0], PointTypes.Center);
        const inCircle = addCommondPoint(config.inX, config.inY, config.index, Types.Circle, config.leaves[1], PointTypes.In);
        config.leaves = [center, inCircle];
        circleList.push(config);
    }

    function addCircleThreePoints(config: circleThreePointsConfig) {
        global.clicked = [];
        allShapes.set(id, Types.CircleThreePoints);
        config.index = id++;
        const p1 = addCommondPoint(config.points[0], config.points[1], config.index, Types.CircleThreePoints,
                                   config.leaves[0], PointTypes.In, "1");
        const p2 = addCommondPoint(config.points[2], config.points[3], config.index, Types.CircleThreePoints,
                                   config.leaves[1], PointTypes.In, "2");
        const p3 = addCommondPoint(config.points[4], config.points[5], config.index, Types.CircleThreePoints,
                                   config.leaves[2], PointTypes.In, "3");
        config.leaves = [p1, p2, p3];
        circleThreePointsList.push(config);
    }

    function addEllipse(config: ellipseConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Ellipse);
        config.index = id++;
        const center = addCommondPoint(config.x, config.y, config.index, Types.Ellipse,
                                       config.leaves[0], PointTypes.Center);
        const right = addCommondPoint(config.rowX, config.rowY, config.index, Types.Ellipse,
                                      config.leaves[1], PointTypes.Right);
        const top = addCommondPoint(config.colX, config.colY, config.index, Types.Ellipse,
                                    config.leaves[2], PointTypes.Top);

        const left = addCommondPoint(2 * config.x - config.rowX, 2 * config.y - config.rowY, config.index,
                                     Types.Ellipse, -1, PointTypes.Left);
        const bottom = addCommondPoint(2 * config.x - config.colX, 2 * config.y - config.colY, config.index,
                                       Types.Ellipse, -1, PointTypes.Bottom);
        config.prevX = config.x;
        config.prevY = config.y;
        config.leaves = [center, right, top, left, bottom];
        ellipseList.push(config);
    }

    function addEllipseFocus(config: ellipseFocusConfig) {
        global.clicked = [];
        allShapes.set(id, Types.EllipseFocus);
        config.index = id++;
        const center = addCommondPoint(config.x, config.y, config.index, Types.EllipseFocus,
                                       config.leaves[0], PointTypes.Center);
        const focusRight = addCommondPoint(config.focusX, config.focusY, config.index, Types.EllipseFocus,
                                           config.leaves[1], PointTypes.Right);
        const ellipseIn = addCommondPoint(config.inX, config.inY, config.index, Types.EllipseFocus,
                                          config.leaves[2], PointTypes.In);
        const focusLeft = addCommondPoint(2 * config.x - config.focusX, 2 * config.y - config.focusY, config.index,
                                          Types.EllipseFocus, -1, PointTypes.Left);
        config.prevX = config.x;
        config.prevY = config.y;
        config.leaves = [center, focusRight, ellipseIn, focusLeft];
        ellipseFocusList.push(config);
    }

    function addHyperbola(config: hyperbolaConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Hyperbola);
        config.index = id++;
        const center = addCommondPoint(config.x, config.y, config.index, Types.Hyperbola,
                                       config.leaves[0], PointTypes.Center);
        const right = addCommondPoint(config.rowX, config.rowY, config.index, Types.Hyperbola,
                                      config.leaves[1], PointTypes.Right);
        const top = addCommondPoint(config.colX, config.colY, config.index, Types.Hyperbola,
                                    config.leaves[2], PointTypes.Top);

        const left = addCommondPoint(2 * config.x - config.rowX, 2 * config.y - config.rowY, config.index,
                                     Types.Hyperbola, -1, PointTypes.Left);
        const bottom = addCommondPoint(2 * config.x - config.colX, 2 * config.y - config.colY, config.index,
                                       Types.Hyperbola, -1, PointTypes.Bottom);
        config.prevX = config.x;
        config.prevY = config.y;
        config.leaves = [center, right, top, left, bottom];
        hyperbolaList.push(config);
    }

    function addHyperbolaFocus(config: hyperbolaFocusConfig) {
        global.clicked = [];
        allShapes.set(id, Types.HyperbolaFocus);
        config.index = id++;
        const center = addCommondPoint(config.x, config.y, config.index, Types.HyperbolaFocus,
                                       config.leaves[0], PointTypes.Center);
        const focusRight = addCommondPoint(config.focusX, config.focusY, config.index, Types.HyperbolaFocus,
                                           config.leaves[1], PointTypes.Right);
        const ellipseIn = addCommondPoint(config.inX, config.inY, config.index, Types.HyperbolaFocus,
                                          config.leaves[2], PointTypes.In);
        const focusLeft = addCommondPoint(2 * config.x - config.focusX, 2 * config.y - config.focusY, config.index,
                                          Types.HyperbolaFocus, -1, PointTypes.Left);
        config.prevX = config.x;
        config.prevY = config.y;
        config.leaves = [center, focusRight, ellipseIn, focusLeft];
        hyperbolaFocusList.push(config);
    }

    function addParabola(config: parabolaConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Parabola);
        config.index = id++;
        const one = addCommondPoint(config.points[0], config.points[1], config.index,
                                    Types.Parabola, config.leaves[0], PointTypes.In);
        const two = addCommondPoint(config.points[2], config.points[3], config.index,
                                    Types.Parabola, config.leaves[1], PointTypes.In);
        const three = addCommondPoint(config.points[4], config.points[5], config.index,
                                      Types.Parabola, config.leaves[2], PointTypes.In);

        config.leaves = [one, two, three];
        parabolaList.push(config);
    }

    function addParabolaFocus(config: parabolaFocusConfig) {
        global.clicked = [];
        allShapes.set(id, Types.ParabolaFocus);
        config.index = id++;
        const zero = addCommondPoint(config.x, config.y, config.index, Types.ParabolaFocus, config.leaves[0], PointTypes.In);
        const center = addCommondPoint(config.focusX, config.focusY, config.index, Types.ParabolaFocus, config.leaves[1], PointTypes.Center);

        config.leaves = [zero, center];
        parabolaFocusList.push(config);
    }

    function addQuadraticBezier(config: quadraticBezierConfig) {
        global.clicked = [];
        allShapes.set(id, Types.QuadraticBezier);
        config.index = id++;
        const one = addCommondPoint(config.points[0], config.points[1], config.index,
                                    Types.QuadraticBezier, config.leaves[0], PointTypes.In);
        const two = addCommondPoint(config.points[2], config.points[3], config.index,
                                    Types.QuadraticBezier, config.leaves[1], PointTypes.In);
        const three = addCommondPoint(config.points[4], config.points[5], config.index,
                                      Types.QuadraticBezier, config.leaves[2], PointTypes.In);

        config.leaves = [one, two, three];
        quadraticBezierList.push(config);
    }

    function addCubicBezier(config: cubicBezierConfig) {
        global.clicked = [];
        allShapes.set(id, Types.CubicBezier);
        config.index = id++;
        const one = addCommondPoint(config.points[0], config.points[1], config.index,
                                    Types.CubicBezier, config.leaves[0], PointTypes.In);
        const two = addCommondPoint(config.points[2], config.points[3], config.index,
                                    Types.CubicBezier, config.leaves[1], PointTypes.In);
        const three = addCommondPoint(config.points[4], config.points[5], config.index,
                                      Types.CubicBezier, config.leaves[2], PointTypes.In);
        const four = addCommondPoint(config.points[6], config.points[7], config.index,
                                     Types.CubicBezier, config.leaves[3], PointTypes.In);

        config.leaves = [one, two, three, four];
        cubicBezierList.push(config);
    }

    function addRectangle(config: rectangleConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Rectangle);
        config.index = id++;
        const one = addCommondPoint(config.points[0], config.points[1], config.index,
                                    Types.Rectangle, config.leaves[0], PointTypes.TopLeft);
        const two = addCommondPoint(config.points[2], config.points[3], config.index,
                                    Types.Rectangle, config.leaves[1], PointTypes.TopRight);
        const three = addCommondPoint(config.points[4], config.points[5], config.index,
                                      Types.Rectangle, config.leaves[2], PointTypes.BottomRight);
        const four = addCommondPoint(config.points[4] + (config.points[0] - config.points[2]),
                                     config.points[5] + (config.points[1] - config.points[3]),
                                     config.index, Types.Rectangle, -1, PointTypes.BottomLeft);

        config.prev = [[config.points[0], config.points[1]]];
        config.leaves = [one, two, three, four];
        rectangleList.push(config);
    }

    function addSquare(config: squareConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Square);
        config.index = id++;
        const one = addCommondPoint(config.points[0], config.points[1], config.index,
                                    Types.Square, config.leaves[0], PointTypes.TopLeft);
        const two = addCommondPoint(config.points[2], config.points[3], config.index,
                                    Types.Square, config.leaves[1], PointTypes.TopRight);
        const three = addCommondPoint(config.points[4], config.points[5], config.index,
                                      Types.Square, -1, PointTypes.BottomRight);
        const four = addCommondPoint(config.points[4] + (config.points[0] - config.points[2]),
                                     config.points[5] + (config.points[1] - config.points[3]),
                                     config.index, Types.Square, -1, PointTypes.BottomLeft);

        config.prev = [[config.points[0], config.points[1]], [config.points[4], config.points[5]]];
        config.leaves = [one, two, three, four];
        squareList.push(config);
    }

    function addPolygon(config: polygonConfig) {
        global.clicked = [];
        allShapes.set(id, Types.Polygon);
        config.index = id++;

        const arr: number[] = [];
        let index = 0;
        const points: number[][] = [];
        config.points.forEach((point: number[]) => {
            arr.push(addCommondPoint(point[0], point[1], config.index, Types.Polygon, config.leaves[index], PointTypes.In));
            points.push([point[0], point[1]]);
            index++;
        });

        config.points = points;
        config.leaves = arr;
        polygonList.push(config);
    }

    function changeHelper(index: number, num: number) {
        const isIn = allShapes.get(index);
        if(isIn) {
            if(isIn !== Types.LineSegment) {
                return;
            }
        }

        const line = getLineSegment(index);
        if(line) {
            if(!line.helps) {
                line.helps = [];
            }

            line.helps.forEach((pointIndex: number) => {
                deleteLeavePoints(pointIndex, index);
            });
            line.helps = [];

            if(num !== 0) {
                const unitX = (line.points[2] - line.points[0]) / (num + 1);
                const unitY = (line.points[3] - line.points[1]) / (num + 1);

                for(let i = 1; i <= num; ++i) {
                    line.helps.push(addCommondPoint(line.points[0] + i * unitX,
                                                    line.points[1] + i * unitY,
                                                    line.index, Types.LineSegment, -1, PointTypes.In));
                }
            }
        }
    }

    function changePointLength(index1: number, index2: number, len: number) {
        const isIn1 = allShapes.get(index1);
        const isIn2 = allShapes.get(index2);
        if(isIn1 !== Types.Point || isIn2 !== Types.Point) {
            return;
        }

        const left = getPoint(index1);
        const right = getPoint(index2);
        if(left && right) {
            const theta = Math.atan2(right.y - left.y, right.x - left.x);

            right.x = left.x + len * Math.cos(theta);
            right.y = left.y + len * Math.sin(theta);
            pointCallBack(0, 0, right.index);
        }
    }

    function changeLineLength(index: number, len: number) {
        const isIn = allShapes.get(index);
        if(isIn !== Types.LineSegment) {
            return;
        }

        const line = getLineSegment(index);
        if(line) {
            const left = getPoint(line.leaves[0]);
            const right = getPoint(line.leaves[1]);
            if(left && right) {
                const theta = Math.atan2(right.y - left.y, right.x - left.x);

                right.x = left.x + len * Math.cos(theta);
                right.y = left.y + len * Math.sin(theta);
                pointCallBack(0, 0, right.index);
            }
        }
    }


    function changePointAngle(index1: number, index2: number, index3: number, angle: number) {
        const isIn1 = allShapes.get(index1);
        const isIn2 = allShapes.get(index2);
        const isIn3 = allShapes.get(index3);
        if(isIn1 !== Types.Point || isIn2 !== Types.Point || isIn3 !== Types.Point) {
            return;
        }

        const point1 = getPoint(index1);
        const point2 = getPoint(index2);
        const point3 = getPoint(index3);
        if(point1 && point2 && point3) {
            const theta = Math.atan2(point1.y - point2.y, point1.x - point2.x);
            const angleTheta = angle * Math.PI / 180;

            const distance = getDistance(point2.x, point2.y, point3.x, point3.y);
            point3.x = point2.x + distance * Math.cos(theta - angleTheta);
            point3.y = point2.y + distance * Math.sin(theta - angleTheta);
            pointCallBack(0, 0, point3.index);
        }
    }

    function changeLineAngle(index1: number, index2: number, angle: number) {
        const isIn1 = allShapes.get(index1);
        const isIn2 = allShapes.get(index2);
        if(isIn1 !== Types.LineSegment || isIn2 !== Types.LineSegment) {
            return;
        }

        const line1 = getLineSegment(index1);
        const line2 = getLineSegment(index2);
        if(line1 && line2) {
            const theta = Math.atan2(line1.points[3] - line1.points[1], line1.points[2] - line1.points[0]);
            const angleTheta = angle * Math.PI / 180;

            const distance = getDistance(line2.points[0], line2.points[1], line2.points[2], line2.points[3]);

            const point = getPoint(line2.leaves[1]);
            if(point) {
                point.x = line1.points[0] + distance * Math.cos(theta - angleTheta);
                point.y = line2.points[1] + distance * Math.sin(theta - angleTheta);
                pointCallBack(0, 0, point.index);
            }
        }
    }

    function changeLength(id: number[], len: number, type: Types) {
        if(type === Types.LineSegment) {
            changeLineLength(id[0], len);
        } else {
            changePointLength(id[0], id[1], len);
        }
    }

    function changeAngle(id: number[], angle: number, type: Types) {
        if(type === Types.LineSegment) {
            changeLineAngle(id[0], id[1], angle);
        } else {
            changePointAngle(id[0], id[1], id[2], angle);
        }
    }

    function deletePoint(index: number) {
        const point = getPoint(index);
        if(point) {
            const roots = point.roots;
            const indexNumber: number = pointList.findIndex((element: pointConfig) => element.index === index);
            if (indexNumber !== -1) {
                pointList.splice(indexNumber, 1);
            }

            roots.forEach((root) => {
                deleteShapeWithType(root.index, root.type);
            });
        }
    }

    function deleteLeavePoints(index: number, parentIndex: number) {
        const point = getPoint(index);
        if(point) {
            if(point.roots.length < 1) {
                const indexNumber: number = pointList.findIndex((element: pointConfig) => element.index === index);
                if (indexNumber !== -1) {
                    pointList.splice(indexNumber, 1);
                }
            } else if(point.roots.length === 1) {
                if(point.roots[0].index === parentIndex) {
                    const indexNumber: number = pointList.findIndex((element: pointConfig) => element.index === index);
                    if (indexNumber !== -1) {
                        pointList.splice(indexNumber, 1);
                    }
                }
            } else if(point.roots.length > 1) {
                const indexNumber: number = point.roots.findIndex((element) => element.index === parentIndex);
                if (indexNumber !== -1) {
                    point.roots.splice(indexNumber, 1);
                }
            }
        }
    }

    function deleteShapeHelper(func: Function, shapeList: any[], id: number) {
        const shape = func(id);
        if(shape) {
            const leaves = shape.leaves;
            let helper = [];
            if(shape.helps) {
                helper = shape.helps;
            }

            const index: number = shapeList.findIndex((element) => element.index === id);
            if (index !== -1) {
                shapeList.splice(index, 1);
            }

            leaves.forEach((leave: number) => {
                deleteLeavePoints(leave, id);
            });
            helper.forEach((leave: number) => {
                deleteLeavePoints(leave, id);
            });
        }
    }

    function deleteShapeWithType(index: number, types: Types) {
        switch(types) {
            case Types.Point:
                deletePoint(index);
                break;
            case Types.Line:
                deleteShapeHelper(getLine, lineList, index);
                break;
            case Types.LineSegment:
                deleteShapeHelper(getLineSegment, lineSegmentsList, index);
                break;
            case Types.Circle:
                deleteShapeHelper(getCircle, circleList, index);
                break;
            case Types.CircleThreePoints:
                deleteShapeHelper(getCircleThreePoints, circleThreePointsList, index);
                break;
            case Types.Ellipse:
                deleteShapeHelper(getEllipse, ellipseList, index);
                break;
            case Types.EllipseFocus:
                deleteShapeHelper(getEllipseFocus, ellipseFocusList, index);
                break;
            case Types.Hyperbola:
                deleteShapeHelper(getHyperbola, hyperbolaList, index);
                break;
            case Types.HyperbolaFocus:
                deleteShapeHelper(getHyperbolaFocus, hyperbolaFocusList, index);
                break;
            case Types.Parabola:
                deleteShapeHelper(getParabola, parabolaList, index);
                break;
            case Types.ParabolaFocus:
                deleteShapeHelper(getParabolaFocus, parabolaFocusList, index);
                break;
            case Types.QuadraticBezier:
                deleteShapeHelper(getQuadraticBezier, quadraticBezierList, index);
                break;
            case Types.CubicBezier:
                deleteShapeHelper(getCubicBezier, cubicBezierList, index);
                break;
            case Types.Rectangle:
                deleteShapeHelper(getRectangle, rectangleList, index);
                break;
            case Types.Square:
                deleteShapeHelper(getSquare, squareList, index);
                break;
            case Types.Polygon:
                deleteShapeHelper(getPolygon, polygonList, index);
                break;
        }
    }

    function deleteShape(index: number) {
        global.clicked = [];
        global.hover.id = -1;
        global.hover.type = Types.None;

        const types = allShapes.get(index);
        if(types !== undefined) {
            deleteShapeWithType(index, types);
        }
    }

    return {
        allShapes,
        global,

        pointList,
        lineList,
        lineSegmentsList,
        circleList,
        circleThreePointsList,
        ellipseList,
        ellipseFocusList,
        hyperbolaList,
        hyperbolaFocusList,
        parabolaList,
        parabolaFocusList,
        quadraticBezierList,
        cubicBezierList,
        rectangleList,
        squareList,
        polygonList,

        addPoint,
        addLine,
        addLineSegments,
        addCircle,
        addCircleThreePoints,
        addEllipse,
        addEllipseFocus,
        addHyperbola,
        addHyperbolaFocus,
        addParabola,
        addParabolaFocus,
        addQuadraticBezier,
        addCubicBezier,
        addRectangle,
        addSquare,
        addPolygon,

        changeHelper,
        changeLength,
        changeAngle,

        getPoint,

        deleteShape,
    }
});

export { useGeometryStore, Types };
export type {
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
    polygonConfig
};
