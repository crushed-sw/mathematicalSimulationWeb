<template>
    <div class="w-full h-full overflow-y-scroll surface-50 flex justify-content-center">
        <div :style="{width: '75%'}" class="bg-white">
            <Fieldset class="m-4" legend="个人信息">
                <div class="flex align-items-center">
                    <Avatar :image="avatar" size="large" shape="circle" />
                    <div class="flex flex-column ml-3">
                        <div><span>昵称</span>：<span>{{username}}</span></div>
                    </div>
                </div>
            </Fieldset>
            <Divider></Divider>

            <Fieldset v-for="item in pageContent" class="prevent-select mx-4 mb-3" :legend="item.title" @click="intoArticle(item.id)">
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
            <Paginator v-model:first="currentPage" :rows="1" :totalRecords="totalPage" template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput"></Paginator>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Avatar from 'primevue/avatar';
import Fieldset from 'primevue/fieldset';
import Paginator from 'primevue/paginator';
import Divider from 'primevue/divider';
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios";

const route = useRoute();
const router = useRouter();

const userid = ref(-1);
const username = ref("");
const avatar = ref("");
const totalPage = ref(0);
const currentPage = ref(0);
const pageContent = ref([]);

function intoArticle(id: number) {
    router.push({ path: `/article/${id}` })
}

function getOwnArticle() {
    axios.get(`/api/get_other_article?userid=${userid.value}&page=${currentPage.value}`)
        .then(function (response: any) {
            if(response.data.success) {
                const data = JSON.parse(response.data.data);
                pageContent.value = data.records;
            }
        });
}

watch(() => currentPage, () => {
    getOwnArticle();
});

onMounted(() => {
    userid.value = Number(route.params.userId);
    axios.get(`/api/get_inform?id=${userid.value}`)
        .then(function (response: any) {
            if(response.data.success) {
                const data = JSON.parse(response.data.data);
                username.value = data.username;
                avatar.value = data.avatar;
            }
        });

    axios.get(`/api/get_num_other_article?userid=${userid.value}&page=-1`)
        .then(function (response: any) {
            if(response.data.success) {
                totalPage.value = Math.ceil(Number(response.data.data) / 10);
            }
        });

    getOwnArticle();
});
</script>

<style lang="scss" scoped>

</style>
