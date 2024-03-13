import { defineStore } from "pinia";
import { ref, reactive } from "vue"

const useFunctionStore = defineStore("functionStore", () => {
    let leftSideShow = ref(true);
    let rightSideShow = ref(false);
    let isLeftSetting = ref(false);

    let updateAllFunctionFlag = {
        commondFunction: false,
        polarFunction: false,
        parameterFunction: false,
        implicitFunction: false,
    }

    let focus = ref(-1);

    const annotation = reactive({
        xScale: 0,
        yScale: 0,
        xPx: 0,
        yPx: 0,
        isVisible: false,
    });

    const coordinateInterval = reactive({
        x: 0,
        y: 0,
        minorX: 0,
        minorY: 0,
    });

    const functionColors = [
        "#000000",
        "#c74440",
        "#2d70b3",
        "#388c46",
        "#6042a6",
    ];

    let canvasConfig = reactive({
        width: window.innerWidth,
        height: window.innerHeight,
        xScope: [-10, 10],
        yScope: [-10, 10],
        xLen: 20,
        yLen: 20,
        coordinate: 1,
        isScaleText: true,
        isXAxis: true,
        isYAxis: true,
        isMinorAxis: true,
        isGride: true,
        showNumbers: false,
        triangleNumber: false,
    });

    let checkedNumber = ref(-1);
    let coordinate = ref(1);

    let normalFunctionLists: any[] = reactive([]);
    let reverseFunctionLists: any[] = reactive([]);
    let normalEqualFunctionLists: any[] = reactive([]);
    let reverseEqualFunctionLists: any[] = reactive([]);
    let lackConstantFunction: any[] = reactive([]);
    let polarFunctionLists: any[] = reactive([]);
    let parameterFunctionLists: any[] = reactive([]);
    let implicitFunctionLists: any[] = reactive([]);
    let customPointLists: any[] = reactive([]);
    let constantValue: Map<string, number> = reactive(new Map());

    let functionLists = reactive({
        number: 2,
        items: [
            {
                value: "",
                id: 0,
                color: functionColors[1],
                result: {} as any,
                beginValue: "" as any,
                unknowns: [] as string[],
                variables: [] as string[],
                isVisible: true,
                isValid: true,
                type: 0,
                points: [] as any,
                tangentLine: [] as any[],
                scope: [] as number[],
                range: [] as any,
                rangeSlider: [0, 100],
                constantValue: 0,
                sliderPercent: 50,
                func: new Function("") as any,
                mathField: null as any,
            },
        ],
    });

    function addFunction() {
        const colorNumber = functionLists.number === 0 ? 1 : functionLists.number % functionColors.length;
        functionLists.items.push({
            value: "",
            id: functionLists.number,
            color: functionColors[colorNumber],
            result: {} as any,
            beginValue: "" as any,
            unknowns: [],
            variables: [],
            isVisible: true,
            isValid: true,
            type: 0,
            points: [] as any,
            tangentLine: [] as any[],
            scope: [] as number[],
            range: [] as any,
            rangeSlider: [0, 100],
            constantValue: 0,
            sliderPercent: 50,
            func: new Function("") as any,
            mathField: null,
        });

        if(functionLists.number === 0) {
            functionLists.number += 2;
        } else {
            functionLists.number++;
        }
    }

    function deleteFunction(index: number) {
        const flag = functionLists.items[index].id === 0;
        functionLists.items.splice(index, 1);

        if(functionLists.items.length === 0) {
            functionLists.number = 0;
            if(flag) {
                functionLists.number++;
            }
            addFunction();
        }
    }

    function updateXLen() {
        canvasConfig.xLen = canvasConfig.xScope[1] - canvasConfig.xScope[0];
    }

    function updateYLen() {
        canvasConfig.yLen = canvasConfig.yScope[1] - canvasConfig.yScope[0];
    }

    function yPxToScale(numY: number) {
        return canvasConfig.yScope[1] - (numY * (canvasConfig.yLen / canvasConfig.height));
    }

    function xPxToScale(numX: number) {
        return canvasConfig.xScope[0] + (numX * (canvasConfig.xLen / canvasConfig.width));
    }

    function xScaleToPx(numX: number) {
        return (canvasConfig.width / canvasConfig.xLen) * (numX - canvasConfig.xScope[0]);
    }

    function yScaleToPx(numY: number) {
        return (canvasConfig.height / canvasConfig.yLen) * (canvasConfig.yScope[1] - numY);
    }

    return {
        leftSideShow,
        rightSideShow,
        checkedNumber,
        annotation,
        coordinateInterval,
        focus,

        xScaleToPx,
        yScaleToPx,
        xPxToScale,
        yPxToScale,

        coordinate,
        canvasConfig,

        isLeftSetting,
        functionLists,
        normalFunctionLists,
        reverseFunctionLists,
        normalEqualFunctionLists,
        reverseEqualFunctionLists,
        lackConstantFunction,
        polarFunctionLists,
        parameterFunctionLists,
        implicitFunctionLists,
        customPointLists,
        constantValue,

        addFunction,
        deleteFunction,

        updateXLen,
        updateYLen,

        updateAllFunctionFlag,
    }
});

export { useFunctionStore };

