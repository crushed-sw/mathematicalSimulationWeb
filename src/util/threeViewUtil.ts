import earcut from "earcut"
import createTriangulation from "incremental-delaunay"

type utilPointConfig = {
    x: number,
    y: number,
};

type utilLineConfig = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}

type threePointConfig = {
    x: number,
    y: number,
    z: number,
}

type threeLineConfig = {
    p1: threePointConfig,
    p2: threePointConfig,
}

function isNumberArrIn(arr: number[], allArr: number[][]): boolean {
    for(let i = 0; i !== allArr.length; ++i) {
        if(arr.length === allArr[i].length) {
            let flag = true;
            for(let j = 0; j !== allArr[i].length; ++j) {
                if(arr[j] !== allArr[i][j]) {
                    flag = false;
                }
            }
            if(flag) {
                return true;
            }
        }
    }
    return false;
}

function getThreePoints(fontPoints: any[], topPoints: any[], leftPoints: any[]) {
    const fontPointsArr: threePointConfig[] = [];
    const topPointsArr: threePointConfig[] = [];
    const leftPointsArr: threePointConfig[] = [];

    fontPoints.forEach((fontPoint: any) => {
        topPoints.forEach((topPoint: any) => {
            if(Math.abs(fontPoint.x - topPoint.x) < 3) {
                leftPoints.forEach((leftPoint: any) => {
                    if(Math.abs(fontPoint.y - leftPoint.y) < 3 && Math.abs(topPoint.y - leftPoint.x) < 3) {
                        leftPointsArr.push({ x: topPoint.y, y: fontPoint.x, z: fontPoint.y });
                    }
                });
            }
        });
    });

    fontPoints.forEach((fontPoint: any) => {
        leftPoints.forEach((leftPoint: any) => {
            if(Math.abs(fontPoint.y - leftPoint.y) < 3) {
                topPoints.forEach((topPoint: any) => {
                    if(Math.abs(fontPoint.x - topPoint.x) < 3 && Math.abs(leftPoint.x - topPoint.y) < 3) {
                        topPointsArr.push({ x: leftPoint.x, y: fontPoint.x, z: fontPoint.y });
                    }
                });
            }
        });
    });

    topPoints.forEach((topPoint: any) => {
        leftPoints.forEach((leftPoint: any) => {
            if(Math.abs(topPoint.y - leftPoint.x) < 3) {
                fontPoints.forEach((fontPoint: any) => {
                    if(Math.abs(topPoint.x - fontPoint.x) < 3 && Math.abs(leftPoint.y - fontPoint.y) < 3) {
                        fontPointsArr.push({ x: leftPoint.x, y: topPoint.x, z: leftPoint.y });
                    }
                });
            }
        });
    });

    const allPoints: threePointConfig[] = [];
    leftPointsArr.forEach((leftPoint: threePointConfig) => {
        const value = allPoints.findIndex((point: threePointConfig) => {
            return Math.abs(point.x - leftPoint.x) < 3 &&
                   Math.abs(point.y - leftPoint.y) < 3 &&
                   Math.abs(point.z - leftPoint.z) < 3;
        });
        if(value === -1) {
            allPoints.push(leftPoint);
        }
    });

    topPointsArr.forEach((topPoint: threePointConfig) => {
        const value = allPoints.findIndex((point: threePointConfig) => {
            return Math.abs(point.x - topPoint.x) < 3 &&
                   Math.abs(point.y - topPoint.y) < 3 &&
                   Math.abs(point.z - topPoint.z) < 3;
        });
        if(value === -1) {
            allPoints.push(topPoint);
        }
    });

    fontPointsArr.forEach((fontPoint: threePointConfig) => {
        const value = allPoints.findIndex((point: threePointConfig) => {
            return Math.abs(point.x - fontPoint.x) < 3 &&
                   Math.abs(point.y - fontPoint.y) < 3 &&
                   Math.abs(point.z - fontPoint.z) < 3;
        });
        if(value === -1) {
            allPoints.push(fontPoint);
        }
    });

    return allPoints;
}

function isLineInLines(line: utilLineConfig, lines: any[], type: boolean = true) {
    const lineDistance = Math.sqrt(Math.pow(line.y2 - line.y1, 2) + Math.pow(line.x2 - line.x1, 2));
    if(lineDistance < 3) {
        return type;
    }

    let currentTheta = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
    if(currentTheta < 0) { currentTheta += Math.PI }
    if(currentTheta >= Math.PI) { currentTheta -= Math.PI }
    const a = line.y2 - line.y1;
    const b = line.x1 - line.x2;
    const c = line.x2 * line.y1 - line.x1 * line.y2;
    const base = Math.sqrt(Math.pow(line.y2 - line.y1, 2) + Math.pow(line.x2 - line.x1, 2));

    for(const tempLine of lines) {
        let theta = Math.atan2(tempLine.points[3] - tempLine.points[1], tempLine.points[2] - tempLine.points[0]);
        if(theta < 0) { theta += Math.PI }
        if(theta >= Math.PI) { theta -= Math.PI }
        if(Math.abs(currentTheta - theta) < 0.05) {
            const distance = Math.abs(a * tempLine.points[0] + b * tempLine.points[1] + c) / base;
            if(distance < 3) {
                return true;
            }
        }
    }

    return false;
}

function getThreeLines(fontLines: any[], topLines: any[], leftLines: any[], allPoints: threePointConfig[]) {
    const allLines: number[][] = [];

    for(let i = 0; i < allPoints.length; ++i) {
        for(let j = i + 1; j < allPoints.length; ++j) {
            const newLineFont: utilLineConfig = {
                x1: allPoints[i].y,
                y1: allPoints[i].z,
                x2: allPoints[j].y,
                y2: allPoints[j].z,
            };
            const newLineTop: utilLineConfig = {
                x1: allPoints[i].y,
                y1: allPoints[i].x,
                x2: allPoints[j].y,
                y2: allPoints[j].x,
            };
            const newLineLeft: utilLineConfig = {
                x1: allPoints[i].x,
                y1: allPoints[i].z,
                x2: allPoints[j].x,
                y2: allPoints[j].z,
            };
            if(isLineInLines(newLineFont, fontLines) &&
               isLineInLines(newLineTop, topLines) &&
               isLineInLines(newLineLeft, leftLines)) {
                allLines.push([i, j]);
            }
        }
    }

    return allLines;
}

function getParamB(line: any) {
    return (line.points[3] - line.points[1]) * line.points[0] +
           (line.points[0] - line.points[2]) * line.points[1];
}

function getIntersection(line1: any, line2: any, b1: number, b2: number): utilPointConfig {
    const x1 = line1.points[0];
    const y1 = line1.points[1];
    const x2 = line1.points[2];
    const y2 = line1.points[3];

    const x3 = line2.points[0];
    const y3 = line2.points[1];
    const x4 = line2.points[2];
    const y4 = line2.points[3];

    const d = 1 / ((x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1));
    const d1 = b2 * (x2 - x1) - b1 * (x4 - x3);
    const d2 = b2 * (y2 - y1) - b1 * (y4 - y3);

    return {x: d1 * d, y: d2 * d};
}

function isIntersectionActive(line1: any, line2: any, point: utilPointConfig) {
    if(!isFinite(point.x) || !isFinite(point.y)) {
        return false;
    }

    const xMax1 = Math.max(line1.points[0], line1.points[2]) + 1;
    const xMin1 = Math.min(line1.points[0], line1.points[2]) - 1;
    const yMax1 = Math.max(line1.points[1], line1.points[3]) + 1;
    const yMin1 = Math.min(line1.points[1], line1.points[3]) - 1;

    const xMax2 = Math.max(line2.points[0], line2.points[2]) + 1;
    const xMin2 = Math.min(line2.points[0], line2.points[2]) - 1;
    const yMax2 = Math.max(line2.points[1], line2.points[3]) + 1;
    const yMin2 = Math.min(line2.points[1], line2.points[3]) - 1;

    if(point.x < xMin1 || point.x > xMax1 || point.x < xMin2 || point.x > xMax2 ||
       point.y < yMin1 || point.y > yMax1 || point.y < yMin2 || point.y > yMax2) {
        return false;
    }

    return true;
}

function isCollineation(point1: utilPointConfig, point2: utilPointConfig, lineParams: number[]) {
    let theta = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    if(theta < 0) { theta += Math.PI }
    if(theta >= Math.PI) { theta -= Math.PI }

    if(Math.abs(theta - lineParams[0]) < 0.01) {
        const a = lineParams[1];
        const b = lineParams[2];
        const c = lineParams[3];
        const distance = Math.abs(a * point1.x + b * point1.y + c) / Math.sqrt(a * a + b * b);
        if(distance < 3) {
            return true;
        }
    }
    return false;
}

function getTwoAllPoint(lines: any, dashes: any): utilPointConfig[] {
    const allPoints: utilPointConfig[] = [];
    const tempLines: any[] = [...lines, ...dashes];
    const lineParams = tempLines.map((line: any) => { return getParamB(line) });

    for(let i = 0; i < tempLines.length; ++i) {
        for(let j = i + 1; j < tempLines.length; ++j) {
            const point = getIntersection(tempLines[i], tempLines[j], lineParams[i], lineParams[j]);
            if(isIntersectionActive(tempLines[i], tempLines[j], point)) {
                const index = allPoints.findIndex((tempPoint: utilPointConfig) => {
                    return Math.abs(tempPoint.x - point.x) < 3 && Math.abs(tempPoint.y - point.y) < 3;
                });
                if(index === -1) {
                    allPoints.push(point);
                }
            }
        }
    }

    return allPoints;
}

function getTwoAllLine(lines: any, dashes: any, points: utilPointConfig[]): number[][][] {
    const tempLines: any[] = [...lines, ...dashes];
    const lineParams = tempLines.map((line: any) => {
        let theta = Math.atan2(line.points[3] - line.points[1], line.points[2] - line.points[0]);
        if(theta < 0) { theta += Math.PI }
        if(theta >= Math.PI) { theta -= Math.PI }
        const a = line.points[3] - line.points[1];
        const b = line.points[0] - line.points[2];
        const c = line.points[2] * line.points[1] - line.points[0] * line.points[3];
        return [theta, a, b, c];
    });

    const lineArr: number[][][] = [];
    for(let i = 0; i < points.length; ++i) {
        for(let j = i + 1; j < points.length; ++j) {
            for(let k = 0; k < tempLines.length; ++k) {
                if(isCollineation(points[i], points[j], lineParams[k])) {
                    lineArr.push([[i, j], lineParams[k]]);
                }
            }
        }
    }

    return getTwoMinAllLine(lineArr, points);
}

function getTwoMinAllLine(lines: number[][][], points: utilPointConfig[]): number[][][] {
    const removeSet: Set<number> = new Set();
    for(let i = 0; i < lines.length; ++i) {
        for(let j = i + 1; j < lines.length; ++j) {
            if(isCollineation(points[lines[i][0][0]], points[lines[i][0][1]], lines[j][1])) {
                const point1 = points[lines[i][0][0]];
                const point2 = points[lines[i][0][1]];
                const point3 = points[lines[j][0][0]];
                const point4 = points[lines[j][0][1]];

                const xMin1 = Math.min(point1.x, point2.x);
                const xMax1 = Math.max(point1.x, point2.x);
                const yMin1 = Math.min(point1.y, point2.y);
                const yMax1 = Math.max(point1.y, point2.y);

                const xMin2 = Math.min(point3.x, point4.x);
                const xMax2 = Math.max(point3.x, point4.x);
                const yMin2 = Math.min(point3.y, point4.y);
                const yMax2 = Math.max(point3.y, point4.y);

                if(xMin1 - 3 < xMin2 && xMax1 + 3 > xMax2 &&
                   yMin1 - 3 < yMin2 && yMax1 + 3 > yMax2) {
                    removeSet.add(i);
                }
                if(xMin2 - 3 < xMin1 && xMax2 + 3 > xMax1 &&
                   yMin2 - 3 < yMin1 && yMax2 + 3 > yMax1) {
                    removeSet.add(j);
               }
            }
        }
    }

    const removeArr = Array.from(removeSet);
    removeArr.sort((a: number, b: number) => b - a );
    removeArr.forEach((index: number) => {
        lines.splice(index, 1);
    });

    return lines
}

function getLineOtherPointArr(arr: number[]): number[] {
    const result: number[] = [];
    for(let i = 0; i < arr.length; ++i) {
        if(arr[i] === 1) {
            result.push(i);
        }
    }
    return result;
}

function isPointsInLine(p1: threePointConfig, p2: threePointConfig, p3: threePointConfig) {
    let thetaX1 = Math.atan2(p2.z - p1.z, p2.y - p1.y);
    let thetaY1 = Math.atan2(p2.x - p1.x, p2.z - p1.z);
    let thetaZ1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    let thetaX2 = Math.atan2(p3.z - p2.z, p3.y - p2.y);
    let thetaY2 = Math.atan2(p3.x - p2.x, p3.z - p2.z);
    let thetaZ2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);

    if(thetaX1 < 0) { thetaX1 += Math.PI }
    if(thetaY1 < 0) { thetaY1 += Math.PI }
    if(thetaZ1 < 0) { thetaZ1 += Math.PI }
    if(thetaX2 < 0) { thetaX2 += Math.PI }
    if(thetaY2 < 0) { thetaY2 += Math.PI }
    if(thetaZ2 < 0) { thetaZ2 += Math.PI }

    if(thetaX1 >= Math.PI) { thetaX1 -= Math.PI }
    if(thetaY1 >= Math.PI) { thetaY1 -= Math.PI }
    if(thetaZ1 >= Math.PI) { thetaZ1 -= Math.PI }
    if(thetaX2 >= Math.PI) { thetaX2 -= Math.PI }
    if(thetaY2 >= Math.PI) { thetaY2 -= Math.PI }
    if(thetaZ2 >= Math.PI) { thetaZ2 -= Math.PI }

    if(Math.abs(thetaX1 - thetaX2) < 0.01 && Math.abs(thetaY1 - thetaY2) < 0.01 && Math.abs(thetaZ1 - thetaZ2) < 0.01) {
        return true;
    }
    return false;
}

function isPointsSelected(pointIndex1: number, pointIndex2: number, pointIndex3: number, selected: number[][]) {
    for(let i = 0; i !== selected.length; ++i) {
        if(selected[i].includes(pointIndex1) && selected[i].includes(pointIndex2) && selected[i].includes(pointIndex3)) {
            return true;
        }
    }
    return false;
}

function getPointsInFace(point1: threePointConfig, point2: threePointConfig, point3: threePointConfig, points: threePointConfig[]): number[][] {
    const a = (point2.y - point1.y) * (point3.z - point1.z) - (point2.z - point1.z) * (point3.y - point1.y);
    const b = (point2.z - point1.z) * (point3.x - point1.x) - (point2.x - point1.x) * (point3.z - point1.z);
    const c = (point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x);
    const d = -(a * point1.x + b * point1.y + c * point1.z);

    const base = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2));
    const arr: number[] = [];
    let index = 0;
    points.forEach((point: threePointConfig) => {
        const distance = Math.abs(a * point.x + b * point.y + c * point.z + d) / base;
        if(distance < 3) {
            arr.push(index);
        }
        index++;
    });

    return [arr, [a, b, c, d, base]];
}

function isThreeLinesInLine(p1: threePointConfig, p2: threePointConfig, p3: threePointConfig, p4: threePointConfig) {
    const vectorX1 = Math.abs(p2.x - p1.x) < 3 ? 0 : p2.x - p1.x;
    const vectorY1 = Math.abs(p2.y - p1.y) < 3 ? 0 : p2.y - p1.y;
    const vectorZ1 = Math.abs(p2.z - p1.z) < 3 ? 0 : p2.z - p1.z;

    const vectorX2 = Math.abs(p4.x - p3.x) < 3 ? 0 : p4.x - p3.x;
    const vectorY2 = Math.abs(p4.y - p3.y) < 3 ? 0 : p4.y - p3.y;
    const vectorZ2 = Math.abs(p4.z - p3.z) < 3 ? 0 : p4.z - p3.z;

    let thetaX1 = Math.atan2(vectorZ1, vectorY1);
    let thetaY1 = Math.atan2(vectorX1, vectorZ1);
    let thetaZ1 = Math.atan2(vectorY1, vectorX1);

    let thetaX2 = Math.atan2(vectorZ2, vectorY2);
    let thetaY2 = Math.atan2(vectorX2, vectorZ2);
    let thetaZ2 = Math.atan2(vectorY2, vectorX2);

    if(thetaX1 < 0) { thetaX1 += Math.PI }
    if(thetaY1 < 0) { thetaY1 += Math.PI }
    if(thetaZ1 < 0) { thetaZ1 += Math.PI }
    if(thetaX2 < 0) { thetaX2 += Math.PI }
    if(thetaY2 < 0) { thetaY2 += Math.PI }
    if(thetaZ2 < 0) { thetaZ2 += Math.PI }

    if(thetaX1 >= Math.PI) { thetaX1 -= Math.PI }
    if(thetaY1 >= Math.PI) { thetaY1 -= Math.PI }
    if(thetaZ1 >= Math.PI) { thetaZ1 -= Math.PI }
    if(thetaX2 >= Math.PI) { thetaX2 -= Math.PI }
    if(thetaY2 >= Math.PI) { thetaY2 -= Math.PI }
    if(thetaZ2 >= Math.PI) { thetaZ2 -= Math.PI }

    if(Math.abs(thetaX1 - thetaX2) < 0.01 && Math.abs(thetaY1 - thetaY2) < 0.01 && Math.abs(thetaZ1 - thetaZ2) < 0.01) {
        const ab = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z];
        const ac = [p3.x - p1.x, p3.y - p1.y, p3.z - p1.z];
        const cross = [
            ab[1] * ac[2] - ab[2] * ac[1],
            ab[2] * ac[0] - ab[0] * ac[2],
            ab[0] * ac[1] - ab[1] * ac[0],
        ];
        const distance = Math.sqrt(Math.pow(cross[0], 2) + Math.pow(cross[1], 2) + Math.pow(cross[2], 2)) /
                         Math.sqrt(Math.pow(ab[0], 2) + Math.pow(ab[1], 2) + Math.pow(ab[2], 2));
        if(distance < 5) {
            return true;
        }
    }
    return false;
}

function findCycles(adjMatrix: number[][], start: number): number[][] {
    const cycles: number[][] = [];
    const visited: boolean[] = new Array(adjMatrix.length).fill(false);


    const path: number[] = [];
    dfs(adjMatrix, start, start, visited, path, cycles);

    return cycles;
}

function dfs(adjMatrix: number[][], beginNum: number, startVertex: number, visited: boolean[], path: number[], cycles: number[][]): void {
    visited[startVertex] = true;
    path.push(startVertex);

    for (let vertex = 0; vertex < adjMatrix.length; vertex++) {
        if (adjMatrix[startVertex][vertex] === 1) {
            if (visited[vertex]) {
                const cycleStartIndex = path.indexOf(vertex);
                if (cycleStartIndex !== -1) {
                    const cycle = path.slice(cycleStartIndex);
                    if(cycle.length > 2 && cycle[0] === beginNum) {
                        cycles.push(cycle);
                    }
                }
            } else {
                dfs(adjMatrix, beginNum, vertex, visited, path, cycles);
            }
        }
    }

    path.pop();
    visited[startVertex] = false;
}

function isLineInFace(line: number[], faceParam: number[], allPoints: threePointConfig[]): boolean {
    const point1 = allPoints[line[0]];
    const point2 = allPoints[line[1]];

    const distance1 = Math.abs(faceParam[0] * point1.x +
                               faceParam[1] * point1.y +
                               faceParam[2] * point1.z +
                               faceParam[3]) / faceParam[4];
    const distance2 = Math.abs(faceParam[0] * point2.x +
                               faceParam[1] * point2.y +
                               faceParam[2] * point2.z +
                               faceParam[3]) / faceParam[4];
    if(distance1 < 3 && distance2 < 3) {
        return true;
    }
    return false;
}


function getLineInFaceNumber(allLines: number[][], uniqueCircles: number[][][]) {
    const faceNum: number[] = [];
    const faceArr: number[][] = [];

    for(let i = 0; i !== allLines.length; ++i) {
        let num = 0;
        let faceIndex = 0;
        const face: number[] = [];
        uniqueCircles.forEach((circle: number[][]) => {
            const index = circle[0].findIndex((value: number) => {
                return value === allLines[i][0];
            });
            if(index !== -1) {
                if(circle[0][(index - 1 + circle[0].length) % circle[0].length] === allLines[i][1] ||
                   circle[0][(index + 1) % circle[0].length] === allLines[i][1]) {
                    num++;
                    face.push(faceIndex);
                }
            }
            faceIndex++;
        });
        faceNum.push(num);
        faceArr.push(face);
    }

    return {num: faceNum, arr: faceArr};
}

function deleteOneLineFace(allLines: number[][], uniqueCircles: number[][][]) {
    while(true) {
        const obj = getLineInFaceNumber(allLines, uniqueCircles);

        let zeroFlag = false;
        const deleteLineArr: number[] = [];
        const deleteFaceArr: number[] = [];
        for(let i = 0; i !== obj.num.length; ++i) {
            if(obj.num[i] === 1) {
                deleteLineArr.push(i);
                deleteFaceArr.push(obj.arr[i][0]);
                zeroFlag = true;
            } else if(obj.num[i] === 0) {
                deleteLineArr.push(i);
                zeroFlag = true;
            }
        }

        deleteLineArr.sort((a: number, b: number) => b - a );
        deleteFaceArr.sort((a: number, b: number) => b - a );

        deleteLineArr.forEach((num: number) => { allLines.splice(num, 1) });
        deleteFaceArr.forEach((num: number) => { uniqueCircles.splice(num, 1) });

        if(!zeroFlag) {
            return obj;
        }
    }
}

function getNumberOfViewLine(allLines: number[][], uniqueCircles: number[][][], LinesToThree: number[][][][], allViewLine: number[][][][]) {
    const fontLineNumber: number[] = Array.from({ length: allViewLine[0].length }, () => 0);
    const topLineNumber: number[] = Array.from({ length: allViewLine[1].length }, () => 0);
    const leftLineNumber: number[] = Array.from({ length: allViewLine[2].length }, () => 0);

    uniqueCircles.forEach((circle: number[][]) => {
        for(let i = 0; i < circle[0].length; ++i) {
            const left = circle[0][i];
            const right = circle[0][(i + 1) % circle[0].length];

            const index = allLines.findIndex((line: number[]) => {
                return (left === line[0] && right === line[1]) ||
                       (left === line[1] && right === line[0]);
            });
            if(index !== -1) {
                LinesToThree[0][index].forEach((thisLine: number[]) => {
                    const fontIndex = allViewLine[0].findIndex((tempLine: number[][]) => {
                        return (thisLine[0] === tempLine[0][0] && thisLine[1] === tempLine[0][1]) ||
                               (thisLine[1] === tempLine[0][0] && thisLine[0] === tempLine[0][1]);
                    });
                    if(fontIndex !== -1) {
                        fontLineNumber[fontIndex]++;
                    }
                });

                LinesToThree[1][index].forEach((thisLine: number[]) => {
                    const topIndex = allViewLine[1].findIndex((tempLine: number[][]) => {
                        return (thisLine[0] === tempLine[0][0] && thisLine[1] === tempLine[0][1]) ||
                               (thisLine[1] === tempLine[0][0] && thisLine[0] === tempLine[0][1]);
                    });
                    if(topIndex !== -1) {
                        topLineNumber[topIndex]++;
                    }
                });

                LinesToThree[2][index].forEach((thisLine: number[]) => {
                    const leftIndex = allViewLine[2].findIndex((tempLine: number[][]) => {
                        return (thisLine[0] === tempLine[0][0] && thisLine[1] === tempLine[0][1]) ||
                               (thisLine[1] === tempLine[0][0] && thisLine[0] === tempLine[0][1]);
                    });
                    if(leftIndex !== -1) {
                        leftLineNumber[leftIndex]++;
                    }
                });
            }
        }
    });

    return [fontLineNumber, topLineNumber, leftLineNumber];
}


function checkLinesIsActive(allLines: number[][], uniqueCircles: number[][][], LinesToThree: number[][][][], allViewLine: number[][][][]): boolean {
    const viewLines = getNumberOfViewLine(allLines, uniqueCircles, LinesToThree, allViewLine);
    let isTrue = true;
    viewLines.forEach((view: number[]) => {
        view.forEach((num: number) => {
            if(num === 0) {
                isTrue = false;
            }
        });
    });
    return isTrue;
}

const endResult: any[] = [];
function solveThreeFaceinLine(allLines: number[][], uniqueCircles: number[][][], LinesToThree: number[][][][], allViewLine: number[][][][]) {
    const faceLineObj = getLineInFaceNumber(allLines, uniqueCircles);
    let line: number = -1;
    let face: number[] = [];
    for(let i = 0; i !== faceLineObj.num.length; ++i) {
        if(faceLineObj.num[i] > 2) {
            line = i;
            face = faceLineObj.arr[i];
            break;
        }
    }

    if(line === -1) {
        endResult.push([allLines, uniqueCircles]);
        return {
            isOK: true,
            data: [allLines, uniqueCircles],
        }
    }

    for(let i = 0; i !== face.length; ++i) {
        for(let j = i + 1; j !== face.length; ++j) {
            const backCircles: number[][][] = Array.from(uniqueCircles);
            const backLines: number[][] = Array.from(allLines);

            for(let k = 0; k !== face.length; ++k) {
                if(k !== i && k !== j) {
                    backCircles.splice(face[k], 1);
                }
            }

            let faceLineObj = getLineInFaceNumber(backLines, backCircles);

            deleteOneLineFace(backLines, backCircles);
            if(checkLinesIsActive(backLines, backCircles, LinesToThree, allViewLine)) {
                solveThreeFaceinLine(backLines, backCircles, LinesToThree, allViewLine);
            }
        }
    }

    return {
        isOK: false,
        data: [allLines, uniqueCircles],
    }
}

function solve(
    fontPoints: any[],
    leftPoints: any[],
    topPoints: any[],
    fontLines: any[],
    leftLines: any[],
    topLines: any[],
    fontDashes: any[],
    leftDashes: any[],
    topDashes: any[],
) {
    const allFontPoints = getTwoAllPoint(fontLines, fontDashes);
    const allTopPoints = getTwoAllPoint(topLines, topDashes);
    const allLeftPoints = getTwoAllPoint(leftLines, leftDashes);

    const allFontLine = getTwoAllLine(fontLines, fontDashes, allFontPoints);
    const allTopLine = getTwoAllLine(topLines, topDashes, allTopPoints);
    const allLeftLine = getTwoAllLine(leftLines, leftDashes, allLeftPoints);

    const allPoints = getThreePoints(allFontPoints, allTopPoints, allLeftPoints);
    const allLines =  getThreeLines([...fontLines, ...fontDashes],
                                    [...topLines, ...topDashes],
                                    [...leftLines, ...leftDashes],
                                    allPoints);

    const removeSet: Set<number> = new Set();
    for(let i = 0; i < allLines.length; ++i) {
        for(let j = i + 1; j < allLines.length; ++j) {
            const point1 = allPoints[allLines[i][0]];
            const point2 = allPoints[allLines[i][1]];
            const point3 = allPoints[allLines[j][0]];
            const point4 = allPoints[allLines[j][1]];
            if(isThreeLinesInLine(point1, point2, point3, point4)) {
                const xMin1 = Math.min(point1.x, point2.x);
                const xMax1 = Math.max(point1.x, point2.x);
                const yMin1 = Math.min(point1.y, point2.y);
                const yMax1 = Math.max(point1.y, point2.y);
                const zMin1 = Math.min(point1.z, point2.z);
                const zMax1 = Math.max(point1.z, point2.z);

                const xMin2 = Math.min(point3.x, point4.x);
                const xMax2 = Math.max(point3.x, point4.x);
                const yMin2 = Math.min(point3.y, point4.y);
                const yMax2 = Math.max(point3.y, point4.y);
                const zMin2 = Math.min(point3.z, point4.z);
                const zMax2 = Math.max(point3.z, point4.z);
                if(xMin1 - 3 < xMin2 && xMax1 + 3 > xMax2 &&
                   yMin1 - 3 < yMin2 && yMax1 + 3 > yMax2 &&
                   zMin1 - 3 < zMin2 && zMax1 + 3 > zMax2) {
                    removeSet.add(i);
                }
                if(xMin2 - 3 < xMin1 && xMax2 + 3 > xMax1 &&
                   yMin2 - 3 < yMin1 && yMax2 + 3 > yMax1 &&
                   zMin2 - 3 < zMin1 && zMax2 + 3 > zMax1) {
                    removeSet.add(j);
               }
            }
        }
    }

    const removeArr = Array.from(removeSet);
    removeArr.sort((a: number, b: number) => b- a);
    removeArr.forEach((value: number) => {
        allLines.splice(value, 1);
    });

    const n = allPoints.length;
    const graph: number[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
    allLines.forEach((line: number[]) => {
        graph[line[0]][line[1]] = 1;
        graph[line[1]][line[0]] = 1;
    });

    const selectedPoint: number[][] = [];
    const allFace: number[][] = [];
    const allFaceNormal: number[][] = [];
    for(let i = 0; i < allPoints.length; ++i) {
        const arr = getLineOtherPointArr(graph[i]);
        for(let j = 0; j < arr.length; ++j) {
            for(let k = j + 1; k < arr.length; ++k) {
                if(isPointsSelected(arr[j], i, arr[k], selectedPoint)) { break }
                selectedPoint.push([arr[j], i, arr[k]]);

                if(!isPointsInLine(allPoints[arr[j]], allPoints[i], allPoints[arr[k]])) {
                    const facePoints = getPointsInFace(allPoints[arr[j]], allPoints[i], allPoints[arr[k]], allPoints);
                    if(!isNumberArrIn(facePoints[0], allFace) && facePoints[0].length > 2) {
                        allFace.push(facePoints[0]);
                        allFaceNormal.push(facePoints[1]);
                    }
                }
            }
        }
    }

    const faceInLine: number[][][] = [];
    allFace.forEach((face: number[]) => {
        const lines: number[][] = [];
        for(let i = 0; i < graph.length; ++i) {
            for(let j = i + 1; j < graph[i].length; ++j) {
                if(graph[i][j] && face.includes(i) && face.includes(j)) {
                    lines.push([i, j]);
                }
            }
        }
        faceInLine.push(lines);
    });

    const faceCircles: number[][][] = [];
    for(let i = 0; i !== faceInLine.length; ++i) {
        const lines = faceInLine[i];

        const thisN = allPoints.length;
        const thisGraph: number[][] = Array.from({ length: thisN }, () => Array.from({ length: thisN }, () => 0));

        lines.forEach((line: number[]) => {
            thisGraph[line[0]][line[1]] = 1;
            thisGraph[line[1]][line[0]] = 1;
        });

        const vectorZ: number[] = [...allFaceNormal[i]];
        while(true) {
            let nodeValue = -1;
            let minInNum = thisN + 1;
            let index = 0;
            thisGraph.forEach((node: number[]) => {
                let sum = 0;
                node.forEach((value: number) => {
                    sum += value;
                });
                if(sum < minInNum && sum !== 0) {
                    minInNum = sum;
                    nodeValue = index;
                }
                index++;
            });
            if(nodeValue !== -1) {
                if(minInNum > 1) {
                    const circles = findCycles(thisGraph, nodeValue);
                    let circleIndex = -1;
                    let circleMinLen = Infinity;
                    for(let k = 0; k !== circles.length; ++k) {
                        if(circles[k].length < circleMinLen) {
                            circleMinLen = circles[k].length;
                            circleIndex = k;
                        }
                    }
                    if(circleIndex !== -1) {
                        faceCircles.push([circles[circleIndex], vectorZ]);
                    }
                }
                for(let k = 0; k !== thisGraph[nodeValue].length; ++k) {
                    thisGraph[nodeValue][k] = 0;
                    thisGraph[k][nodeValue] = 0;
                }
            } else {
                break
            }
        }
    };

    const uniqueCircles: number[][][] = [];
    const helpArr: number[][] = [];
    faceCircles.forEach((circle: number[][]) => {
        const tempCircle = [...circle[0]];
        tempCircle.sort((a: number, b: number) => a - b );
        if(!isNumberArrIn(tempCircle, helpArr)) {
            helpArr.push(tempCircle);
            uniqueCircles.push(circle);
        }
    });


    const fontLinesToThree: number[][][] = [];
    const topLinesToThree: number[][][] = [];
    const leftLinesToThree: number[][][] = [];

    allLines.forEach((line: number[]) => {
        const point1 = allPoints[line[0]];
        const point2 = allPoints[line[1]];

        const newLineFont1: utilPointConfig = {x: point1.y, y: point1.z}
        const newLineFont2: utilPointConfig = {x: point2.y, y: point2.z};

        const newLineTop1: utilPointConfig = {x: point1.y, y: point1.x}
        const newLineTop2: utilPointConfig = {x: point2.y, y: point2.x};

        const newLineLeft1: utilPointConfig = {x: point1.x, y: point1.z}
        const newLineLeft2: utilPointConfig = {x: point2.x, y: point2.z};

        const fontValues: number[][] = [];
        const topValues: number[][] = [];
        const leftValues: number[][] = [];

        allFontLine.forEach((fontLine: number[][]) => {
            const distance = Math.sqrt(Math.pow(newLineFont1.x - newLineFont2.x, 2) + Math.pow(newLineFont1.y - newLineFont2.y, 2));
            if(distance > 3 && isCollineation(newLineFont1, newLineFont2, fontLine[1])) {
                const newLineFont3 = allFontPoints[fontLine[0][0]];
                const newLineFont4 = allFontPoints[fontLine[0][1]];

                const xMin1 = Math.min(newLineFont1.x, newLineFont2.x) - 3;
                const xMax1 = Math.max(newLineFont1.x, newLineFont2.x) + 3;
                const yMin1 = Math.min(newLineFont1.y, newLineFont2.y) - 3;
                const yMax1 = Math.max(newLineFont1.y, newLineFont2.y) + 3;

                const xMin2 = Math.min(newLineFont3.x, newLineFont4.x);
                const xMax2 = Math.max(newLineFont3.x, newLineFont4.x);
                const yMin2 = Math.min(newLineFont3.y, newLineFont4.y);
                const yMax2 = Math.max(newLineFont3.y, newLineFont4.y);

                if(xMin1 < xMin2 && xMax1 > xMax2 && yMin1 < yMin2 && yMax1 > yMax2) {
                    fontValues.push(fontLine[0]);
                }
            }
        });

        allTopLine.forEach((topLine: number[][]) => {
            const distance = Math.sqrt(Math.pow(newLineTop1.x - newLineTop2.x, 2) + Math.pow(newLineTop1.y - newLineTop2.y, 2));
            if(distance > 3 && isCollineation(newLineTop1, newLineTop2, topLine[1])) {
                const newLineTop3 = allTopPoints[topLine[0][0]];
                const newLinetop4 = allTopPoints[topLine[0][1]];

                const xMin1 = Math.min(newLineTop1.x, newLineTop2.x) - 3;
                const xMax1 = Math.max(newLineTop1.x, newLineTop2.x) + 3;
                const yMin1 = Math.min(newLineTop1.y, newLineTop2.y) - 3;
                const yMax1 = Math.max(newLineTop1.y, newLineTop2.y) + 3;

                const xMin2 = Math.min(newLineTop3.x, newLinetop4.x);
                const xMax2 = Math.max(newLineTop3.x, newLinetop4.x);
                const yMin2 = Math.min(newLineTop3.y, newLinetop4.y);
                const yMax2 = Math.max(newLineTop3.y, newLinetop4.y);

                if(xMin1 < xMin2 && xMax1 > xMax2 && yMin1 < yMin2 && yMax1 > yMax2) {
                    topValues.push(topLine[0]);
                }
            }
        });

        allLeftLine.forEach((leftLine: number[][]) => {
            const distance = Math.sqrt(Math.pow(newLineLeft1.x - newLineLeft2.x, 2) + Math.pow(newLineLeft1.y - newLineLeft2.y, 2));
            if(distance > 3 && isCollineation(newLineLeft1, newLineLeft2, leftLine[1])) {
                const newLineLeft3 = allLeftPoints[leftLine[0][0]];
                const newLineLeft4 = allLeftPoints[leftLine[0][1]];

                const xMin1 = Math.min(newLineLeft1.x, newLineLeft2.x) - 3;
                const xMax1 = Math.max(newLineLeft1.x, newLineLeft2.x) + 3;
                const yMin1 = Math.min(newLineLeft1.y, newLineLeft2.y) - 3;
                const yMax1 = Math.max(newLineLeft1.y, newLineLeft2.y) + 3;

                const xMin2 = Math.min(newLineLeft3.x, newLineLeft4.x);
                const xMax2 = Math.max(newLineLeft3.x, newLineLeft4.x);
                const yMin2 = Math.min(newLineLeft3.y, newLineLeft4.y);
                const yMax2 = Math.max(newLineLeft3.y, newLineLeft4.y);

                if(xMin1 < xMin2 && xMax1 > xMax2 && yMin1 < yMin2 && yMax1 > yMax2) {
                    leftValues.push(leftLine[0]);
                }
            }
        });

        fontLinesToThree.push(fontValues);
        topLinesToThree.push(topValues);
        leftLinesToThree.push(leftValues);
    });

    const fontLineNumber: number[] = Array.from({ length: allFontLine.length }, () => 0);
    const topLineNumber: number[] = Array.from({ length: allTopLine.length }, () => 0);
    const leftLineNumber: number[] = Array.from({ length: allLeftLine.length }, () => 0);

    uniqueCircles.forEach((circle: number[][]) => {
        for(let i = 0; i < circle[0].length; ++i) {
            const left = circle[0][i];
            const right = circle[0][(i + 1) % circle[0].length];

            const index = allLines.findIndex((line: number[]) => {
                return (left === line[0] && right === line[1]) ||
                       (left === line[1] && right === line[0]);
            });
            if(index !== -1) {
                fontLinesToThree[index].forEach((thisLine: number[]) => {
                    const fontIndex = allFontLine.findIndex((tempLine: number[][]) => {
                        return (thisLine[0] === tempLine[0][0] && thisLine[1] === tempLine[0][1]) ||
                               (thisLine[1] === tempLine[0][0] && thisLine[0] === tempLine[0][1]);
                    });
                    if(fontIndex !== -1) {
                        fontLineNumber[fontIndex]++;
                    }
                });

                topLinesToThree[index].forEach((thisLine: number[]) => {
                    const topIndex = allTopLine.findIndex((tempLine: number[][]) => {
                        return (thisLine[0] === tempLine[0][0] && thisLine[1] === tempLine[0][1]) ||
                               (thisLine[1] === tempLine[0][0] && thisLine[0] === tempLine[0][1]);
                    });
                    if(topIndex !== -1) {
                        topLineNumber[topIndex]++;
                    }
                });

                leftLinesToThree[index].forEach((thisLine: number[]) => {
                    const leftIndex = allLeftLine.findIndex((tempLine: number[][]) => {
                        return (thisLine[0] === tempLine[0][0] && thisLine[1] === tempLine[0][1]) ||
                               (thisLine[1] === tempLine[0][0] && thisLine[0] === tempLine[0][1]);
                    });
                    if(leftIndex !== -1) {
                        leftLineNumber[leftIndex]++;
                    }
                });
            }
        }
    });

    const LinesToThree = [fontLinesToThree, topLinesToThree, leftLinesToThree];
    const allViewLine = [allFontLine, allTopLine, allLeftLine];

    endResult.splice(0, endResult.length);
    deleteOneLineFace(allLines, uniqueCircles);
    solveThreeFaceinLine(allLines, uniqueCircles, LinesToThree, allViewLine);

    console.log(endResult);

    let minResult: number[][][] = [];
    let minFaceNum = Infinity;
    endResult.forEach((value: any) => {
        const len = value[1].length;
        if(len < minFaceNum) {
            minFaceNum = len;
            minResult = value[1];
        }
    });

    const xNumbers: number[] = [];
    const yNumbers: number[] = [];
    const zNumbers: number[] = [];
    allPoints.forEach((point: threePointConfig) => {
        const xIndex = xNumbers.findIndex((num: number) => Math.abs(num - point.x) < 3 );
        const yIndex = yNumbers.findIndex((num: number) => Math.abs(num - point.y) < 3 );
        const zIndex = zNumbers.findIndex((num: number) => Math.abs(num - point.z) < 3 );

        if(xIndex === -1) xNumbers.push(Number(point.x.toFixed(0)));
        if(yIndex === -1) yNumbers.push(Number(point.y.toFixed(0)));
        if(zIndex === -1) zNumbers.push(Number(point.z.toFixed(0)));
    });

    allPoints.forEach((point: threePointConfig) => {
        const x = xNumbers.find((num: number) => Math.abs(num - point.x) < 3 );
        const y = yNumbers.find((num: number) => Math.abs(num - point.y) < 3 );
        const z = zNumbers.find((num: number) => Math.abs(num - point.z) < 3 );

        if(x !== undefined) point.x = x;
        if(y !== undefined) point.y = y;
        if(z !== undefined) point.z = z;
    });

    const triangleFace: number[][] = [];
    minResult.forEach((circle: number[][]) => {
        const distanceX = Math.pow(circle[1][1], 2) + Math.pow(circle[1][2], 2);
        const distanceY = Math.pow(circle[1][0], 2) + Math.pow(circle[1][2], 2);
        const distanceZ = Math.pow(circle[1][0], 2) + Math.pow(circle[1][1], 2);

        const minDistance = Math.min(Math.min(distanceX, distanceY), distanceZ);

        let left = 0;
        let right = 0;
        if(minDistance === distanceX) {
            left = 1;
            right = 2;
        } else if(minDistance === distanceY) {
            left = 0;
            right = 2;
        } else if(minDistance === distanceZ) {
            left = 0;
            right = 1;
        }

        const vertices: number[] = [];
        circle[0].forEach((pointIndex: number) => {
            const point = allPoints[pointIndex];
            const pointArr = [point.x, point.y, point.z];
            vertices.push(pointArr[left], pointArr[right]);
        });
        const ec = earcut(vertices);
        for(let i = 0; i < ec.length; i += 3) {
            triangleFace.push([circle[0][ec[i]], circle[0][ec[i + 1]], circle[0][ec[i + 2]]]);
        }
    });

    return [allPoints, allLines, triangleFace];
}

export {solve};
export type {utilPointConfig, utilLineConfig};
