import nerdamer from "nerdamer"
import "nerdamer/Algebra"
import "nerdamer/Calculus"
import "nerdamer/Solve"
import "nerdamer/Extra"

let unknowns: string[] = [];

type Result = {
    error: boolean;
    value: string;
    isArray: boolean;
    array: Result[];
};

function createResultArray(array: Result[]): Result {
    return {
        isArray: true,
        error: false,
        value: "",
        array
    } as Result;
}

function createResult(value: string): Result {
    return {
        isArray: false,
        error: false,
        value,
        array: [],
    } as Result;
}

function errorResult(): Result {
    return {
        isArray: false,
        error: true,
        value: "",
        array: [],
    } as Result;
}

function unaryExpression(args: any[]): Result {
    if(args.length != 2) {
        return errorResult();
    }

    const element = judgeMathJson(args[1]);

    return element;
}

function binaryExpression(args: any[]): Result {
    if(args.length != 3) {
        return errorResult();
    }

    const left = judgeMathJson(args[1]);
    const right = judgeMathJson(args[2]);

    if(left.error || right.error) {
        return errorResult();
    }

    return createResultArray([left, right]);
}

function multivariateExpression(args: any[]): Result {
    if(args.length < 3) {
        return errorResult();
    }

    const array: Result[] = [];

    for(let i = 1; i != args.length; ++i) {
        const element = judgeMathJson(args[i]);
        if(element.error) {
            return errorResult();
        }

        array.push(element);
    }

    return createResultArray(array);
}

const FunctionType = {
    Equal: (args: any[]): Result => {
        if(args.length != 3) {
            return errorResult();
        }

        const left = judgeMathJson(args[1]);
        const right = judgeMathJson(args[2]);

        if(left.error || right.error) {
            return errorResult();
        }

        return createResult(`${left.value} - ${right.value}`);
    },
    Add: (args: any[]): Result => {
        const elements = multivariateExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        let resultString = "";
        for(let i = 0; i != elements.array.length; ++i) {
            if(i !== 0) {
                resultString += "+";
            }
            resultString += elements.array[i].value;
        }

        return createResult(`(${resultString})`);
    },
    Subtract: (args: any[]): Result => {
        const elements = binaryExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        return createResult(`(${elements.array[0].value}-${elements.array[1].value})`);
    },
    Negate: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(-${element.value})`);
    },
    InvisibleOperator: (args: any[]): Result => {
        return FunctionType["Multiply"](args);
    },
    Multiply: (args: any[]): Result => {
        if(args.length === 3) {
            if(args[1].fn && args[1].fn[0] === "Divide") {
                let isDiff = true;
                if(args[1].fn[1].sym === "d") {
                    isDiff = true;
                } else {
                    isDiff = false;
                }

                if(args[1].fn[2].fn && args[1].fn[2].fn[0] === "InvisibleOperator" && args[1].fn[2].fn.length === 3 &&
                   args[1].fn[2].fn[1].sym === "d" && args[1].fn[2].fn[2].sym) {
                    isDiff = isDiff && true;
                } else {
                    isDiff = isDiff && false;
                }

                if(isDiff) {
                    const exprValue = judgeMathJson(args[2]);
                    const dValue = judgeMathJson(args[1].fn[2].fn[2]);
                    if(exprValue.error || dValue.error) {
                        return errorResult();
                    }

                    try {
                        const diffValue = nerdamer.diff(exprValue.value, dValue.value).toString();
                        if(diffValue.includes("diff(")) {
                            return errorResult();
                        } else {
                            return createResult(`(${diffValue})`);
                        }
                    } catch(error) {
                        return errorResult();
                    }
                }
            }
        }

        const elements = multivariateExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        let resultString = "";
        for(let i = 0; i != elements.array.length; ++i) {
            if(i !== 0) {
                resultString += "*";
            }
            resultString += elements.array[i].value;
        }

        return createResult(`(${resultString})`);
    },
    Divide: (args: any[]): Result => {
        if(args.length === 3 && args[1].fn && args[1].fn[0] === "InvisibleOperator" && args[1].fn.length === 3 &&
           args[2].fn && args[2].fn[0] === "InvisibleOperator" && args[2].fn.length === 3) {
            let isDiff = true;
            if(args[1].fn[1].sym === "d") {
                isDiff = true;
            } else {
                isDiff = false;
            }

            if(args[2].fn[1].sym === "d" && args[2].fn[2].sym) {
                isDiff = isDiff && true;
            } else {
                isDiff = isDiff && false;
            }

            if(isDiff) {
                const exprValue = judgeMathJson(args[1].fn[2]);
                const dValue = judgeMathJson(args[2].fn[2]);

                if(exprValue.error || dValue.error) {
                    return errorResult();
                }

                try {
                    const diffValue = nerdamer.diff(exprValue.value, dValue.value).toString();
                    if(diffValue.includes("diff(")) {
                        return errorResult();
                    } else {
                        return createResult(`(${diffValue})`);
                    }
                } catch(error) {
                    return errorResult();
                }
            }
        }


        const elements = binaryExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }
        return createResult(`(${elements.array[0].value}/${elements.array[1].value})`);
    },
    Rational: (args: any[]): Result => {
        const elements = binaryExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        return createResult(`(${elements.array[0].value}/${elements.array[1].value})`);
    },
    Power: (args: any[]): Result => {
        const elements = binaryExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        return createResult(`(${elements.array[0].value}^${elements.array[1].value})`);
    },
    Root: (args: any[]): Result => {
        const elements = binaryExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        return createResult(`(${elements.array[0].value}^(1/${elements.array[1].value}))`);
    },
    Sqrt: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(${element.value}^(0.5))`);
    },
    Square: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(${element.value}^2)`);
    },
    Exp: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(${Math.E}^${element.value})`);
    },
    Ln: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(log(${element.value}))`);
    },
    Log: (args: any[]): Result => {
        if(args.length === 2) {
            const element = unaryExpression(args);
            if(element.error) {
                return errorResult();
            }

            return createResult(`(log10(${element.value}))`);
        } else if(args.length === 3) {
            const elements = binaryExpression(args);
            if(elements.error || !elements.isArray) {
                return errorResult();
            }

            return createResult(`(log(${elements.array[1].value},${elements.array[0].value}))`);
        } else {
            return errorResult();
        }
    },
    Lb: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(log2(${element.value}))`);
    },
    Lg: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(log10(${element.value}))`);
    },
    Abs: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(abs(${element.value}))`);
    },
    Factorial: (args: any[]): Result => {
        if(args[1].sym || args[1].num) {
            const element = unaryExpression(args);
            if(element.error) {
                return errorResult();
            }
            return createResult(`(${element.value}!)`);
        } else if(args[1]?.fn[1]?.fn[1]) {
            const element = judgeMathJson(args[1].fn[1].fn[1]);
            if(element.error) {
                return errorResult();
            }
            return createResult(`(${element.value}!)`);
        }

        return errorResult();
    },
    Sin: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(sin(${element.value}))`);
    },
    Cos: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(cos(${element.value}))`);
    },
    Tan: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(tan(${element.value}))`);
    },
    Cot: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(cot(${element.value}))`);
    },
    Sec: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(sec(${element.value}))`);
    },
    Csc: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(csc(${element.value}))`);
    },
    Arcsin: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(asin(${element.value}))`);
    },
    Arccos: (args: any[]): Result=> {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(acos(${element.value}))`);
    },
    Arctan: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(atan(${element.value}))`);
    },
    Acot: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(acot(${element.value}))`);
    },
    Asec: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(asec(${element.value}))`);
    },
    Acsc: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(acsc(${element.value}))`);
    },
    Sinh: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(sinh(${element.value}))`);
    },
    Cosh: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(cosh(${element.value}))`);
    },
    Tanh: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(tanh(${element.value}))`);
    },
    Coth: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(coth(${element.value}))`);
    },
    Sech: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(sech(${element.value}))`);
    },
    Csch: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(csch(${element.value}))`);
    },
    Arsinh: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(asinh(${element.value}))`);
    },
    Arcosh: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(acosh(${element.value}))`);
    },
    Artanh: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(atanh(${element.value}))`);
    },
    Arcoth: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(acoth(${element.value}))`);
    },
    Asech: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(asech(${element.value}))`);
    },
    Acsch: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`(acsch(${element.value}))`);
    },
    Min: (args: any[]): Result => {
        const elements = multivariateExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        let resultString = "min(";
        for(let i = 0; i != elements.array.length; ++i) {
            if(i !== 0) {
                resultString += ",";
            }
            resultString += elements.array[i].value;
        }
        resultString += ")";

        return createResult(`${resultString}`);
    },
    Max: (args: any[]): Result => {
        const elements = multivariateExpression(args);
        if(elements.error || !elements.isArray) {
            return errorResult();
        }

        let resultString = "maxmathJsonValue(";
        for(let i = 0; i != elements.array.length; ++i) {
            if(i !== 0) {
                resultString += ",";
            }
            resultString += elements.array[i].value;
        }
        resultString += ")";

        return createResult(`${resultString}`);
    },
    Integrate: (args: any[]): Result => {
        if(args.length !== 3) {
            return errorResult();
        }
        const element = judgeMathJson(args[1]);
        if(element.error) {
            return errorResult();
        }

        let intValue = "";
        if(args[2].fn) {
            if(args[2].fn[0] === "Triple" && args[2].fn.length === 4) {
                const index = judgeMathJson(args[2].fn[1]);
                const lower = judgeMathJson(args[2].fn[2]);
                const upper = judgeMathJson(args[2].fn[3]);

                if(index.error || lower.error || upper.error) {
                    return errorResult();
                }

                intValue = `(integrate(${element.value}, ${index.value}, ${lower.value}, ${upper.value}))`;
            }
        }

        if(args[2].sym) {
            const index = judgeMathJson(args[2]);
            if(index.error) {
                return errorResult();
            }

            intValue = `(integrate(${element.value}, ${index.value}, 0, x))`;
        }

        return createResult(intValue);
    },
    Delimiter: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`${element.value}`);
    },
    Sequence: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`${element.value}`);
    },
    Hold: (args: any[]): Result => {
        const element = unaryExpression(args);
        if(element.error) {
            return errorResult();
        }

        return createResult(`${element.value}`);
    },
    Prime: (args: any[]): Result => {
        let times = 1;
        if(args.length === 3) {
            if(args[2].num !== null || args[2].num !== undefined) {
                times = args[2].num;
            }
        }

        const element = judgeMathJson(args[1]);

        const variables = nerdamer(element.value).variables();
        let diffValue = element.value;

        while(times) {
            try {
                if(variables.length === 0) {
                    diffValue = nerdamer.diff(diffValue, "x").toString();
                } else if(variables.length === 1) {
                    diffValue = nerdamer.diff(diffValue, variables[0]).toString();
                } else if(variables.length >= 2) {
                    if(variables.includes("x")) {
                        diffValue = nerdamer.diff(diffValue, "x").toString();
                    } else {
                        return errorResult();
                    }
                }
            } catch (error) {
                return errorResult();
            }
            times--;
        }

        if(diffValue.includes("diff(")) {
            return errorResult();
        } else {
            return createResult(`(${diffValue})`);
        }
    },
    Sum: (args: any[]): Result => {
        if(args.length !== 3) {
            return errorResult();
        }
        const element = judgeMathJson(args[1]);
        if(element.error) {
            return errorResult();
        }

        if(args[2].fn[0] === "Triple" && args[2].fn.length === 4) {
            const index = judgeMathJson(args[2].fn[1]);
            const lower = judgeMathJson(args[2].fn[2]);
            const upper = judgeMathJson(args[2].fn[3]);

            if(index.error || lower.error || upper.error) {
                return errorResult();
            }

            const tempValue = nerdamer(`sum(${element.value}, ${index.value}, ${lower.value}, ${upper.value})`);
            return createResult(`(${tempValue})`);
        }
        return errorResult();
    },
    Product: (args: any[]): Result => {
        if(args.length !== 3) {
            return errorResult();
        }
        const element = judgeMathJson(args[1]);
        if(element.error) {
            return errorResult();
        }

        if(args[2].fn[0] === "Triple" && args[2].fn.length === 4) {
            const index = judgeMathJson(args[2].fn[1]);
            const lower = judgeMathJson(args[2].fn[2]);
            const upper = judgeMathJson(args[2].fn[3]);

            if(index.error || lower.error || upper.error) {
                return errorResult();
            }

            const tempValue = nerdamer(`product(${element.value}, ${index.value}, ${lower.value}, ${upper.value})`);
            return createResult(`(${tempValue})`);
        }
        return errorResult();
    },
}

const SymbolType = {
    e: (): Result => {
        return createResult(`${Math.E}`);
    },
    ExponentialE: (): Result => {
        return createResult(`${Math.E}`);
    },
    Degrees: (): Result => {
        return createResult("0.017453292519943");
    },
    Pi: (): Result => {
        return createResult(`${Math.PI}`);
    },
    Half: (): Result => {
        return createResult("0.5");
    },
    Nothing: (): Result => {
        return errorResult();
    },
}

function judgeMathJson(jsonValue: any): Result {
    if(jsonValue.fn) {
        try {
            return FunctionType[jsonValue.fn[0] as keyof typeof FunctionType](jsonValue.fn);
        } catch (error) {
            return errorResult();
        }
    } else if(jsonValue.sym) {
        try {
            return SymbolType[jsonValue.sym as keyof typeof SymbolType]();
        } catch (error) {
            if(unknowns.includes(jsonValue.sym)) {
                return createResult(jsonValue.sym);
            }
            return errorResult();
        }
    } else if(jsonValue.num) {
        return createResult(jsonValue.num);
    }

    return errorResult();
}

function parseMathJson(mathJson: any, isValid: boolean, unknown: string[]): Result {
    if(isValid) {
        unknowns = unknown;
        return judgeMathJson(mathJson);
    }

    return errorResult();
}

export { parseMathJson };
export type { Result };
