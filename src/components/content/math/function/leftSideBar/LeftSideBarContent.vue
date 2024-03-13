<template>
    <div class="h-full w-full container overflow-y-scroll hidden-scroll">
        <SubMenu
            :subMenuPosition="subMenuPosition"
            :subMenuIndex="subMenuIndex"
            :subMenuVisible="isSubMenuVisible"
        ></SubMenu>

        <SlickList axis="y" v-model:list="functionStore.functionLists.items" useDragHandle>
            <SlickItem
                v-for="(element, index) in items"
                :key="element.id"
                :index="index"
                class="flex align-items-stretch border-top-1 surface-border"
            >
                <DragHandle>
                    <div class="h-full w-2rem" :style="{ backgroundColor: element.color }"></div>
                </DragHandle>
                <div class="flex flex-column w-full">
                    <div class="flex flex-1 math-live-container w-full pl-2">
                        <VueMathfield
                            default-mode="math"
                            class="inline-block w-full p-0"
                            :id="`mainMathInput${element.id}`"
                            @input="mathInput($event, index)"
                            @focus="mathFocus(index)"
                            @blur="mathBlur()"
                            @keydown="keyDown"
                        ></VueMathfield>
                        <div class="flex flex-column align-content-start">
                            <Button
                                text
                                class="hover:bg-green-100"
                                @click="deleteHandle(index, element)"
                                :style="{ height: [1, 2].includes(element.type) && element.isValid ? '50%' : '100%' }"
                            >
                                <template #icon>
                                    <font-awesome-icon :icon="['fas', 'xmark']" class="text-green-500"/>
                                </template>
                            </Button>
                            <Button
                                text
                                v-if="[1, 2].includes(element.type) && element.isValid"
                                class="hover:bg-green-100 h-half"
                                @click="addSubHandle($event, index)"
                            >
                                <template #icon>
                                    <font-awesome-icon :icon="['fas', 'add']" class="text-green-500"/>
                                </template>
                            </Button>
                        </div>
                    </div>

                    <div
                        class="flex flex-row align-items-center h-3rem border-top-1 surface-border pl-2"
                        v-for="(point, pointIndex) in functionStore.functionLists.items[index].points"
                        tabindex="0"
                        @focus="point.isClick = true"
                        @blur="point.isClick = false"
                    >
                        <i
                            v-show="!point.isClick"
                            v-html="katex.renderToString(`(${element.type % 2 ? point.x : point.y},${element.type % 2 ? point.y : point.x})`)"
                            class="flex-1 disable-select"
                        ></i>
                        <div v-show="point.isClick" class="scope flex-1">
                            <i
                                class="disable-select"
                                v-html="katex.renderToString(`${element.type % 2 ? 'x' : 'y'}=`)"
                            ></i>
                            <VueMathfield
                                default-mode="math"
                                class="inline-block w-auto ml-2 border-bottom-1"
                                @focus="point.isClick = true"
                                @blur="point.isClick = false"
                                @input="subPointInput($event, element, pointIndex, true)"
                            ></VueMathfield>
                        </div>
                        <Button text class="hover:bg-green-100 h-full" @click="subPointDelete(element, pointIndex, true)">
                            <template #icon>
                                <font-awesome-icon :icon="['fas', 'xmark']" class="text-green-500"/>
                            </template>
                        </Button>
                    </div>

                    <div
                        class="flex flex-row align-items-center h-3rem border-top-1 surface-border pl-2"
                        v-for="(line, lineIndex) in functionStore.functionLists.items[index].tangentLine"
                        tabindex="0"
                        @focus="line.isClick = true"
                        @blur="line.isClick = false"
                    >
                        <i
                            v-show="!line.isClick"
                            v-html="katex.renderToString(`${element.type % 2 === 0 ? 'x' : 'y'}=${line.slope}${line.yValue}`)"
                            class="flex-1 disable-select"
                        ></i>
                        <div v-show="line.isClick" class="scope flex-1">
                            <i
                                class="disable-select"
                                v-html="katex.renderToString(`${element.type % 2 ? 'x' : 'y'}=`)"
                            ></i>
                            <VueMathfield
                                default-mode="math"
                                class="inline-block w-auto ml-2 border-bottom-1"
                                @focus="line.isClick = true"
                                @blur="line.isClick = false"
                                @input="subPointInput($event, element, lineIndex, false)"
                            ></VueMathfield>
                        </div>
                        <Button text class="hover:bg-green-100 h-full" @click="subPointDelete(element, lineIndex, false)">
                            <template #icon>
                                <font-awesome-icon :icon="['fas', 'xmark']" class="text-green-500"/>
                            </template>
                        </Button>
                    </div>

                    <div
                        class="flex flex-row align-items-center justify-content-center h-3rem border-top-1 surface-border pl-2"
                        v-if="element.range.isActive && [1, 2, 3, 4].includes(element.type)"
                        tabindex="0"
                        @focus="element.range.isClick = true"
                        @blur="element.range.isClick = false"
                    >
                        <div
                            v-if="!element.range.isClick"
                            class="flex-1 flex align-items-center justify-content-center"
                        >
                            <i
                                class="disable-select"
                                v-html="katex.renderToString(`${element.range.left}`)"
                            ></i>
                            <Slider
                                range
                                v-model="element.rangeSlider"
                                class="flex-1 mx-3"
                                :disabled="!isFinite(element.range.leftValue) || !isFinite(element.range.rightValue)"
                                @change="rangeChange(element)"
                            ></Slider>
                            <i
                                class="disable-select"
                                v-html="katex.renderToString(`${element.range.right}`)"
                            ></i>
                        </div>
                        <div v-show="element.range.isClick" class="scope flex-1">
                            <VueMathfield
                                default-mode="math"
                                class="inline-block w-auto ml-2 border-bottom-1"
                                @focus="element.range.isClick = true"
                                @blur="element.range.isClick = false"
                                @input="rangeInput($event, element, true, false)"
                            ></VueMathfield>
                            <i
                                class="disable-select"
                                v-html="katex.renderToString(`\\leq ${element.type % 2 ? 'x' : 'y'}\\leq`)"
                            ></i>
                            <VueMathfield
                                default-mode="math"
                                class="inline-block w-auto ml-2 border-bottom-1"
                                @focus="element.range.isClick = true"
                                @blur="element.range.isClick = false"
                                @input="rangeInput($event, element, false, true)"
                            ></VueMathfield>
                        </div>
                        <Button text class="hover:bg-green-100 h-full" @click="deleteRange(element)">
                            <template #icon>
                                <font-awesome-icon :icon="['fas', 'xmark']" class="text-green-500"/>
                            </template>
                        </Button>
                    </div>

                    <div
                        v-if="element.type === 6 || element.type === 7"
                        class="flex align-items-center justify-content-center border-top-1 surface-border px-3 py-2 h-3rem scope"
                    >
                        <VueMathfield
                            default-mode="math"
                            class="inline-block w-auto px-2 border-bottom-1"
                            @input="specialFuncInput($event, element, true, false)"
                        >0</VueMathfield>
                        <Slider
                            range
                            v-if="true"
                            v-model="element.rangeSlider"
                            class="flex-1 mx-3"
                            :disabled="!element.isValid"
                            @change="specialSliderChange(element)"
                        ></Slider>
                        <VueMathfield
                            default-mode="math"
                            class="inline-block w-auto px-2 border-bottom-1"
                            @input="specialFuncInput($event, element, false, true)"
                        >{{element.type === 6 ? "2\\pi" : "1"}}</VueMathfield>
                    </div>

                    <div
                        v-if="element.type === 5"
                        class="flex align-items-center justify-content-center border-top-1 surface-border px-3 py-2 h-3rem scope"
                    >
                        <VueMathfield
                            default-mode="math"
                            class="inline-block w-auto px-2 border-bottom-1"
                            @input="constantScopeInput($event, element, true, false)"
                        >-10</VueMathfield>
                        <Slider
                            v-if="true"
                            v-model="element.sliderPercent"
                            class="flex-1 mx-3"
                            @change="constantChange(element)"
                        ></Slider>
                        <VueMathfield
                            default-mode="math"
                            class="inline-block w-auto px-2 border-bottom-1"
                            @input="constantScopeInput($event, element, false, true)"
                        >10</VueMathfield>
                    </div>
                </div>
            </SlickItem>
        </SlickList>

        <div class="border-top-1 surface-border add-element" @click="addElement">
            <div
                class="h-4rem w-2rem add-left-bar disable-select"
                v-html="katex.renderToString(`${items.length + 1}`)"
            >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useFunctionStore } from "@/stores/functionStore"
import { computed, ref, reactive } from "vue"
import Slider from 'primevue/slider';
import { SlickList, SlickItem, DragHandle } from 'vue-slicksort';
import * as MathLive from "@/assets/vueMathLive/mathlive.min.mjs";
import VueMathfield from "@/assets/vueMathLive/vue-mathlive.mjs";
import katex from "katex"
import nerdamer from "nerdamer"
import { ComputeEngine } from "@cortex-js/compute-engine"
import { parse, simplify, rationalize } from "mathjs"
import { parseMathJson } from "@/util/mathJsonToMathjs"
import { parseMathjs, Result } from "@/util/mathjsToMath"
import Button from 'primevue/button';
import SubMenu from "./SubMenu.vue";

const functionValue = `
function factorial(op) {
    const gammaValue = op + 1;
    const arr = [1.000000000190015, 76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 1.208650973866179E-3, -5.395239384953E-6];

    const d1 = Math.sqrt(2 * Math.PI) / gammaValue;
    let d2 = arr[0];

    for (let i = 1; i <= 6; ++i) {
        d2 += arr[i] / (gammaValue + i);
    }

    const d3 = Math.pow((gammaValue + 5.5), (gammaValue + 0.5));
    const d4 = Math.exp(-(gammaValue + 5.5));

    const d = d1 * d2 * d3 * d4;

    return d;
}
`;

const isSubMenuVisible = ref(false);
const subMenuPosition = reactive([0, 0]);
const subMenuIndex = ref(-1);

const ce = new ComputeEngine();
ce.jsonSerializationOptions = {
    shorthands: [],
}

const functionStore = useFunctionStore();

const items = computed(() => {
    return functionStore.functionLists.items;
})

function deleteHandle(index: number, element: any) {
    removeSpecialLists(index);
    functionStore.deleteFunction(index);

    if(element.type === 5) {
        constantChange(null);
    }
}

function addSubHandle(event: any, index: number) {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const top = rect.top;
    const right = rect.right;

    subMenuPosition[0] = top;
    subMenuPosition[1] = right;
    if(index !== subMenuIndex.value) {
        isSubMenuVisible.value = true;
    } else {
        isSubMenuVisible.value = !isSubMenuVisible.value;
    }

    subMenuIndex.value = index;
}

function addElement() {
    functionStore.addFunction();
}

function removeSpecialLists(index: number) {
    if(functionStore.functionLists.items[index].type !== 0) {
        const item = functionStore.functionLists.items[index];
        const id = item.id;

        if(item.type === 1) {
            functionStore.normalFunctionLists.splice(functionStore.normalFunctionLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 2) {
            functionStore.reverseFunctionLists.splice(functionStore.reverseFunctionLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 3) {
            functionStore.normalEqualFunctionLists.splice(functionStore.normalEqualFunctionLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 4) {
            functionStore.reverseEqualFunctionLists.splice(functionStore.reverseEqualFunctionLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 5) {
            functionStore.constantValue.delete(item.unknowns[0]);
        } else if(item.type === 6) {
            functionStore.polarFunctionLists.splice(functionStore.polarFunctionLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 7) {
            functionStore.parameterFunctionLists.splice(functionStore.parameterFunctionLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 8) {
            functionStore.customPointLists.splice(functionStore.customPointLists.findIndex((x: any) => x.id === id), 1);
        } else if(item.type === 9) {
            functionStore.implicitFunctionLists.splice(functionStore.implicitFunctionLists.findIndex((x: any) => x.id === id), 1);
        }
    }
}

function parseNormalExpr(mathJsonValue: any, index: number, unknowns: string[], isValid: boolean, isEqual: boolean) {
    const mathJsonResult = parseMathJson(mathJsonValue, isValid, unknowns);
    const item = functionStore.functionLists.items[index];
    item.beginValue = mathJsonResult.value;
    item.scope = [-Infinity, Infinity];
    item.range = {}
    item.rangeSlider = [0, 100];

    const parameters = Object.fromEntries(functionStore.constantValue)
    let replaceParameter = nerdamer(mathJsonResult.value);
    item.unknowns = replaceParameter.variables();

    functionStore.constantValue.forEach((value: number, key: string) => {
        if(item.unknowns.includes(key)) {
            replaceParameter = replaceParameter.sub(key, `${value}`);
        }
    });

    const variables = replaceParameter.variables();
    const mathExpr = parseMathjs(simplify(replaceParameter.toString())) as Result;
    item.result = mathExpr;
    item.variables = variables;

    if(mathJsonResult.value === "") {
        item.result = parseMathjs(simplify("")) as Result;
        item.type = 0;
        item.value = "";
    } else {
        const includeX = variables.includes("x");
        const includeY = variables.includes("y");
        if(includeX || includeY) {
            if(includeX && includeY) {
                item.type = 9;
                item.variables = ["x", "y"];
                item.func = new Function("x", "y", `${functionValue} return ${mathExpr.value}`) as Function;
                if(variables.length === 2) {
                    item.isValid = true;
                } else {
                    item.isValid = false;
                }
                functionStore.implicitFunctionLists.push(item);
            } else if(includeX) {
                if(isEqual) {
                    item.type = 3;
                    functionStore.normalEqualFunctionLists.push(item);
                } else {
                    item.type = 1;
                    functionStore.normalFunctionLists.push(item);
                }

                item.variables = ["x"];
                if(variables.length !== 1) {
                    item.isValid = false;
                } else {
                    item.isValid = true;
                    item.func = new Function("x", `${functionValue} return ${item.result.value}`) as Function;
                }
            } else {
                if(isEqual) {
                    item.type = 4;
                    functionStore.reverseEqualFunctionLists.push(item);
                } else {
                    item.type = 2;
                    functionStore.reverseFunctionLists.push(item);
                }

                item.variables = ["y"];
                if(variables.length !== 1) {
                    item.isValid = false;
                } else {
                    item.isValid = true;
                    item.func = new Function("y", `${functionValue} return ${item.result.value}`) as Function;
                }
            }
        } else if(variables.includes("theta") || variables.includes("r") || variables.includes("t")) {
            item.result = parseMathjs(simplify("")) as Result;
            item.type = 0;
            item.value = "";
        } else {
            item.func = new Function(`${functionValue} return ${item.result.value}`) as Function;
            item.type = 1;
            functionStore.normalFunctionLists.push(item);
            if(variables.length !== 0) {
                item.isValid = false;
            } else {
                item.isValid = true;
            }
        }
    }
}

function parseEqualExpr(mathJsonValue: any, index: number, unknowns: string[], isValid: boolean) {
    const left = parseMathJson(mathJsonValue.fn[1], isValid, unknowns);
    const right = parseMathJson(mathJsonValue.fn[2], isValid, unknowns);
    const item = functionStore.functionLists.items[index];

    if(left.value === "" || right.value === "") {
        item.result = parseMathjs(simplify("")) as Result;
        item.type = 0;
        item.value = "";
        item.unknowns = [];
    } else {
        const includeX = unknowns.includes("x");
        const includeY = unknowns.includes("y");
        if(includeX || includeY) {
            item.scope = [-Infinity, Infinity];
            if(includeX && includeY) {
                if(left.value === "x" || left.value === "y") {
                    parseNormalExpr(mathJsonValue.fn[2], index, unknowns, isValid, false);
                } else if(right.value === "x" || right.value === "y") {
                    parseNormalExpr(mathJsonValue.fn[1], index, unknowns, isValid, false);
                } else {
                    parseNormalExpr(mathJsonValue, index, unknowns, isValid, true);
                }
            } else {
                parseNormalExpr(mathJsonValue, index, unknowns, isValid, true);
            }
        } else {
            if(unknowns.includes("r") || unknowns.includes("theta")) {
                if(left.value === "r") {
                    const parameters = Object.fromEntries(functionStore.constantValue)
                    const parsedValue = nerdamer(right.value, parameters);
                    const mathjsValue = parseMathjs(simplify(parsedValue.text()));

                    item.unknowns = unknowns;
                    item.result = mathjsValue;
                    item.beginValue = right.value;
                    item.variables = ["theta"];
                    item.scope = [0, 2 * Math.PI];
                    item.rangeSlider = [0, 100];
                    item.type = 6;
                    item.range = {
                        leftValue: 0,
                        rightValue: 2 * Math.PI,
                        leftBegin: "0",
                        rightBegin: `${2 * Math.PI}`,
                        leftUnknows: [],
                        rightUnknows: [],
                    };

                    const variables = parsedValue.variables();
                    if(variables.length === 0 || (variables.length === 1 && variables[0] === "theta")) {
                        item.func = new Function("theta", `${functionValue} return ${item.result.value}`) as Function;
                        item.isValid = true;
                        functionStore.polarFunctionLists.push(functionStore.functionLists.items[index]);
                    } else {
                        item.isValid = false;
                        functionStore.polarFunctionLists.push(functionStore.functionLists.items[index]);
                    }
                }
            } else {
                // commond
                if(unknowns.length === 1) {
                    const num = nerdamer(right.value);
                    if(mathJsonValue.fn[1].sym && num.variables().length === 0) {
                        const numValue = Number(num.evaluate().text());

                        let left = -10;
                        let right = 10;
                        if(isFinite(item.scope[0]) && isFinite(item.scope[1])) {
                            left = Number(item.scope[0]);
                            right = Number(item.scope[1]);
                        }
                        let persent = 50;

                        if(numValue > right) {
                            right = numValue;
                            persent = 100;
                        } else if(numValue < left) {
                            left = numValue;
                            persent = 0;
                        } else {
                            persent = ((numValue - left) / (right - left)) * 100;
                        }

                        item.type = 5;
                        if(!isFinite(item.scope[0]) || !isFinite(item.scope[1]) ||
                            numValue > Number(item.scope[1]) || numValue < Number(item.scope[0]))
                        {
                            item.scope = [left, right];
                        }

                        item.unknowns = unknowns;
                        item.constantValue = numValue;
                        item.sliderPercent = persent;
                        if(item.mathField === null) {
                            item.mathField = document.getElementById(`mainMathInput${item.id}`);
                        }
                        constantChange(item);
                    }
                }
            }
        }
    }
}

function parseDelimeterExpr(mathJsonValue: any, index: number, unknowns: string[], isValid: boolean) {
    if(mathJsonValue.fn.length === 2) {
        if(mathJsonValue.fn[1].fn && mathJsonValue.fn[1].fn[0] === "Sequence") {
            parseExpr(mathJsonValue.fn[1].fn[1], index, unknowns, isValid);
        }
    } else if(mathJsonValue.fn.length === 3) {
        if(mathJsonValue.fn[1].fn && mathJsonValue.fn[1].fn[0] === "Sequence") {
            const item = functionStore.functionLists.items[index];
            const xFuncValue = parseMathJson(mathJsonValue.fn[1].fn[1], isValid, unknowns);
            const yFuncValue = parseMathJson(mathJsonValue.fn[1].fn[2], isValid, unknowns);

            if(unknowns.includes("t")) {
                item.beginValue = {
                    x: xFuncValue.value,
                    y: yFuncValue.value,
                };
                let funcValue = {
                    x: new Function(""),
                    y: new Function(""),
                };
                let result = {
                    x: {},
                    y: {},
                }

                const parameters = Object.fromEntries(functionStore.constantValue)
                const xParsedValue = nerdamer(xFuncValue.value, parameters);
                const yParsedValue = nerdamer(yFuncValue.value, parameters);

                let isValid = true;
                const xVariables = xParsedValue.variables();
                if(xVariables.length === 0 || (xVariables.length === 1 && xVariables[0] === "t")) {
                    const xMathValue = parseMathjs(simplify(xParsedValue.text()));
                    result.x = xMathValue;
                    funcValue.x = new Function("t", `${functionValue} return ${xMathValue.value}`) as Function;
                } else {
                    isValid = false;
                }
                const yVariables = yParsedValue.variables();
                if(yVariables.length === 0 || (yVariables.length === 1 && yVariables[0] === "t")) {
                    const yMathValue = parseMathjs(simplify(yParsedValue.text()));
                    result.y = yMathValue;
                    funcValue.y = new Function("t", `${functionValue} return ${yMathValue.value}`) as Function;
                } else {
                    isValid = false;
                }

                item.isValid = isValid;
                item.func = funcValue;
                item.unknowns = unknowns;
                item.result = result;
                item.variables = ["t"];
                item.scope = [0, 1];
                item.rangeSlider = [0, 100];
                item.type = 7;
                item.range = {
                    leftValue: 0,
                    rightValue: 1,
                    leftBegin: "0",
                    rightBegin: "1",
                    leftUnknows: [],
                    rightUnknows: [],
                };
                functionStore.parameterFunctionLists.push(functionStore.functionLists.items[index]);
            } else if(!unknowns.includes("x") && !unknowns.includes("y") && !unknowns.includes("theta") && !unknowns.includes("r")) {
                item.beginValue = {
                    x: xFuncValue.value,
                    y: yFuncValue.value,
                };
                const result = {
                    x: 0,
                    y: 0,
                }

                const parameters = Object.fromEntries(functionStore.constantValue)
                const xParsedValue = nerdamer(xFuncValue.value, parameters);
                const yParsedValue = nerdamer(yFuncValue.value, parameters);
                let isValid = true;

                if(xParsedValue.variables().length === 0) {
                    result.x = Number(xParsedValue.evaluate().text());
                } else {
                    isValid = false;
                }

                if(yParsedValue.variables().length === 0) {
                    result.y = Number(yParsedValue.evaluate().text());
                } else {
                    isValid = false;
                }

                item.result = result;
                item.type = 8;
                item.isValid = isValid;
                item.unknowns = unknowns;

                functionStore.customPointLists.push(functionStore.functionLists.items[index]);
            }
        }
    }
}

function parseExpr(mathJsonValue: any, index: number, unknowns: string[], isValid: boolean) {
    if(mathJsonValue.fn && mathJsonValue.fn[0] === "Delimiter") {
        parseDelimeterExpr(mathJsonValue, index, unknowns, isValid);
    } else if(mathJsonValue.fn && mathJsonValue.fn[0] === "List") {
    } else if(mathJsonValue.fn && mathJsonValue.fn[0] === "Equal") {
        parseEqualExpr(mathJsonValue, index, unknowns, isValid);
    } else {
        parseNormalExpr(mathJsonValue, index, unknowns, isValid, false);
    }

}

function mathFocus(index: number) {
    functionStore.focus = functionStore.functionLists.items[index].id;
}

function mathBlur() {
    functionStore.focus = -1;
}

function mathInput(event: any, index: number) {
    const mathJsonValue = ce.parse(event.target.value) as any;
    const unknowns = mathJsonValue.unknowns;
    const isValid = mathJsonValue.isValid;
    const item = functionStore.functionLists.items[index];

    removeSpecialLists(index);

    item.points.splice(0, item.points.length);
    item.tangentLine.splice(0, item.tangentLine.length);

    if(isValid) {
        parseExpr(mathJsonValue.json, index, unknowns, isValid);
    } else {
        functionStore.functionLists.items[index].value = "";
        functionStore.functionLists.items[index].unknowns = [];
        functionStore.functionLists.items[index].result = parseMathjs(simplify("")) as Result;
        functionStore.functionLists.items[index].type = 0;
    }
}

function keyDown(event: any) {
    if(event.key === '\\') {
        event.preventDefault();
        event.target.executeCommand(['insert', '\\backslash']);
    } else if(event.key === 'Escape') {
        event.preventDefault();
    }
}

function constantChange(element: any) {
    let unknowns = "";
    if(element) {
        const value = Number(element.scope[0]) + ((Number(element.scope[1]) - Number(element.scope[0])) / 100) * element.sliderPercent;
        const parsedValue = parseFloat(Number(value).toFixed(4));
        element.constantValue = parsedValue;
        element.mathField.setValue(`${nerdamer(element.unknowns[0]).toTeX()}=${parsedValue}`, {silenceNotifications: true});
        functionStore.constantValue.set(element.unknowns[0], parsedValue);
        unknowns = element.unknowns[0];
    }

    functionStore.functionLists.items.forEach((item: any) => {
        const parameters = Object.fromEntries(functionStore.constantValue)
        if((item.unknowns.includes(unknowns) && item.type !== 5 && item.type !== 7) || (element === null)) {
            const replaceParameter = nerdamer(item.beginValue, parameters);
            const variables = replaceParameter.variables();

            if([1, 2, 3, 4, 6, 9].includes(item.type)) {
                if(([1, 2, 3, 4, 6].includes(item.type) && variables.length <= 1) || (item.type === 9 && variables.length === 2)) {
                    const mathExpr = parseMathjs(simplify(replaceParameter.toString())) as Result;
                    item.result = mathExpr;
                    item.func = new Function(...item.variables, `${functionValue} return ${mathExpr.value}`) as Function;
                    item.isValid = true;
                } else {
                    item.isValid = false;
                }
            }

            for(let i = 0; i < item.points.length; ++i) {
                const x = item.points[i].x;
                const y = item.func(x);
                updatePointAndTangent(item, i, true, x, y);
            }
            for(let i = 0; i < item.tangentLine.length; ++i) {
                const x = item.tangentLine[i].x;
                const y = item.func(x);
                updatePointAndTangent(item, i, false, x, y);
            }
        }

        for(let i = 0; i < item.points.length; ++i) {
            if((item.points[i].unknowns.includes(unknowns) && item.type !== 5) || (!element)) {
                const pointX = nerdamer(item.points[i].beginX, parameters);
                if(pointX.variables().length === 0) {
                    const x = Number(pointX.evaluate().text());
                    const y = item.func(x);
                    updatePointAndTangent(item, i, true, x, y);
                } else {
                    updatePointAndTangent(item, i, true, 0, item.func(0));
                }
            }
        }
        for(let i = 0; i < item.tangentLine.length; ++i) {
            if((item.tangentLine[i].unknowns.includes(unknowns) && item.type !== 5) || (!element)) {
                const pointX = nerdamer(item.tangentLine[i].beginX, parameters);
                if(pointX.variables().length === 0) {
                    const x = Number(pointX.evaluate().text());
                    const y = item.func(x);
                    updatePointAndTangent(item, i, false, x, y);
                } else {
                    updatePointAndTangent(item, i, false, 0, item.func(0));
                }
            }
        }

        if(item.range.isActive) {
            if((item.range.leftUnknows.includes(unknowns) && item.type !== 5) || (!element)) {
                const leftValue = nerdamer(item.range.beginLeft, parameters);
                if(leftValue.variables().length === 0) {
                    const numberValue = Number(leftValue.evaluate().text());
                    item.scope[0] = numberValue;
                    item.range.leftValue = numberValue;
                    item.range.left = Number(numberValue.toFixed(4));
                    rangeChange(item);
                } else {
                    item.scope[0] = -Infinity;
                    item.range.leftValue = -Infinity;
                    item.range.left = "-\\infty";
                }
            }
            if((item.range.rightUnknows.includes(unknowns) && item.type !== 5) || (!element)) {
                const rightValue = nerdamer(item.range.beginRight, parameters);
                if(rightValue.variables().length === 0) {
                    const numberValue = Number(rightValue.evaluate().text());
                    item.scope[1] = numberValue;
                    item.range.rightValue = numberValue;
                    item.range.right = Number(numberValue.toFixed(4));
                    rangeChange(item);
                } else {
                    item.scope[1] = Infinity;
                    item.range.rightValue = Infinity;
                    item.range.right = "\\infty";
                }
            }
        }

        if(item.type === 6) {
            const variables = nerdamer(item.beginValue, parameters).variables();
            let isValid = variables.length === 0 || (variables.length === 1 && variables[0] === "theta");
            if(item.range.leftUnknows.includes(unknowns) || (!element)) {
                const leftValue = nerdamer(item.range.leftBegin, parameters);
                if(leftValue.variables().length === 0) {
                    isValid = isValid && true;
                    const numberValue = Number(leftValue.evaluate().text())
                    item.scope[0] = numberValue;
                    item.range.leftValue = numberValue;
                } else {
                    isValid = isValid && false;
                }
            }
            if(item.range.rightUnknows.includes(unknowns) || (!element)) {
                const rightValue = nerdamer(item.range.rightBegin, parameters);
                if(rightValue.variables().length === 0) {
                    isValid = isValid && true;
                    const numberValue = Number(rightValue.evaluate().text())
                    item.scope[1] = numberValue;
                    item.range.rightValue = numberValue;
                } else {
                    isValid = isValid && false;
                }
            }
            item.isValid = isValid;
            specialSliderChange(item);
        }

        if(item.type === 7) {
            let isValid = true;
            if(item.unknowns.includes(unknowns) || !(element)) {
                const xFuncValue = nerdamer(item.beginValue.x, parameters);
                const yFuncValue = nerdamer(item.beginValue.y, parameters);
                const xVariables = xFuncValue.variables();
                const yVariables = yFuncValue.variables();

                if(xVariables.length === 0 || (xVariables.length === 1 && xVariables[0] === "t")) {
                    const xMathValue = parseMathjs(simplify(xFuncValue.text()));
                    item.result.x = xMathValue;
                    item.func.x = new Function(...item.variables, `${functionValue} return ${xMathValue.value}`) as Function;
                } else {
                    isValid = false;
                }

                if(yVariables.length === 0 || (yVariables.length === 1 && yVariables[0] === "t")) {
                    const yMathValue = parseMathjs(simplify(yFuncValue.text()));
                    item.result.y = yMathValue;
                    item.func.y = new Function(...item.variables, `${functionValue} return ${yMathValue.value}`) as Function;
                } else {
                    isValid = false;
                }
            }

            if(item.range.leftUnknows.includes(unknowns) || (!element)) {
                const leftValue = nerdamer(item.range.leftBegin, parameters);
                if(leftValue.variables().length === 0) {
                    const numValue = Number(leftValue.evaluate().text());
                    item.scope[0] = numValue;
                    item.range.leftValue = numValue;
                } else {
                    isValid = false;
                }
            }
            if(item.range.rightUnknows.includes(unknowns) || (!element)) {
                const rightValue = nerdamer(item.range.rightBegin, parameters);
                if(rightValue.variables().length === 0) {
                    const numValue = Number(rightValue.evaluate().text());
                    item.scope[1] = numValue;
                    item.range.rightValue = numValue;
                } else {
                    isValid = false;
                }
            }
            item.isValid = isValid;
            specialSliderChange(item);
        }

        if(item.type === 8) {
            let isValid = true;
            if(item.unknowns.includes(unknowns) || !(element)) {
                const xFuncValue = nerdamer(item.beginValue.x, parameters);
                const yFuncValue = nerdamer(item.beginValue.y, parameters);

                if(xFuncValue.variables().length === 0) {
                    item.result.x = Number(xFuncValue.evaluate().text());
                } else {
                    isValid = false;
                }

                if(yFuncValue.variables().length === 0) {
                    item.result.y = Number(yFuncValue.evaluate().text());
                } else {
                    isValid = false;
                }

                item.isValid = isValid;
            }
        }
    });
}

function constantScopeInput(event: any, element: any, left: boolean, right: boolean) {
    const mathJsonValue = ce.parse(event.target.value) as any;
    if(!mathJsonValue.isValid || mathJsonValue.unknowns.length !== 0) {
        if(left) {
            element.scope[0] = -10;
        } else {
            element.scope[1] = 10;
        }
    } else {
        const mathjsValue = parseMathJson(mathJsonValue.json, mathJsonValue.isValid, mathJsonValue.unknowns);
        const simpledValue = parseMathjs(rationalize(mathjsValue.value));
        if(simpledValue.value !== null && simpledValue.value !== undefined) {
            if(left) {
                element.scope[0] = Number(simpledValue.value);
            } else {
                element.scope[1] = Number(simpledValue.value);
            }
            constantChange(element);
        }
    }
}

function updatePointAndTangent(element: any, index: number, point: boolean, x: number, y: number) {
    if(point) {
        element.points[index].x = parseFloat(x.toFixed(5));
        if(isFinite(y)) {
            element.points[index].y = parseFloat(y.toFixed(5));
        } else {
            if(isNaN(y)) {
                element.points[index].y = "\\infty";
            } else {
                if(y > 0) {
                    element.points[index].y = "\\infty";
                } else {
                    element.points[index].y = "-\\infty";
                }
            }
        }
    } else {
        const xRight = x + 0.0001;
        const xLeft = x - 0.0001;
        const yRight = element.func(xRight);
        const yLeft = element.func(xLeft);

        let slope = 0;
        let yValue = 0;

        if(isFinite(yRight) && isFinite(yLeft)) {
            const yDistance = yRight - yLeft;
            const xDistance = 0.0002;
            slope = yDistance / xDistance;
            yValue = (xRight * yLeft - xLeft * yRight) / xDistance;
        } else if(isFinite(yRight)) {
            const yDistance = yRight - y;
            const xDistance = 0.0001;
            slope = yDistance / xDistance;
            yValue = (xRight * y - x * yRight) / xDistance;
        } else if(isFinite(yLeft)) {
            const yDistance = y - yLeft;
            const xDistance = 0.0001;
            slope = yDistance / xDistance;
            yValue = (x * yLeft - xLeft * y) / xDistance;
        };

        slope = parseFloat(slope.toFixed(5));
        yValue = parseFloat(yValue.toFixed(5));
        let empty = false;

        if(slope === 0) {
            element.tangentLine[index].slope = "";
            empty = true;
        } else if(slope === 1) {
            element.tangentLine[index].slope = "x";
            if(element.type % 2 === 0) {
                element.tangentLine[index].slope = "y";
            }
        } else if(slope === -1) {
            element.tangentLine[index].slope = "-x";
            if(element.type % 2 === 0) {
                element.tangentLine[index].slope = "-y";
            }
        } else {
            element.tangentLine[index].slope = `${slope}x`;
            if(element.type % 2 === 0) {
                element.tangentLine[index].slope = `${slope}y`;
            }
        }

        if(yValue > 0 && !empty) {
            element.tangentLine[index].yValue = `+${yValue}`;
        } else if(yValue === 0) {
            if(slope === 0) {
                element.tangentLine[index].yValue = "0";
            } else {
                element.tangentLine[index].yValue = "";
            }
        } else {
            element.tangentLine[index].yValue = yValue;
        }

        element.tangentLine[index].x = x;
        element.tangentLine[index].y = y;
        element.tangentLine[index].k = slope;
        element.tangentLine[index].b = yValue;
    }
}

function subPointInput(event: any, element: any, pointIndex: number, point: boolean) {
    const mathJsonValue = ce.parse(event.target.value) as any;
    const mathjsValue = parseMathJson(mathJsonValue.json, mathJsonValue.isValid, mathJsonValue.unknowns);

    if(point) {
        element.points[pointIndex].beginX = mathjsValue.value;
        element.points[pointIndex].unknowns = mathJsonValue.unknowns;
    } else {
        element.tangentLine[pointIndex].beginX = mathjsValue.value;
        element.tangentLine[pointIndex].unknowns = mathJsonValue.unknowns;
    }

    const constantValue = Object.fromEntries(functionStore.constantValue);
    const parsedValue = nerdamer(mathjsValue.value, constantValue);

    if(parsedValue.variables().length === 0) {
        const x = Number(parsedValue.evaluate().text());
        updatePointAndTangent(element, pointIndex, point, x, element.func(x));
    } else {
        updatePointAndTangent(element, pointIndex, point, 0, element.func(0));
    }
}

function subPointDelete(element: any, pointIndex: number, point: boolean) {
    if(point) {
        element.points.splice(pointIndex, 1);
    } else {
        element.tangentLine.splice(pointIndex, 1);
    }
}

function rangeChange(element: any) {
    const ratio = (element.range.rightValue - element.range.leftValue) / 100;
    const left = element.range.leftValue + ratio * element.rangeSlider[0];
    const right = element.range.leftValue + ratio * element.rangeSlider[1];

    element.scope = [left, right];
}

function rangeInput(event: any, element: any, left: boolean, right: boolean) {
    const mathJsonValue = ce.parse(event.target.value) as any;
    const mathjsValue = parseMathJson(mathJsonValue.json, mathJsonValue.isValid, mathJsonValue.unknowns);

    if(left) {
        element.range.beginLeft = mathjsValue.value;
        element.range.leftUnknows = mathJsonValue.unknowns;
    } else {
        element.range.beginRight = mathjsValue.value;
        element.range.rightUnknows = mathJsonValue.unknowns;
    }

    const constantValue = Object.fromEntries(functionStore.constantValue);
    const parsedValue = nerdamer(mathjsValue.value, constantValue);

    if(parsedValue.variables().length === 0) {
        const numberValue = Number(parsedValue.evaluate().text());
        if(left) {
            element.scope[0] = numberValue;
            element.range.leftValue = numberValue;
            element.range.left = Number(numberValue.toFixed(4));
        } else {
            element.scope[1] = numberValue;
            element.range.rightValue = numberValue;
            element.range.right = Number(numberValue.toFixed(4));
        }
    } else {
        if(left) {
            element.scope[0] = -Infinity;
            element.range.leftValue = -Infinity;
            element.range.left = "-\\infty"
        } else {
            element.scope[1] = Infinity;
            element.range.rightValue = Infinity;
            element.range.right = "\\infty"
        }
    }

}

function deleteRange(element: any) {
    element.scope = [-Infinity, Infinity];
    element.range = {}
}

function specialFuncInput(event: any, element: any, left: boolean, right: boolean) {
    const mathJsonValue = ce.parse(event.target.value) as any;
    const mathjsValue = parseMathJson(mathJsonValue.json, mathJsonValue.isValid, mathJsonValue.unknowns);
    const constantValue = Object.fromEntries(functionStore.constantValue);

    element.rangeSlider = [0, 100];

    if(left) {
        element.range.leftBegin = mathjsValue.value;
        element.range.leftUnknows = mathJsonValue.unknowns;
    } else {
        element.range.rightBegin = mathjsValue.value;
        element.range.rightUnknows = mathJsonValue.unknowns;
    }

    const parsedValue = nerdamer(mathjsValue.value, constantValue);
    if(parsedValue.variables().length === 0) {
        const numberValue = Number(parsedValue.evaluate().text());
        if(left) {
            element.scope[0] = numberValue;
            element.range.leftValue = numberValue;
        } else {
            element.scope[1] = numberValue;
            element.range.rightValue = numberValue;
        }
    }

    let isValid = false;
    if(element.type === 6) {
        const funcValue = nerdamer(element.beginValue, constantValue);
        const funcValid = funcValue.variables.length === 0 || (funcValue.variables.length === 1 && funcValue.variables[0] === "theta");
        isValid = funcValid;
    } else if(element.type === 7) {
        const xFuncValue = nerdamer(element.beginValue.x, constantValue);
        const xFuncValid = xFuncValue.variables.length === 0 || (xFuncValue.variables.length === 1 && xFuncValue.variables[0] === "t");

        const yFuncValue = nerdamer(element.beginValue.y, constantValue);
        const yFuncValid = yFuncValue.variables.length === 0 || (yFuncValue.variables.length === 1 && yFuncValue.variables[0] === "t");
        isValid = xFuncValid && yFuncValid;
    }

    if(left) {
        const rightValue = nerdamer(element.range.rightBegin, constantValue);
        element.isValid = parsedValue.variables().length === 0 && rightValue.variables().length === 0 && isValid;
    } else {
        const leftValue = nerdamer(element.range.leftBegin, constantValue)
        element.isValid = parsedValue.variables().length === 0 && leftValue.variables().length === 0 && isValid;
    }
}

function specialSliderChange(element: any) {
    const ratio = (element.range.rightValue - element.range.leftValue) / 100;
    const left = element.range.leftValue + ratio * element.rangeSlider[0];
    const right = element.range.leftValue + ratio * element.rangeSlider[1];

    element.scope = [left, right];
}
</script>

<style lang="scss" scoped>
.h-half {
    height: 50%;
}

.math-container:hover {
    cursor: move;
}

.math-live-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
}

.selected {
    background-color: var(--green-100);
}

.add-element {
    &:hover {
        cursor: pointer;
    }

    .add-left-bar {
        background: linear-gradient(to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0));
    }
}

math-field {
    border: none;
    border-radius: 0;
    height: auto;

    &:hover {
        cursor: text;
    }
}

math-field::part(virtual-keyboard-toggle) {
    display: none;
}

math-field::part(menu-toggle) {
    display: none;
}

math-field::part(content) {
    font-size: 24px;
    height: auto;
    min-height: 4rem;
    padding: 0px;
}

math-field:focus-within {
    outline: 0;
    border: 0;
}

.scope {
    math-field::part(content) {
        margin: 0 auto;
        font-size: 16px;
        height: auto;
        min-height: 1rem;
        min-width: 1rem;
        padding: 0px;
    }

    math-field {
        border-bottom: 1px solid #afafaf;
        border-radius: 0;
        height: auto;

        &:hover {
            cursor: text;
        }
    }

    .p-button {
        margin: 0px;
        padding: 0px;
    }
}

.p-button {
    margin: 0px;
    padding: 0px;

    svg {
        pointer-events: none;
        path {
            pointer-events: none;
        }
    }
}

.hidden-scroll::-webkit-scrollbar {
    width: 0.5em;
}

.disable-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
