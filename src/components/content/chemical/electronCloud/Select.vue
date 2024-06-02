<template>
    <div :style="{width: `${width}px`, height: `${height}px`}">
        <TabView v-model:activeIndex="activeIndex">
            <TabPanel header="Real">
                <div class="flex flex-column gap-2">
                    <div class="select-item">
                        <select name="nvalue" ref="realNValue" @change="nValueChange">
                            <option
                                v-for="item in nValueOption"
                                :value="item.code"
                            >{{item.name}}</option>
                        </select>
                    </div>
                    <div class="select-item">
                        <select name="lvalue" ref="realLValue" @change="lValueChange">
                            <option
                                v-for="item in lValueOption"
                                :value="item.code"
                                :selected="item.code === 0"
                            >{{item.name}}</option>
                        </select>
                    </div>
                    <div class="select-item">
                        <select name="mvalue" ref="realMValue" @change="mValueChange">
                            <option
                                v-for="item in mValueOption"
                                :value="item.code"
                                :selected="item.code === 0"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Complex">
                <div class="flex flex-column gap-2">
                    <div class="select-item">
                        <select name="nvalue" ref="complexNValue" @change="nValueChange">
                            <option
                                v-for="item in nValueOption"
                                :value="item.code"
                            >{{item.name}}</option>
                        </select>
                    </div>
                    <div class="select-item">
                        <select name="lvalue" ref="complexLValue" @change="lValueChange">
                            <option
                                v-for="item in lValueOption"
                                :value="item.code"
                                :selected="item.code === 0"
                            >{{item.name}}</option>
                        </select>
                    </div>
                    <div class="select-item">
                        <select name="mvalue" ref="complexMValue" @change="mValueChange">
                            <option
                                v-for="item in mValueOption"
                                :value="item.code"
                                :selected="item.code === 0"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Hybird">
                <div class="flex flex-column gap-2">
                    <div class="select-item">
                        <select name="spvalue" @change="spValueChange">
                            <option
                                v-for="item in spValueOption"
                                :value="item.code"
                                :selected="item.code === 0"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

<script lang="ts" setup>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useElectronCloudStore } from "@/stores/electronCloudStore.ts"
import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";

defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});

const store = useElectronCloudStore();
const realNValue = ref();
const realLValue = ref();
const realMValue = ref();
const complexNValue = ref();
const complexLValue = ref();
const complexMValue = ref();
const activeIndex = ref(0);

const nValue = ref();
const nValueOption = ref([
    { name: '1', code: 1 },
    { name: '2', code: 2 },
    { name: '3', code: 3 },
    { name: '4', code: 4 },
    { name: '5', code: 5 },
    { name: '6', code: 6 },
]);

const lValue = ref();
const lOptionArr = ref([
    { name: '0[s]', code: 0 },
    { name: '1[p]', code: 1 },
    { name: '2[d]', code: 2 },
    { name: '3[f]', code: 3 },
    { name: '4[g]', code: 4 },
    { name: '5[h]', code: 5 },
]);
const lValueOption = computed(() => {
    if(nValue.value) {
        return lOptionArr.value.slice(0, nValue.value.code);
    }
    return []
});

const mValue = ref();
const mOptionArr = ref([
    [
        { name: '0', code: 0 },
    ],
    [
        { name: '-1[y]', code: -1 },
        { name: '0[z]', code: 0 },
        { name: '1[x]', code: 1 },
    ],
    [
        { name: '-2[xy]', code: -2 },
        { name: '-1[yz]', code: -1 },
        { name: '0[z²]', code: 0 },
        { name: '1[xz]', code: 1 },
        { name: '2[x²-y²]', code: 2 },
    ],
    [
        { name: '-3[y(3x²−y²)]', code: -3 },
        { name: '-2[xyz]', code: -2 },
        { name: '-1[yz²]', code: -1 },
        { name: '0[z³]', code: 0 },
        { name: '1[xz²]', code: 1 },
        { name: '2[z(x²−y²)]', code: 2 },
        { name: '3[x(x²−3y²)]', code: 3 },
    ],
    [
        { name: '-4[xy(x²−y²)]', code: -4 },
        { name: '-3[y³z]', code: -3 },
        { name: '-2[xyz²]', code: -2 },
        { name: '-1[yz³]', code: -1 },
        { name: '0[z⁴]', code: 0 },
        { name: '1[xz³]', code: 1 },
        { name: '2[z²(x²−y²)]', code: 2 },
        { name: '3[x³z]', code: 3 },
        { name: '4[x⁴+y⁴]', code: 4 },
    ],
    [
        { name: '-5[x⁴y]', code: -5 },
        { name: '-4[z(4x³y−4xy³)]', code: -4 },
        { name: '-3[y³z²]', code: -3 },
        { name: '-2[xyz³]', code: -2 },
        { name: '-1[yz⁴]', code: -1 },
        { name: '0[z⁵]', code: 0 },
        { name: '1[xz⁴]', code: 1 },
        { name: '2[z³(x²−y²)]', code: 2 },
        { name: '3[x³z²]', code: 3 },
        { name: '4[z(x⁴-6x²y²+y⁴)]', code: 4 },
        { name: '5[xy⁴]', code: 5 },
    ],
]);
const mValueOption = computed(() => {
    if(lValue.value) {
        return mOptionArr.value[lValue.value.code]
    }
    return []

});

const spValue = ref();
const spValueOption = ref([
    { name: "sp", code: 1, req: "sp" },
    { name: "sp²", code: 2, req: "sp2" },
    { name: "sp³", code: 3, req: "sp3" },
    { name: "sp³d (axial)", code: 4, req: "sp3da" },
    { name: "sp³d (equatorial)", code: 5, req: "sp3de" },
    { name: "sp³d²", codde: 6, req: "sp3d2" }
]);

function nValueChange(event: any) {
    const index = event.target.selectedIndex;
    nValue.value = nValueOption.value[index];
    lValue.value = lOptionArr.value[0]
    let arr = mOptionArr.value[lValue.value.code];
    mValue.value = arr[Math.floor(arr.length / 2)]
}

function lValueChange(event: any) {
    const index = event.target.selectedIndex;
    lValue.value = lValueOption.value[index];
    let arr = mOptionArr.value[lValue.value.code];
    mValue.value = arr[Math.floor(arr.length / 2)]
}

function mValueChange(event: any) {
    const index = event.target.selectedIndex;
    mValue.value = mValueOption.value[index];
}

function spValueChange(event: any) {
    const index = event.target.selectedIndex;
    spValue.value = spValueOption.value[index];
}

function getObj() {
    let path = "";
    if(activeIndex.value === 0) {
        path = `/api/atom?n=${nValue.value.code}&l=${lValue.value.code}&m=${mValue.value.code}&atom_type=real`
    } else if(activeIndex.value === 1) {
        path = `/api/atom?n=${nValue.value.code}&l=${lValue.value.code}&m=${mValue.value.code}&atom_type=complex`
    } else if(activeIndex.value === 2) {
        path = `/api/orbit?name=${spValue.value.req}`
    }

    axios.get(path)
        .then(function (response) {
            const data = JSON.parse(response.data.data);
            store.config.surface = data.surface;
            store.config.points = data.points;
        })
}

onMounted(() => {
    nValue.value = nValueOption.value[0];
    lValue.value = lOptionArr.value[0];
    mValue.value = mOptionArr.value[0][0];
    spValue.value = spValueOption.value[0];
});

watch([
    () => nValue.value,
    () => lValue.value,
    () => mValue.value,
], () => {
    store.config.n = nValue.value.code;
    store.config.l = lValue.value.code;
    store.config.m = mValue.value.code;

    // realNValue.value.selectedIndex = nValue.value.code;
    // realLValue.value.selectedIndex = lValue.value.code;
    // realMValue.value.selectedIndex = mValue.value.code;

    // complexNValue.value.selectedIndex = nValue.value.code;
    // complexLValue.value.selectedIndex = lValue.value.code;
    // complexMValue.value.selectedIndex = mValue.value.code;

    getObj();
});

watch(() => activeIndex.value, () => {
    store.config.index = activeIndex.value;
    if(activeIndex.value === 0) {
        realNValue.value.selectedIndex = complexNValue.value.selectedIndex;
        realLValue.value.selectedIndex = complexLValue.value.selectedIndex;
        realMValue.value.selectedIndex = complexMValue.value.selectedIndex;
    } else if(activeIndex.value === 1) {
        complexNValue.value.selectedIndex = realNValue.value.selectedIndex;
        complexLValue.value.selectedIndex = realLValue.value.selectedIndex;
        complexMValue.value.selectedIndex = realMValue.value.selectedIndex;
    }
    getObj();
});


watch(() => spValue.value, () => {
    getObj();
});
</script>

<style lang="scss" scoped>
.select-item {
    position: relative;
    display: inline;
    width: 10rem;
    height: 2rem;

    select {
        width: 10rem;
        height: 2rem;
        border: 1px solid #aaa;
        border-radius: 5px;
        background-color: #fff;
        font-family: var(--font-family);
        font-feature-settings: var(--font-feature-settings, normal);
        font-size: 1rem;
        color: #334155;
        padding: 0.5rem 0.75rem;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
    };
}

.select-item:before,
.select-item:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.4rem solid #94a3b8;
    border-right: 0.4rem solid transparent;
    border-left: 0.4rem solid transparent;
    top: 0.8rem;
    right: 0.5rem;
}

.select-item:after {
    top: 0.7rem;
    border-top: 0.4rem solid #fff;
}
</style>

