function finiteValue(num: number) {
    return isFinite(num) ? num : 0;
}

function getBezierControlPointQ(arr: any) {
    const x0 = arr[0].x, y0 = arr[0].y;
    const x1 = arr[1].x, y1 = arr[1].y;
    const x2 = arr[2].x, y2 = arr[2].y;

    const ctrlX = 2 * x1 - 0.5 * x0 - 0.5 * x2;
    const ctrlY = 2 * y1 - 0.5 * y0 - 0.5 * y2;

    return { x: ctrlX, y: ctrlY };
}

function getBezierControlPointC(arr: any) {
    const x0 = arr[0].x, y0 = arr[0].y;
    const x1 = arr[1].x, y1 = arr[1].y;
    const x2 = arr[2].x, y2 = arr[2].y;
    const x3 = arr[3].x, y3 = arr[3].y;

    const ctrlX1 = 3 * x1 - 1.5 * x2 - 0.8333333 * x0 + 0.333333 * x3;
    const ctrlY1 = 3 * y1 - 1.5 * y2 - 0.8333333 * y0 + 0.333333 * y3;

    const ctrlX2 = 3 * x2 - 1.5 * x1 - 0.8333333 * x3 + 0.333333 * x0;
    const ctrlY2 = 3 * y2 - 1.5 * y1 - 0.8333333 * y3 + 0.333333 * y0;

    return [
        { x: ctrlX1, y: ctrlY1 },
        { x: ctrlX2, y: ctrlY2 },
    ];
}

export {
    finiteValue,
    getBezierControlPointC,
    getBezierControlPointQ,
};
