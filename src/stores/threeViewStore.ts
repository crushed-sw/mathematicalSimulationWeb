import { defineStore } from "pinia";
import { ref, reactive } from "vue"

enum State {
    None,
    Line,
    MultiLine,
    Dash,
    MultiDash,
    Point,
    MultiPoint,
};

enum DrawBoardState {
    None,
    Font,
    Left,
    Top,
    All,
};

type pointConfig = {
    index: number,
    x: number,
    y: number,
    visible: boolean,
    mask: boolean,
    attr: string,
    callBack: Function,
    roots: {
        type: State,
        index: number,
    }[],
};

type lineConfig = {
    index: number,
    points: number[],
    mask: boolean,
    attr: string,
    leaves: number[],
    helps: number[],
};

type dashConfig = {
    index: number,
    points: number[],
    mask: boolean,
    attr: string,
    leaves: number[],
    helps: number[],
};

function getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const useThreeViewStore = defineStore("threeViewStore", () => {
    const allShape: Map<string, State> = new Map();

    const fontPointList: pointConfig[] = reactive([]);
    const fontLineList: lineConfig[] = reactive([]);
    const fontDashList: dashConfig[] = reactive([]);
    const fontAllPointList: pointConfig[] = reactive([]);

    const leftPointList: pointConfig[] = reactive([]);
    const leftLineList: lineConfig[] = reactive([]);
    const leftDashList: dashConfig[] = reactive([]);
    const leftAllPointList: pointConfig[] = reactive([]);

    const topPointList: pointConfig[] = reactive([]);
    const topLineList: lineConfig[] = reactive([]);
    const topDashList: dashConfig[] = reactive([]);
    const topAllPointList: pointConfig[] = reactive([]);

    const global = reactive({
        ctrl: false,
        shift: false,
    });

    const fontGlobal = reactive({
        drawing: false,
        moving: false,
        x: 0,
        y: 0,
        hover: 0,
        hoverState: State.None,
        clicked: [] as number[],
    });

    const leftGlobal = reactive({
        drawing: false,
        moving: false,
        x: 0,
        y: 0,
        hover: 0,
        hoverState: State.None,
        clicked: [] as number[],
    });

    const topGlobal = reactive({
        drawing: false,
        moving: false,
        x: 0,
        y: 0,
        hover: 0,
        hoverState: State.None,
        clicked: [] as number[],
    });

    const drawBoardState = ref(DrawBoardState.None);

    let fontId = 1;
    let leftId = 1;
    let topId = 1;

    function pointCallBack(index: number, attr: string, parentIndex: number = -1) {
        const list = getPointList(attr);
        if(list) {
            const point = getPoint(index, list);
            if(point) {
                point.roots.forEach((root) => {
                    if(root.index !== parentIndex) {
                        switch(root.type) {
                            case State.Line:
                                linePointsHandle(root.index, attr);
                                break;
                            case State.Dash:
                                dashPointsHandle(root.index, attr);
                                break;
                        }
                    }
                });
            }
        }
    }

    function linePointsHandle(index: number, attr: string) {
        const list = getLineList(attr);
        const pointList = getPointList(attr);

        if(list && pointList) {
            const line = getLine(index, list);
            if(line) {
                const left = getPoint(line.leaves[0], pointList);
                const right = getPoint(line.leaves[1], pointList);

                if(left && right) {
                    line.points = [left.x, left.y, right.x, right.y];
                }

                const num = line.helps.length;
                const unitX = (line.points[2] - line.points[0]) / (num + 1);
                const unitY = (line.points[3] - line.points[1]) / (num + 1);

                for(let i = 0; i < num; ++i) {
                    const pointConfig = getPoint(line.helps[i], pointList);
                    if(pointConfig) {
                        pointConfig.x = line.points[0] + (i + 1) * unitX;
                        pointConfig.y = line.points[1] + (i + 1) * unitY;
                    }
                }

                line.helps.forEach((leave: number) => {
                    pointCallBack(leave, attr, index);
                });
            }
        }
    }

    function dashPointsHandle(index: number, attr: string) {
        const list = getDashList(attr);
        const pointList = getPointList(attr);
        if(list && pointList) {
            const line = getDash(index, list);
            if(line) {
                const left = getPoint(line.leaves[0], pointList);
                const right = getPoint(line.leaves[1], pointList);

                if(left && right) {
                    line.points = [left.x, left.y, right.x, right.y];
                }

                const num = line.helps.length;
                const unitX = (line.points[2] - line.points[0]) / (num + 1);
                const unitY = (line.points[3] - line.points[1]) / (num + 1);

                for(let i = 0; i < num; ++i) {
                    const pointConfig = getPoint(line.helps[i], pointList);
                    if(pointConfig) {
                        pointConfig.x = line.points[0] + (i + 1) * unitX;
                        pointConfig.y = line.points[1] + (i + 1) * unitY;
                    }
                }

                line.helps.forEach((leave: number) => {
                    pointCallBack(leave, attr, index);
                });
            }
        }
    }

    function getAllPointList(attr: string) {
        let list = undefined;
        if(attr === "font") {
            list = fontAllPointList;
        } else if(attr === "left") {
            list = leftAllPointList;
        } else if(attr === "top") {
            list = topAllPointList;
        }

        return list
    }

    function getPointList(attr: string) {
        let list = undefined;
        if(attr === "font") {
            list = fontPointList;
        } else if(attr === "left") {
            list = leftPointList;
        } else if(attr === "top") {
            list = topPointList;
        }

        return list
    }

    function getLineList(attr: string) {
        let list = undefined;
        if(attr === "font") {
            list = fontLineList;
        } else if(attr === "left") {
            list = leftLineList;
        } else if(attr === "top") {
            list = topLineList;
        }

        return list
    }

    function getDashList(attr: string) {
        let list = undefined;
        if(attr === "font") {
            list = fontDashList;
        } else if(attr === "left") {
            list = leftDashList;
        } else if(attr === "top") {
            list = topDashList;
        }

        return list
    }

    function getPoint(index: number, list: pointConfig[]): pointConfig | undefined {
        for(let i = 0; i !== list.length; ++i) {
            if(list[i].index === index) {
                return list[i];
            }
        }
        return undefined;
    }

    function getLine(index: number, list: lineConfig[]): lineConfig | undefined {
        for(let i = 0; i !== list.length; ++i) {
            if(list[i].index === index) {
                return list[i];
            }
        }
        return undefined;
    }

    function getDash(index: number, list: dashConfig[]): dashConfig | undefined {
        for(let i = 0; i !== list.length; ++i) {
            if(list[i].index === index) {
                return list[i];
            }
        }
        return undefined;
    }

    function addCommondPoint(x: number, y: number, index: number, parentIndex: number, parentState: State, attr: string) {
        if(index > 0) {
            const list = getPointList(attr);
            if(list) {
                const point = getPoint(index, list);
                if(point) {
                    point.roots.push({ type: parentState, index: parentIndex });
                }
            }
            return index;
        } else {
            const list = getPointList(attr);
            const config = {
                index: -1,
                x,
                y,
                visible: true,
                mask: false,
                callBack: () => { return pointCallBack(config.index, attr); },
                attr,
                roots: [{ type: parentState, index: parentIndex }],
            } as pointConfig;

            if(attr === "font") {
                config.index = fontId++;
                allShape.set(`font${config.index}`, State.Point);
            } else if(attr === "left") {
                config.index = leftId++;
                allShape.set(`left${config.index}`, State.Point);
            } else if(attr === "top") {
                config.index = topId++;
                allShape.set(`top${config.index}`, State.Point);
            }
            const allPointList = getAllPointList(attr);

            allPointList?.push(config);
            list?.push(config);

            return config.index;
        }
    }

    function addPoint(x: number, y: number, attr: string, leaves: number) {
        if(leaves > 0) {
            return;
        }

        const list = getPointList(attr);
        const config = {
            index: -1,
            x,
            y,
            visible: true,
            mask: false,
            callBack: () => { return pointCallBack(config.index, attr); },
            attr,
            roots: [],
        } as pointConfig;

        if(attr === "font") {
            config.index = fontId++;
            allShape.set(`font${config.index}`, State.Point);
        } else if(attr === "left") {
            config.index = leftId++;
            allShape.set(`left${config.index}`, State.Point);
        } else if(attr === "top") {
            config.index = topId++;
            allShape.set(`top${config.index}`, State.Point);
        }

        const allPointList = getAllPointList(attr);

        allPointList?.push(config);
        list?.push(config);
    }

    function addLine(points: number[], leaves: number[], attr: string) {
        const list = getLineList(attr);
        const config = {
            index: 0,
            points,
            visible: true,
            mask: false,
            attr,
            leaves,
            helps: [],
        } as lineConfig ;

        if(attr === "font") {
            config.index = fontId++;
            allShape.set(`font${config.index}`, State.Line);
        } else if(attr === "left") {
            config.index = leftId++;
            allShape.set(`left${config.index}`, State.Line);
        } else if(attr === "top") {
            config.index = topId++;
            allShape.set(`top${config.index}`, State.Line);
        }

        const left = addCommondPoint(points[0], points[1], leaves[0], config.index, State.Line, attr);
        const right = addCommondPoint(points[2], points[3], leaves[1], config.index, State.Line, attr);
        config.leaves = [left, right];

        list?.push(config);
    }

    function addDash(points: number[], leaves: number[], attr: string) {
        const list = getDashList(attr);
        const config = {
            index: 0,
            points,
            visible: true,
            mask: false,
            attr,
            leaves,
            helps: [],
        } as dashConfig ;

        if(attr === "font") {
            config.index = fontId++;
            allShape.set(`font${config.index}`, State.Dash);
        } else if(attr === "left") {
            config.index = leftId++;
            allShape.set(`left${config.index}`, State.Dash);
        } else if(attr === "top") {
            config.index = topId++;
            allShape.set(`top${config.index}`, State.Dash);
        }

        const left = addCommondPoint(points[0], points[1], leaves[0], config.index, State.Dash, attr);
        const right = addCommondPoint(points[2], points[3], leaves[1], config.index, State.Dash, attr);
        config.leaves = [left, right];

        list?.push(config);
    }

    function deletePoint(index: number, attr: string) {
        const list = getPointList(attr);
        const allPointList = getAllPointList(attr);

        if(list && allPointList) {
            const point = getPoint(index, list);
            if(point) {
                const roots = point.roots;
                const indexNumber: number = list.findIndex((element: pointConfig) => element.index === index);
                if (indexNumber !== -1) {
                    list.splice(indexNumber, 1);
                }

                const pointIndexNumber: number = allPointList.findIndex((element: pointConfig) => element.index === index);
                if (pointIndexNumber !== -1) {
                    allPointList.splice(pointIndexNumber, 1);
                }

                roots.forEach((root) => {
                    deleteShapeWithType(root.index, root.type, attr);
                });
            }
        }
    }

    function deleteLeavePoints(index: number, parentIndex: number, attr: string) {
        const list = getPointList(attr);
        const allPointList = getAllPointList(attr);

        if(list && allPointList) {
            const point = getPoint(index, list);
            if(point) {
                if(point.roots.length < 1) {
                    const indexNumber: number = list.findIndex((element: pointConfig) => element.index === index);
                    if (indexNumber !== -1) {
                        list.splice(indexNumber, 1);
                    }
                    const pointIndexNumber: number = allPointList.findIndex((element: pointConfig) => element.index === index);
                    if (pointIndexNumber !== -1) {
                        allPointList.splice(pointIndexNumber, 1);
                    }
                } else if(point.roots.length === 1) {
                    if(point.roots[0].index === parentIndex) {
                        const indexNumber: number = list.findIndex((element: pointConfig) => element.index === index);
                        if (indexNumber !== -1) {
                            list.splice(indexNumber, 1);
                        }
                        const pointIndexNumber: number = allPointList.findIndex((element: pointConfig) => element.index === index);
                        if (pointIndexNumber !== -1) {
                            allPointList.splice(pointIndexNumber, 1);
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
    }

    function deleteShapeHelper(getList: Function, getShape: Function, id: number, attr: string) {
        const list = getList(attr);
        if(list) {
            const shape = getShape(id, list);
            if(shape) {
                const leaves = shape.leaves;
                let helper = [];
                if(shape.helps) {
                    helper = shape.helps;
                }

                const index: number = list.findIndex((element: any) => element.index === id);
                if (index !== -1) {
                    list.splice(index, 1);
                }

                leaves.forEach((leave: number) => {
                    deleteLeavePoints(leave, id, attr);
                });
                helper.forEach((leave: number) => {
                    deleteLeavePoints(leave, id, attr);
                });
            }
        }
    }

    function deleteShapeWithType(index: number, state: State, attr: string) {
        switch(state) {
            case State.Point:
                deletePoint(index, attr);
                break;
            case State.Line:
                deleteShapeHelper(getLineList, getLine, index, attr);
                break;
            case State.Dash:
                deleteShapeHelper(getDashList, getDash, index, attr);
                break;
        }
    }

    function deleteShape(index: number, attr: string) {
        if(attr === "font") {
            fontGlobal.clicked = [];
            fontGlobal.hover = 0;
            fontGlobal.hoverState = State.None;
        } else if(attr === "left") {
            leftGlobal.clicked = [];
            leftGlobal.hover = 0;
            leftGlobal.hoverState = State.None;
        } else if(attr === "top") {
            topGlobal.clicked = [];
            topGlobal.hover = 0;
            topGlobal.hoverState = State.None;
        }

        const types = allShape.get(attr + index);
        if(types !== undefined) {
            deleteShapeWithType(index, types, attr);
        }
    }

    function changeHelper(index: number, num: number, attr: string) {
        const isIn = allShape.get(attr + index);
        if(isIn) {
            if(isIn !== State.Line && isIn !== State.Dash) {
                return;
            }
        }

        let list = undefined;
        let line = undefined;
        let state = State.None;
        if(isIn === State.Line) {
            list = getLineList(attr);
            state = State.Line;
            if(list) {
                line = getLine(index, list);
            }
        } else if(isIn === State.Dash) {
            list = getDashList(attr);
            state = State.Dash;
            if(list) {
                line = getDash(index, list);
            }
        }

        if(line) {
            if(!line.helps) {
                line.helps = [];
            }

            line.helps.forEach((pointIndex: number) => {
                deleteLeavePoints(pointIndex, index, attr);
            });
            line.helps = [];

            if(num !== 0) {
                const unitX = (line.points[2] - line.points[0]) / (num + 1);
                const unitY = (line.points[3] - line.points[1]) / (num + 1);

                for(let i = 1; i <= num; ++i) {
                    line.helps.push(addCommondPoint(line.points[0] + i * unitX,
                                                    line.points[1] + i * unitY,
                                                    -1, line.index, state, attr));
                }
            }
        }
    }

    function changePointLength(index1: number, index2: number, len: number, attr: string) {
        const isIn1 = allShape.get(attr + index1);
        const isIn2 = allShape.get(attr + index2);
        if(isIn1 !== State.Point || isIn2 !== State.Point) {
            return;
        }

        const pointList = getPointList(attr);

        if(pointList) {
            const left = getPoint(index1, pointList);
            const right = getPoint(index2, pointList);
            if(left && right) {
                const theta = Math.atan2(right.y - left.y, right.x - left.x);

                right.x = left.x + len * Math.cos(theta);
                right.y = left.y + len * Math.sin(theta);
                pointCallBack(right.index, attr);
            }
        }
    }

    function changeLineLength(index: number, len: number, attr: string) {
        const isIn = allShape.get(attr + index);
        if(isIn !== State.Line) {
            return;
        }

        const lineList = getLineList(attr);
        const dashList = getDashList(attr);
        const pointList = getPointList(attr);

        if(lineList && dashList && pointList) {
            let line = undefined;
            if(isIn === State.Line) {
                line = getLine(index, lineList);
            } else if(isIn === State.Dash) {
                line = getDash(index, dashList);
            }

            if(line) {
                const left = getPoint(line.leaves[0], pointList);
                const right = getPoint(line.leaves[1], pointList);
                if(left && right) {
                    const theta = Math.atan2(right.y - left.y, right.x - left.x);

                    right.x = left.x + len * Math.cos(theta);
                    right.y = left.y + len * Math.sin(theta);
                    pointCallBack(right.index, attr);
                }
            }
        }
    }

    function changePointAngle(index1: number, index2: number, index3: number, angle: number, attr: string) {
        const isIn1 = allShape.get(attr + index1);
        const isIn2 = allShape.get(attr + index2);
        const isIn3 = allShape.get(attr + index3);
        if(isIn1 !== State.Point || isIn2 !== State.Point || isIn3 !== State.Point) {
            return;
        }

        const list = getPointList(attr);
        if(list) {
            const point1 = getPoint(index1, list);
            const point2 = getPoint(index2, list);
            const point3 = getPoint(index3, list);
            if(point1 && point2 && point3) {
                const theta = Math.atan2(point1.y - point2.y, point1.x - point2.x);
                const angleTheta = angle * Math.PI / 180;

                const distance = getDistance(point2.x, point2.y, point3.x, point3.y);
                point3.x = point2.x + distance * Math.cos(theta - angleTheta);
                point3.y = point2.y + distance * Math.sin(theta - angleTheta);
                pointCallBack(point3.index, attr);
            }
        }
    }

    function changeLineAngle(index1: number, index2: number, angle: number, attr: string) {
        const isIn1 = allShape.get(attr + index1);
        const isIn2 = allShape.get(attr + index2);
        if(isIn1 === State.None || isIn1 === State.Point || isIn2 === State.None || isIn2 === State.Point) {
            return;
        }

        const lineList = getLineList(attr);
        const dashList = getDashList(attr);
        const pointList = getPointList(attr);

        if(lineList && dashList && pointList) {
            let line1 = undefined;
            let line2 = undefined;

            if(isIn1 === State.Line) {
                line1 = getLine(index1, lineList);
            } else if(isIn1 === State.Dash) {
                line1 = getDash(index1, dashList);
            }

            if(isIn2 === State.Line) {
                line2 = getLine(index2, lineList);
            } else if(isIn2 === State.Dash) {
                line2 = getDash(index2, dashList);
            }

            if(line1 && line2) {
                const theta = Math.atan2(line1.points[1] - line1.points[3], line1.points[0] - line1.points[2]);
                const angleTheta = angle * Math.PI / 180;

                const distance = getDistance(line2.points[0], line2.points[1], line2.points[2], line2.points[3]);

                const point = getPoint(line2.leaves[1], pointList);
                if(point) {
                    point.x = line2.points[0] + distance * Math.cos(theta - angleTheta);
                    point.y = line2.points[1] + distance * Math.sin(theta - angleTheta);
                    pointCallBack(point.index, attr);
                }
            }
        }
    }

    function changeLength(id: number[], len: number, type: State, attr: string) {
        if(type === State.Point) {
            console.log(id, len, attr);
            changePointLength(id[0], id[1], len, attr);
        } else {
            console.log(id, len, attr);
            changeLineLength(id[0], len, attr);
        }
    }

    function changeAngle(id: number[], angle: number, type: State, attr: string) {
        if(type === State.Point) {
            changePointAngle(id[0], id[1], id[2], angle, attr);
        } else {
            changeLineAngle(id[0], id[1], angle, attr);
        }
    }

    return {
        drawBoardState,
        fontGlobal,
        leftGlobal,
        topGlobal,
        global,

        allShape,

        fontPointList,
        fontLineList,
        fontDashList,
        fontAllPointList,

        leftPointList,
        leftLineList,
        leftDashList,
        leftAllPointList,

        topPointList,
        topLineList,
        topDashList,
        topAllPointList,

        getPointList,
        getLineList,
        getDashList,
        getPoint,
        getLine,
        getDash,

        addPoint,
        addLine,
        addDash,

        deleteShape,

        changeHelper,
        changeAngle,
        changeLength,
    }
});

export { useThreeViewStore, State, DrawBoardState }
export type { pointConfig, lineConfig, dashConfig }
