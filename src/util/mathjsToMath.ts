import { simplify, rationalize } from "mathjs"

type Result = {
    isMathJs: boolean,
    value: string,
    linear: number,
    oddFunction: boolean,
    evenFunction: boolean,
    periodicFunction: number,
    periodLike: boolean,
    number: boolean
}

function createResult(isMathJs: boolean, value: string, linear: number, number: boolean): Result;
function createResult(isMathJs: boolean, value: string, linear: number, number: boolean, period: number, periodLike: boolean): Result;

function createResult(isMathJs: boolean, value: string, linear: number, number: boolean, period?: number, periodLike?: boolean): Result {
    return {
        isMathJs,
        value,
        linear,
        oddFunction: false,
        evenFunction: false,
        periodicFunction: period === undefined ? 0 : period,
        periodLike: periodLike === undefined ? false : periodLike,
        number
    } as Result;
}

function createOddFunctionResult(isMathJs: boolean, value: string, linear: number, number: boolean, period: number, periodLike: boolean): Result {
    return {
        isMathJs,
        value,
        linear,
        oddFunction: true,
        evenFunction: false,
        periodicFunction: period,
        periodLike,
        number
    } as Result;
}

function createEvenFunctionResult(isMathJs: boolean, value: string, linear: number, number: boolean, period: number, periodLike: boolean): Result {
    return {
        isMathJs,
        value,
        linear,
        oddFunction: false,
        evenFunction: true,
        periodicFunction: period,
        periodLike,
        number
    } as Result;
}

function gcd(a: number, b: number): number {
    if (Math.abs(b) < 0.000001) {
        return a;
    }
    return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    if (Math.abs(a) < 0.000001 && Math.abs(b)  < 0.000001) {
        return 0;
    }

    const greatestCommonDivisor = gcd(a, b);
    const leastCommonMultiple = (a * b) / greatestCommonDivisor;
    return leastCommonMultiple;
}

function makeFunctionResult(exprArgs: string, oddEven: number, value: any): Result {
    if(value.value === "") {
        return createResult(false, "", 0, false);
    }

    let period = value.periodicFunction;
    if(value.periodLike) {
        period = 0;
    }
    const linear = value.number ? 2 : 0;
    const number = value.number;

    if(oddEven === 0) {
        if(value.evenFunction) {
            return createEvenFunctionResult(value.isMathJs, exprArgs, linear, number, period, false);
        }
    } else if(oddEven === 1) {
        if(value.oddFunction) {
            return createOddFunctionResult(value.isMathJs, exprArgs, linear, number, period, false);
        } else if(value.evenFunction) {
            return createEvenFunctionResult(value.isMathJs, exprArgs, linear, number, period, false);
        }
    } else if(oddEven === 2) {
        if(value.oddFunction || value.evenFunction) {
            return createEvenFunctionResult(value.isMathJs, exprArgs, linear, number, period, false);
        }
    }
    return createResult(value.isMathJs, exprArgs, linear, number, period, false);
}

function makePeriodFunctionResult(exprArgs: string, periodArgs: number, args: any, oddEven: number, value: any): Result {
    if(value.value === "") {
        return createResult(false, "", 0, false);
    }

    const expr = exprArgs;

    if(value.linear === 1) {
        const linearFunc = rationalize(args.toString()) as any;

        let period = periodArgs;
        let mulFunc = linearFunc;
        let flag = true;

        if(linearFunc.fn === "add") {
            flag = false;
            if(linearFunc.args[0].value) {
                mulFunc = linearFunc.args[1];
            } else {
                mulFunc = linearFunc.args[0];
            }
        }

        if(mulFunc.fn === "multiply") {
            if(mulFunc.args[0].value) {
                period /= Math.abs(mulFunc.args[0].value);
            } else if(mulFunc.args[1].value) {
                period /= Math.abs(mulFunc.args[1].value);
            }
        }


        if(oddEven === 1 && flag) {
            return createOddFunctionResult(value.isMathJs, expr, 0, false, period, false);
        } else if(oddEven === 2 && flag) {
            return createEvenFunctionResult(value.isMathJs, expr, 0, false, period, false);
        } else {
            return createResult(value.isMathJs, expr, 0, false, period, false);
        }
    } else if(value.linear === 2) {
        return createEvenFunctionResult(value.isMathJs, expr, 2, true, 0, false);
    } else {
        let period = periodArgs;
        if(args[0].fn && args[0].fn === "multiply") {
            const mulArgs = args[0].args;
            const left = judgeObject(mulArgs[0]);
            const right = judgeObject(mulArgs[1]);

            if(left.number && !right.number) {
                const func = new Function(`return ${left.value}`);
                period /= Math.abs(func());
            } else if(!left.number && right.number) {
                const func = new Function(`return ${right.value}`);
                period /= Math.abs(func());
            }
        }

        const lcmPeriod = lcm(period, value.periodicFunction);

        if(oddEven === 0) {
            if(value.evenFunction) {
                return createEvenFunctionResult(value.isMathJs, expr, 0, false, lcmPeriod, false);
            }
        } else if(oddEven === 1) {
            if(value.oddFunction) {
                return createOddFunctionResult(value.isMathJs, expr, 0, false, lcmPeriod, false);
            } else if(value.evenFunction) {
                return createEvenFunctionResult(value.isMathJs, expr, 0, false, lcmPeriod, false);
            }
        } else if(oddEven === 2) {
            if(value.oddFunction || value.evenFunction) {
                return createEvenFunctionResult(value.isMathJs, expr, 0, false, lcmPeriod, false);
            }
        }
        return createResult(value.isMathJs, expr, 0, false, period, false);
    }
}

const FunctionType = {
    add: (args: any[]): Result => {
        const left = judgeObject(args[0]);
        const right = judgeObject(args[1]);

        if(left.value === "" || right.value === "") {
            return createResult(false, "", 0, false);
        }

        let linear = 0;
        if(left.linear === 0 || right.linear === 0) {
            linear = 0;
        } else if(left.linear === 2 && right.linear === 2) {
            linear = 2;
        } else {
            linear = 1;
        }

        const isMathjs = left.isMathJs || right.isMathJs;
        const expr = `(${left.value}+${right.value})`;

        let period = 0;
        let periodLike = false;
        if(left.periodicFunction !== 0 && right.periodicFunction !== 0) {
            period = lcm(left.periodicFunction, right.periodicFunction);
            periodLike = left.periodLike || right.periodLike;
        } else if(left.periodicFunction === 0 && right.periodicFunction === 0) {
            period = 0;
        }

        if(left.linear && right.periodicFunction !== 0) {
            period = right.periodicFunction;
            if(left.linear === 1) {
                periodLike = true;
            }
        } else if(right.linear && left.periodicFunction !== 0) {
            period = left.periodicFunction;
            if(right.linear === 1) {
                periodLike = true;
            }
        }

        const number = left.number && right.number;

        if(left.evenFunction && right.evenFunction) {
            return createEvenFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }
        if(left.oddFunction && right.oddFunction) {
            return createOddFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }

        return createResult(isMathjs, expr, linear, number, period, periodLike);
    },
    subtract: (args: any[]): Result => {
        const left = judgeObject(args[0]);
        const right = judgeObject(args[1]);

        if(left.value === "" || right.value === "") {
            return createResult(false, "", 0, false);
        }

        let linear = 0;
        if(left.linear === 0 || right.linear === 0) {
            linear = 0;
        } else if(left.linear === 2 && right.linear === 2) {
            linear = 2;
        } else {
            linear = 1;
        }

        const isMathjs = left.isMathJs || right.isMathJs;
        const expr = `(${left.value}-${right.value})`;

        let period = -1;
        let periodLike = false;
        if(left.periodicFunction !== 0 && right.periodicFunction !== 0) {
            period = lcm(left.periodicFunction, right.periodicFunction);
            periodLike = left.periodLike || right.periodLike;
        } else if(left.periodicFunction === 0 && right.periodicFunction === 0) {
            period = 0;
        }

        if(left.linear && right.periodicFunction !== 0) {
            period = right.periodicFunction;
            if(left.linear === 1) {
                periodLike = true;
            }
        } else if(right.linear && left.periodicFunction !== 0) {
            period = left.periodicFunction;
            if(right.linear === 1) {
                periodLike = true;
            }
        }

        const number = left.number && right.number;

        if(left.evenFunction && right.evenFunction) {
            return createEvenFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }
        if(left.oddFunction && right.oddFunction) {
            return createOddFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }

        return createResult(isMathjs, expr, linear, number, period, periodLike);

    },
    multiply: (args: any[]): Result => {
        const left = judgeObject(args[0]);
        const right = judgeObject(args[1]);

        if(left.value === "" || right.value === "") {
            return createResult(false, "", 0, false);
        }

        let linear = 0;
        if(left.linear === 0 || right.linear === 0) {
            linear = 0;
        } else if(left.linear === 2 && right.linear === 2) {
            linear = 2;
        } else if(left.linear === 1 && right.linear === 1) {
            linear = 0;
        } else {
            linear = 1;
        }

        const isMathjs = left.isMathJs || right.isMathJs;
        const expr = `(${left.value}*${right.value})`;

        let period = 0;
        let periodLike = false;
        if(left.linear === 2 && right.periodicFunction !== 0) {
            period = right.periodicFunction;
            periodLike = right.periodLike;
        } else if(right.linear === 2 && left.periodicFunction !== 0) {
            period = left.periodicFunction;
            periodLike = left.periodLike;
        } else if((left.periodicFunction !== 0 && !left.periodLike) && (right.periodicFunction !== 0 && !right.periodLike)) {
            period = lcm(left.periodicFunction, right.periodicFunction);
            periodLike = false;
        }

        const number = left.number && right.number;

        if((left.evenFunction && right.evenFunction) || (left.oddFunction && right.oddFunction)) {
            return createEvenFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }
        if((left.evenFunction && right.oddFunction) || (left.oddFunction && right.evenFunction)) {
            return createOddFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }

        return createResult(isMathjs, expr, linear, number, period, periodLike);
    },
    divide: (args: any[]): Result => {
        const left = judgeObject(args[0]);
        const right = judgeObject(args[1]);

        if(left.value === "" || right.value === "") {
            return createResult(false, "", 0, false);
        }

        let linear = 0;
        if(left.linear === 0 || right.linear === 0) {
            linear = 0;
        } else if(right.linear === 2) {
            linear = left.linear;
        } else {
            linear = 0;
        }

        const isMathjs = left.isMathJs || right.isMathJs;
        const expr = `(${left.value}/${right.value})`;

        let period = 0;
        let periodLike = false;
        if(left.linear === 2 && right.periodicFunction !== 0) {
            period = right.periodicFunction;
            periodLike = right.periodLike;
        } else if(right.linear === 2 && left.periodicFunction !== 0) {
            period = left.periodicFunction;
            periodLike = left.periodLike;
        } else if((left.periodicFunction !== 0 && !left.periodLike) && (right.periodicFunction !== 0 && !right.periodLike)) {
            period = lcm(left.periodicFunction, right.periodicFunction);
            periodLike = false;
        }

        const number = left.number && right.number;

        if((left.evenFunction && right.evenFunction) || (left.oddFunction && right.oddFunction)) {
            return createEvenFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }
        if((left.evenFunction && right.oddFunction) || (left.oddFunction && right.evenFunction)) {
            return createOddFunctionResult(isMathjs, expr, linear, number, period, periodLike);
        }

        return createResult(isMathjs, expr, linear, number, period, periodLike);
    },
    factorial: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `factorial(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    unaryMinus: (args: any[]): Result => {
        const value = judgeObject(args[0]);

        if(value.value === "") {
            return createResult(false, "", 0, false);
        }

        const expr = `-${value.value}`;
        if(value.evenFunction) {
            return createEvenFunctionResult(value.isMathJs, expr, value.linear, value.number, value.periodicFunction, value.periodLike);
        }
        if(value.oddFunction) {
            return createOddFunctionResult(value.isMathJs, expr, value.linear, value.number, value.periodicFunction, value.periodLike);
        }

        return createResult(value.isMathJs, expr, value.linear, value.number, value.periodicFunction, value.periodLike);
    },
    pow: (args: any[]): Result => {
        const left = judgeObject(args[0]);
        const right = judgeObject(args[1]);

        if(left.value === "" || right.value === "") {
            return createResult(false, "", 0, false);
        }

        const expr = `Math.pow(${left.value}, ${right.value})`;

        if(left.number && right.number) {
            return createEvenFunctionResult(false, expr, 2, true, 0, false);
        } else if(left.number && !right.number) {
            if(right.evenFunction) {
                return createEvenFunctionResult(right.isMathJs, expr, 0, false, right.periodicFunction, false);
            }
            return createResult(right.isMathJs, expr, 0, false, right.periodicFunction, false);
        } else if(!left.number && right.number) {
            const func = new Function(`return ${right.value}`);
            const value = simplify(`${func()}`) as any;

            let judgeNumber = 0;
            let baseNumber = 1;

            if(value.fn && value.fn === "divide") {
                if(value.args[0] && value.args[0].value) {
                    judgeNumber = value.args[0].value;
                    baseNumber = value.args[1].value;
                }
            } else if(value.value) {
                judgeNumber = value.value;
            }

            let period = left.periodicFunction;
            if(left.periodLike) {
                period = 0;
            }

            judgeNumber %= 2;
            baseNumber %= 2;

            if(baseNumber === 0) {
                if(left.evenFunction) {
                    return createEvenFunctionResult(left.isMathJs, expr, 0, false, period, false);
                }
            } else if(judgeNumber === 0 && baseNumber !== 0) {
                if(left.oddFunction || left.evenFunction) {
                    return createEvenFunctionResult(left.isMathJs, expr, 0, false, period, false);
                }
            } else if(judgeNumber !== 0 && baseNumber !== 0) {
                if(left.evenFunction) {
                    return createEvenFunctionResult(left.isMathJs, expr, 0, false, period, false);
                } else if(left.oddFunction) {
                    return createOddFunctionResult(left.isMathJs, expr, 0, false, period, false);
                }
            }

            return createResult(left.isMathJs, expr, 0, false, period, false);
        } else {
            let period = lcm(left.periodicFunction, right.periodicFunction);
            if(left.periodLike || right.periodLike) {
                period = 0;
            }

            if(left.evenFunction || right.evenFunction) {
                return createEvenFunctionResult(left.isMathJs || right.isMathJs, expr, 0, false, period, false);
            }
            return createResult(left.isMathJs || right.isMathJs, expr, 0, false, period, false);
        }
    },
    sqrt: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.sqrt(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    log: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.log(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    log10: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.log10(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    log2: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.log2(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    abs: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.abs(${value.value})`;

        return makeFunctionResult(expr, 2, value);
    },
    sin: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        return makePeriodFunctionResult(`Math.sin(${value.value})`, 2 * Math.PI, args, 1, value);
    },
    cos: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        return makePeriodFunctionResult(`Math.cos(${value.value})`, 2 * Math.PI, args, 2, value);
    },
    tan: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        return makePeriodFunctionResult(`Math.tan(${value.value})`, Math.PI, args, 1, value);
    },
    cot: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        return makePeriodFunctionResult(`1 / Math.tan(${value.value})`, Math.PI, args, 1, value);
    },
    sec: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        return makePeriodFunctionResult(`(1 / Math.cos(${value.value}))`, 2 * Math.PI, args, 2, value);
    },
    csc: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        return makePeriodFunctionResult(`(1 / Math.sin(${value.value}))`, 2 * Math.PI, args, 1, value);
    },
    asin: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.asin(${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    acos: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.acos(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    atan: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.atan(${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    acot: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.atan(1 / ${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    asec: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.acos(1 / ${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    acsc: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.asin(1 / ${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    sinh: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.sinh(${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    cosh: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.cosh(${value.value})`;

        return makeFunctionResult(expr, 2, value);
    },
    tanh: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.tanh(${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    coth: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `(1 / Math.tanh(${value.value}))`;

        return makeFunctionResult(expr, 1, value);
    },
    sech: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `(1 / Math.cosh(${value.value}))`;

        return makeFunctionResult(expr, 2, value);
    },
    csch: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `(1 / Math.sinh(${value.value}))`;

        return makeFunctionResult(expr, 1, value);
    },
    asinh: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.asinh(${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    acosh: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.acosh(${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    atanh: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.atanh(${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    acoth: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.atanh(1 / ${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    asech: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.acosh(1 / ${value.value})`;

        return makeFunctionResult(expr, 0, value);
    },
    acsch: (args: any[]): Result => {
        const value = judgeObject(args[0]);
        const expr = `Math.asinh(1 / ${value.value})`;

        return makeFunctionResult(expr, 1, value);
    },
    integrate: (args: any[]): Result => {
        // console.log(args);

        const expr = judgeObject(args[0]);
        const index = judgeObject(args[1]);
        const lower = judgeObject(args[2]);
        const upper = judgeObject(args[3]);

        // console.log(expr, index, lower, upper);

        return {} as Result;
    },
};

function judgeObject(obj: any): Result {
    if(obj.fn) {
        if(obj.fn.name) {
            return FunctionType[obj.fn.name as keyof typeof FunctionType](obj.args);
        }
        return FunctionType[obj.fn as keyof typeof FunctionType](obj.args);
    } else if(obj.name) {
        if(obj.name === "x" || obj.name === "y") {
            return createOddFunctionResult(false, `${obj.name}`, 1, false, 0, false);
        }
        return createEvenFunctionResult(false, `${obj.name}`, 2, false, 0, false);
    } else if(obj.value !== undefined) {
        return createEvenFunctionResult(false, `${obj.value}`, 2, true, 0, false);
    } else if(obj.content) {
        return judgeObject(obj.content);
    }
    return createResult(false, "", 0, false);
}

function parseMathjs(obj: any): Result {
    const result =  judgeObject(obj);

    return result;
}

export { parseMathjs };
export type { Result };
