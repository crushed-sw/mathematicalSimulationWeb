import { reactive } from "vue"
import { defineStore } from "pinia";

const useMolStore = defineStore("molStore", () => {
    const config = reactive({
        convert: false,
        picture: false,
        smiles: "",
    });

    return { config };
});

export { useMolStore };
