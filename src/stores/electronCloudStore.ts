import { reactive } from "vue"
import { defineStore } from "pinia";

const useElectronCloudStore = defineStore("electronCloudStore", () => {
    const config = reactive({
        surface: "",
        points: "",
        index: 0,
        n: 0,
        l: 0,
        m: 0,
    });

    return { config };
});

export { useElectronCloudStore };
