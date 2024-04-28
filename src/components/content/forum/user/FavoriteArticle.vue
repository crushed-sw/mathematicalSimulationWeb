<template>
    <div>
        <Fieldset v-for="item in store.user.favoritePageContent" class="w-full prevent-select mb-3" :legend="item.title" @click="intoArticle(item.id)">
            <template #legend>
                <div class="flex align-items-center px-2">
                    <span class="font-bold">{{item.title}}</span>
                </div>
            </template>
            <div class="flex flex-column">
                <p class="m-0">
                    {{item.content}}
                </p>
                <div class="flex justify-content-between align-items-end">
                    <p class="text-400 text-sm">{{item.time}}</p>
                </div>
            </div>
        </Fieldset>
        <Paginator v-model:first="store.user.favoritePage" :rows="1" :totalRecords="totalPage" template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput"></Paginator>
    </div>
</template>

<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import Fieldset from 'primevue/fieldset';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useGlobalStore } from "@/stores/globalStore"
import { useRouter } from "vue-router"

const router = useRouter();
const store = useGlobalStore();
const totalPage = ref(0);
const deleteVisible = ref(false);
const requestId = ref("");

function getFavoriteArticle(is: boolean = false) {
    if(is || store.user.favoritePageRequest) {
        store.user.favoritePageContent = [];
        axios.get(`/api/get_num_favorite?userid=${store.config.userid}&email=${store.config.email}&token=${store.config.token}&page=-1`)
            .then(function (response: any) {
                if(response.data.success) {
                    totalPage.value = Math.ceil(Number(response.data.data) / 10);
                } else {
                    if(response.data.code === 20041) {
                        store.clearConfig();
                        router.push("/forum/forum");
                    }
                }
            });

        axios.get(`/api/get_favorite?userid=${store.config.userid}&email=${store.config.email}&token=${store.config.token}&page=${store.user.favoritePage}`)
            .then(function (response: any) {
                if(response.data.success) {
                    const data = JSON.parse(response.data.data);
                    store.user.favoritePageContent = data;
                } else {
                    if(response.data.code === 20041) {
                        store.clearConfig();
                        router.push("/forum/forum");
                    }
                }
            });
    }
}

function intoArticle(id: number) {
    router.push({ path: `/article/${id}` })
}

watch(() => store.user.favoritePage, () => {
    getFavoriteArticle(true);
});

watch(() => store.user.index, () => {
    if(store.user.index == 1) {
        getFavoriteArticle();
    }
});

onMounted(() => {
    getFavoriteArticle(true);
});
</script>

<style lang="scss" scoped>
</style>
