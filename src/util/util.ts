class NumberSet extends Set<number> {
    areEqual(value1: number, value2: number): boolean {
        return Math.abs(value1 - value2) < 0.01;
    }

    add(value: number): this {
        if (!this.hasEqualValue(value)) {
            super.add(value);
        }
        return this;
    }

    hasEqualValue(value: number): boolean {
        for (let item of this) {
            if (this.areEqual(value, item)) {
                return true;
            }
        }
        return false;
    }
}

function throttled(fn: Function, delay: number) {
    let timer: number = 0;
    let startTime = Date.now();

    return function(this: any) {
        let curTime = Date.now();
        let remaining = delay - (curTime - startTime);
        let context = this;
        let args = arguments;

        clearTimeout(timer);

        if (remaining <= 0) {
            fn.apply(context, args);
            startTime = Date.now();
        } else {
            timer = setTimeout(fn, remaining);
        }
    };
}

function fixedNumber(num: number) {
    const temp = Number(num.toFixed(3));
    return temp === 0 ? 0 : temp;
}

export { throttled, fixedNumber, NumberSet };
