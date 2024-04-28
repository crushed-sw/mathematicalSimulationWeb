import { reactive } from "vue"
import { defineStore } from "pinia";

type commond = {
    id: number,
    x: number,
    y: number,
    currX: number,
    currY: number,
    in: number[],
    out: number[],
    inDependence: number[],
    outDependence: number[],
    rotate: number,
    scaleX: number,
    scaleY: number,
}

type line = {
    id: number,
    points: number[],
    in: number,
    inId: number,
    outId: number,
    inDependence: number,
    outDependence: number,
}

enum State {
    None,
    BufGate,
    NotGate,
    AndGate,
    AndNotGate,
    OrGate,
    OrNotGate,
    XnorGate,
    XnorNotGate,
    ThreeAndGate,
    ThreeAndNotGate,
    ThreeOrGate,
    ThreeOrNotGate,
    ThreeXnorGate,
    ThreeXnorNotGate,
    SwitchOne,
    SwitchTwo,
    DigitalValue,
    DigitalClock,
    Blub,
}

const useDigitCircuitStore = defineStore("digitCircuitStore", () => {
    const annotation = reactive({
        x: 0,
        y: 0,
        visible: false,
        value: "",
    });

    const menu = reactive({
        id: -1,
        x: 0,
        y: 0,
        visible: false,
    });

    const drawLine = reactive({
        is: false,
        begin: [] as number[],
        beginId: -1,
        beginNum: -1,
        end: [] as number[],
        endId: -1,
        endNum: -1,
    });

    const global = reactive({
        state: State.None,
        ctrl: false,
        hover: -1,
        selected: [] as number[],
        drag: false,
        dragToDraw: false,
    });

    const stateMap: Map<number, State> = new Map();
    const boolArray: number[][] = reactive([]);

    const lineArray: line[] = reactive([]);
    const bufGateArray: commond[] = reactive([]);
    const notGateArray: commond[] = reactive([]);
    const andGateArray: commond[] = reactive([]);
    const andNotGateArray: commond[] = reactive([]);
    const orGateArray: commond[] = reactive([]);
    const orNotGateArray: commond[] = reactive([]);
    const xnorGateArray: commond[] = reactive([]);
    const xnorNotGateArray: commond[] = reactive([]);
    const threeAndGateArray: commond[] = reactive([]);
    const threeAndNotGateArray: commond[] = reactive([]);
    const threeOrGateArray: commond[] = reactive([]);
    const threeOrNotGateArray: commond[] = reactive([]);
    const threeXnorGateArray: commond[] = reactive([]);
    const threeXnorNotGateArray: commond[] = reactive([]);
    const switchOneArray: commond[] = reactive([]);
    const switchTwoArray: commond[] = reactive([]);
    const digitValueArray: commond[] = reactive([]);
    const digitClockArray: commond[] = reactive([]);
    const blubArray: commond[] = reactive([]);

    let id = 0;

    function rotatePoint(x: number, y: number, rotate: number, scaleX: number,  scaleY: number, centerX: number, centerY: number) {
        const angle = rotate * Math.PI / 180;
        let rx = x * Math.cos(angle) - y * Math.sin(angle);
        let ry = x * Math.sin(angle) + y * Math.cos(angle);

        if(rotate % 180 === 0) {
            rx *= scaleX;
            ry *= scaleY;
        } else {
            rx *= scaleY;
            ry *= scaleX;
        }

        return [centerX + rx, centerY + ry];
    }

    function oneInputGateValues(id: number) {
        const element = getElementInArr(id);
        const inputPosition = rotatePoint(-40, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const outputPosition = rotatePoint(40, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);

        return [inputPosition, outputPosition];
    }

    function twoInputGateValues(id: number) {
        const element = getElementInArr(id);
        const input1Position = rotatePoint(-50, -20, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const input2Position = rotatePoint(-50, 20, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const outputPosition = rotatePoint(50, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);

        return [input1Position, input2Position, outputPosition];
    }

    function threeInputGateValues(id: number) {
        const element = getElementInArr(id);
        const input1Position = rotatePoint(-50, -20, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const input2Position = rotatePoint(-50, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const input3Position = rotatePoint(-50, 20, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const outputPosition = rotatePoint(50, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);

        return [input1Position, input2Position, input3Position, outputPosition];
    }

    function sourceGateValues(id: number) {
        const element = getElementInArr(id);
        const outputPosition = rotatePoint(30, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);

        return [outputPosition];
    }

    function blubValues(id: number) {
        const element = getElementInArr(id);
        const inputPosition = rotatePoint(-30, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);

        return [inputPosition];
    }

    function towSwitchValues(id: number) {
        const element = getElementInArr(id);
        const inputPosition = rotatePoint(-40, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const output1Position = rotatePoint(40, -20, element.rotate, element.scaleX, element.scaleY, element.x, element.y);
        const output2Position = rotatePoint(40, 0, element.rotate, element.scaleX, element.scaleY, element.x, element.y);

        return [inputPosition, output1Position, output2Position];
    }

    function correctPosition(x: number, y: number, state: State) {
        let currentX = 0;
        let currentY = 0;
        switch(state) {
            case State.BufGate:
            case State.NotGate:
            case State.SwitchOne:
            case State.SwitchTwo:
                currentX = Math.floor((x + 10) / 20) * 20;
                currentY = Math.floor((y + 10) / 20) * 20;
                break;
            case State.AndGate:
            case State.AndNotGate:
            case State.OrGate:
            case State.OrNotGate:
            case State.XnorGate:
            case State.XnorNotGate:
            case State.ThreeAndGate:
            case State.ThreeAndNotGate:
            case State.ThreeOrGate:
            case State.ThreeOrNotGate:
            case State.ThreeXnorGate:
            case State.ThreeXnorNotGate:
            case State.DigitalValue:
            case State.DigitalClock:
            case State.Blub:
                currentX = Math.floor(x / 20) * 20 + 10;
                currentY = Math.floor((y + 10) / 20) * 20;
                break;
        }

        return [currentX, currentY];
    }

    function addElement(state: State, x: number, y: number) {
        stateMap.set(id, state);
        const position = correctPosition(x, y, state);

        const initConfig = {
            id: id,
            x: position[0],
            y: position[1],
            currX: position[0],
            currY: position[1],
            inDependence: [-1, -1, -1],
            outDependence: [-1, -1, -1],
            in: [-1, -1, -1],
            out: [-1, -1, -1],
            rotate: 0,
            scaleX: 1,
            scaleY: 1,
        };

        switch(state) {
            case State.BufGate:
                bufGateArray.push(initConfig);
                break;
            case State.NotGate:
                notGateArray.push(initConfig);
                break;
            case State.AndGate:
                andGateArray.push(initConfig);
                break;
            case State.AndNotGate:
                andNotGateArray.push(initConfig);
                break;
            case State.OrGate:
                orGateArray.push(initConfig);
                break;
            case State.OrNotGate:
                orNotGateArray.push(initConfig);
                break;
            case State.XnorGate:
                xnorGateArray.push(initConfig);
                break;
            case State.XnorNotGate:
                xnorNotGateArray.push(initConfig);
                break;
            case State.ThreeAndGate:
                threeAndGateArray.push(initConfig);
                break;
            case State.ThreeAndNotGate:
                threeAndNotGateArray.push(initConfig);
                break;
            case State.ThreeOrGate:
                threeOrGateArray.push(initConfig);
                break;
            case State.ThreeOrNotGate:
                threeOrNotGateArray.push(initConfig);
                break;
            case State.ThreeXnorGate:
                threeXnorGateArray.push(initConfig);
                break;
            case State.ThreeXnorNotGate:
                threeXnorNotGateArray.push(initConfig);
                break;
            case State.SwitchOne:
                switchOneArray.push(initConfig);
                break;
            case State.SwitchTwo:
                switchTwoArray.push(initConfig);
                break;
            case State.DigitalValue:
                initConfig.out[0] = 0;
                digitValueArray.push(initConfig);
                break;
            case State.DigitalClock:
                initConfig.out[0] = 0;
                digitClockArray.push(initConfig);
                break;
            case State.Blub:
                blubArray.push(initConfig);
                break;
        }
        id++;
    }

    function deleteFromArray(arr: any[], idValue: number) {
        let index = arr.findIndex((value: any) => value.id === idValue);
        if(index > -1) {
            arr.splice(index, 1);
        }
    }

    function getArray(state: State): any {
        let arr: any = undefined;
        switch(state) {
            case State.BufGate:
                arr = bufGateArray;
                break;
            case State.NotGate:
                arr = notGateArray;
                break;
            case State.AndGate:
                arr = andGateArray;
                break;
            case State.AndNotGate:
                arr = andNotGateArray;
                break;
            case State.OrGate:
                arr = orGateArray;
                break;
            case State.OrNotGate:
                arr = orNotGateArray;
                break;
            case State.XnorGate:
                arr = xnorGateArray;
                break;
            case State.XnorNotGate:
                arr = xnorNotGateArray;
                break;
            case State.ThreeAndGate:
                arr = threeAndGateArray;
                break;
            case State.ThreeAndNotGate:
                arr = threeAndNotGateArray;
                break;
            case State.ThreeOrGate:
                arr = threeOrGateArray;
                break;
            case State.ThreeOrNotGate:
                arr = threeOrNotGateArray;
                break;
            case State.ThreeXnorGate:
                arr = threeXnorGateArray;
                break;
            case State.ThreeXnorNotGate:
                arr = threeXnorNotGateArray;
                break;
            case State.SwitchOne:
                arr = switchOneArray;
                break;
            case State.SwitchTwo:
                arr = switchTwoArray;
                break;
            case State.DigitalValue:
                arr = digitValueArray;
                break;
            case State.DigitalClock:
                arr = digitClockArray;
                break;
            case State.Blub:
                arr = blubArray;
                break;
        }
        return arr;
    }

    function getArrayById(id: number): any {
        const stateValue = stateMap.get(id);
        if(stateValue !== undefined) {
            return getArray(stateValue);
        }
    }

    function getElementInArr(idValue: number): any {
        const arr = getArrayById(idValue);
        if(arr !== undefined) {
            for(let i = 0; i !== arr.length; ++i) {
                if(arr[i].id === idValue) {
                    return arr[i];
                }
            }
        }
        return undefined;
    }

    function deleteElement() {
        global.selected.forEach((select: number) => {
            const arr = getArrayById(select);
            if(arr !== undefined) {
                deleteFromArray(arr, select);
            }
        });
        global.selected = [];
        annotation.visible = false;
    }

    function moveElementHelper(arr: any[], idValue: number, dx: number, dy: number, isCorrect: boolean, state: State) {
        for(let i = 0; i != arr.length; ++i) {
            if(arr[i].id === idValue) {
                arr[i].currX += dx;
                arr[i].currY += dy;

                const position = correctPosition(arr[i].currX, arr[i].currY, state);
                arr[i].x = position[0];
                arr[i].y = position[1];
                if(isCorrect) {
                    arr[i].currX = position[0];
                    arr[i].currY = position[1];
                }
                break;
            }
        }
    }

    function moveElement(dx: number, dy: number, isCorrect: boolean = false) {
        global.selected.forEach((selectValue: number) => {
            const stateValue = stateMap.get(selectValue);
            if(stateValue !== undefined) {
                const arr = getArray(stateValue);
                if(arr !== undefined) {
                    moveElementHelper(arr, selectValue, dx, dy, isCorrect, stateValue);
                }
            }
        });
    }

    function addLine() {
        const beginElement = getElementInArr(drawLine.beginId);
        const endElement = getElementInArr(drawLine.endId);

        console.log(beginElement.out, beginElement.out[drawLine.beginNum]);

        lineArray.push({
            id: id,
            points: [...drawLine.begin, ...drawLine.end],
            in: beginElement.out[drawLine.beginNum],
            inId: drawLine.endId,
            outId: drawLine.beginId,
            inDependence: drawLine.endNum,
            outDependence: drawLine.beginNum,
        });
        endElement.in[drawLine.endNum] = beginElement.out[drawLine.beginNum];

        beginElement.outDependence[drawLine.beginNum] = id;
        endElement.inDependence[drawLine.endNum] = id;

        id++;
    }

    function getLine(idValue: number) {
        for(let i = 0; i !== lineArray.length; ++i) {
            if(lineArray[i].id === idValue) {
                return lineArray[i];
            }
        }
        return undefined;
    }

    return {
        annotation,
        menu,
        global,
        drawLine,

        bufGateArray,
        notGateArray,
        andGateArray,
        andNotGateArray,
        orGateArray,
        orNotGateArray,
        xnorGateArray,
        xnorNotGateArray,
        threeAndGateArray,
        threeAndNotGateArray,
        threeOrGateArray,
        threeOrNotGateArray,
        threeXnorGateArray,
        threeXnorNotGateArray,
        switchOneArray,
        switchTwoArray,
        digitValueArray,
        digitClockArray,
        blubArray,
        lineArray,
        boolArray,

        addElement,
        deleteElement,
        moveElement,
        getArrayById,
        getElementInArr,
        getLine,

        oneInputGateValues,
        twoInputGateValues,
        threeInputGateValues,
        sourceGateValues,
        blubValues,
        towSwitchValues,
        addLine,
    }
});

export { useDigitCircuitStore, State };
