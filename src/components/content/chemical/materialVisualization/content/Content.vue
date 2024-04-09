<template>
    <div class="h-full w-full">
        <iframe
            class="frame"
            ref="ketch"
            src="/standalone/index.html?hiddenControls=open,clear,save,undo,redo,cut,copies,copy,copy-image,copy-mol,copy-ket,paste,settings,about,zoom,zoom-out,zoom-in,zoom-list,fullscreen,help,miew,analyse,check,cip,extended-table,any-atom,template-lib,functional-groups,text,shapes,rgroup,arrows,sgroup,reaction-mapping-tools,reaction-plus,enhanced-stereo"
            :width="width"
            :height="height - 6"
        ></iframe>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from "vue"
import { useMolStore } from "@/stores/molStore.ts"

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

let store = useMolStore();

const ketch = ref();

watch(() => store.config.convert, () => {
    let ketcher = ketch.value.contentWindow.ketcher;
    if(ketcher) {
        ketcher.getSmiles().then((value: any) => {
            store.config.smiles = value;
        });
    }
});

watch(() => store.config.picture, () => {
    let ketcher = ketch.value.contentWindow.ketcher;
    if(ketcher) {
        ketcher.getKet().then((value: any) => {
            ketcher.generateImage(value).then((blob: any) => {
                let url = URL.createObjectURL(blob);
                let link = document.createElement('a');
                link.href = url;
                link.download = "2d_image.png";
                link.click();
            });
        });
    }
});
</script>

<style lang="scss" scoped>
iframe {
    border: none;
}
</style>
