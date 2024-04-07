import { solve } from "@/util/threeViewUtil.ts"

self.onmessage = function(event: any) {
    if(event.data.length >= 9) {
        const data: any[] = JSON.parse(event.data);
        const result = solve(
            data[0], data[1], data[2],
            data[3], data[4], data[5],
            data[6], data[7], data[8],
        )
        postMessage(JSON.stringify(result));
    } else {
        postMessage(JSON.stringify([]));
    }
};

