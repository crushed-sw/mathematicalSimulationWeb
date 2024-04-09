<template>
    <div class="w-full h-full flex-column">
        <div class="w-full h-2rem top-0 left-0 m-1 p-2 top-tools shadow-1 flex align-items-center">
            <i class="w-1rem h-full ml-3 border-400 border-left-1"></i>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" @click="click('convert')">
                <path d="M8.365 12.51c-.604 0-1.142-.104-1.614-.312-.469-.21-.84-.498-1.112-.865a2.176 2.176 0 01-.417-1.278h1.764a.92.92 0 00.198.534c.124.15.289.268.494.352.204.083.435.125.691.125.267 0 .503-.047.708-.142.205-.094.365-.225.481-.392a.99.99 0 00.174-.578.969.969 0 00-.186-.587 1.19 1.19 0 00-.526-.404 2.045 2.045 0 00-.809-.146H7.44V7.531h.772c.265 0 .498-.046.7-.138.205-.091.364-.218.477-.38a.988.988 0 00.17-.574.993.993 0 00-.562-.918 1.341 1.341 0 00-.615-.134c-.237 0-.454.043-.65.13a1.138 1.138 0 00-.474.36.947.947 0 00-.19.55H5.388c.008-.477.144-.898.409-1.262.264-.364.62-.649 1.068-.854A3.6 3.6 0 018.389 4c.572 0 1.072.104 1.501.311.429.208.762.488.999.842.24.35.359.744.356 1.18.003.465-.142.851-.433 1.162-.288.31-.664.507-1.128.59v.065c.61.078 1.073.29 1.391.635.32.342.48.771.477 1.286.003.472-.133.891-.408 1.258-.273.367-.649.655-1.129.865-.48.21-1.03.316-1.65.316zM15.34 12.397h-2.936V4.113h2.96c.834 0 1.551.166 2.153.498a3.356 3.356 0 011.387 1.42c.326.617.49 1.356.49 2.216 0 .863-.164 1.604-.49 2.225a3.363 3.363 0 01-1.395 1.427c-.605.332-1.327.498-2.168.498zm-1.184-1.5h1.112c.518 0 .953-.092 1.306-.276a1.77 1.77 0 00.801-.861c.18-.391.271-.896.271-1.513 0-.612-.09-1.112-.271-1.5a1.754 1.754 0 00-.797-.858c-.353-.184-.788-.275-1.306-.275h-1.117v5.282zM20.222 10v1.5c1.5 0 4 5.7-6 6.5v1.5c12.5-1 9-9.5 6-9.5zM8.107 16.33l-.385 1.391c-7.5-1.221-5.5-5.721-4-6.221V10c-2 0-6.5 7 3.755 8.951l-.199 1.207a.2.2 0 00.268.22l3.363-1.269a.2.2 0 00.071-.328l-2.538-2.538a.2.2 0 00-.335.088z" fill="black"/>
            </svg>
            <i class="pi pi-images text-base ml-3" @click="click('picture')"></i>
        </div>

        <div class="flex-1 h-full">
            <div class="relative w-full h-full" ref="container"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as threeMol from '3dmol/build/3Dmol.js';
import axios from "axios";
import { ref, onMounted, watch } from "vue"
import { useMolStore } from "@/stores/molStore.ts"

// const props = defineProps({
//     width: {
//         type: Number,
//         required: true,
//     },
//     height: {
//         type: Number,
//         required: true,
//     },
// });

let store = useMolStore();

const container = ref();
let viewer: threeMol.GLViewer | undefined = undefined;

function render(smiles: string) {
    if(viewer) {
        axios.get(`http://127.0.0.1:8080/molecule?value=${smiles}`)
        .then(function (response: any) {
            viewer.removeAllModels();
            viewer.addModel(response.data, "sdf");
            viewer.setStyle({},{sphere:{scale: 0.25}, stick:{radius: 0.1}});
            viewer.zoomTo();
        })
        .finally(function () {
            viewer.render();
        });
    }
}

onMounted(() => {
    viewer = threeMol.createViewer(container.value);
});

function click(button: string) {
    if(button === "convert") {
        convert();
    } else if(button === "picture") {
        picture();
    }
}

function convert() {
    store.config.convert = !store.config.convert;
}

function picture() {
    store.config.picture = !store.config.picture;
    let imageURI = viewer.pngURI();
    let link = document.createElement('a');
    link.href = imageURI;
    link.download = "3d_image.png";
    link.click();
}

watch(() => store.config.smiles, () => {
    render(store.config.smiles);
});
</script>

<style lang="scss" scoped>
.top-tools {
    z-index: 100;
    :hover {
        color: #3498db;
        cursor: pointer;
    }
}
</style>
