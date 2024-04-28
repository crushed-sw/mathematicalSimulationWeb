<template>
    <div>
        <Dialog v-model:visible="deleteVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <template #header>
                <div class="flex align-items-center justify-content-center">
                    <span class="font-bold white-space-nowrap">是否删除文章</span>
                </div>
            </template>
            <template #footer>
                <Button label="取消" outlined severity="secondary" @click="deleteCancel" autofocus />
                <Button label="确定" outlined severity="secondary" @click="deleteConfirm" />
            </template>
        </Dialog>

        <Fieldset v-for="item in store.user.ownPageContent" class="w-full prevent-select mb-3" :legend="item.title" @click="intoArticle(item.id)">
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
                    <i class="pi pi-trash mr-5" @click.stop="deleteArticle(item.id)"></i>
                </div>
            </div>
        </Fieldset>
        <Paginator v-model:first="store.user.ownPage" :rows="1" :totalRecords="totalPage" template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput"></Paginator>
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

function getOwnArticle(is: boolean = false) {
    if(is || store.user.ownPageRequest) {
        axios.get(`/api/get_num_own_article?userid=${store.config.userid}&email=${store.config.email}&token=${store.config.token}&page=-1`)
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

        axios.get(`/api/get_own_article?userid=${store.config.userid}&email=${store.config.email}&token=${store.config.token}&page=${store.user.ownPage}`)
            .then(function (response: any) {
                if(response.data.success) {
                    const data = JSON.parse(response.data.data);
                    store.user.ownPageContent = data.records;
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

function deleteArticle(id: number) {
    deleteVisible.value = true;
    requestId.value = id.toString();
}

function deleteCancel() {
    deleteVisible.value = false;
}

function deleteConfirm() {
    axios.get(`/api/delete_article?email=${store.config.email}&token=${store.config.token}&id=${requestId.value}`)
        .then(function (response: any) {
            console.log(response);
            if(response.data.success) {
                getOwnArticle(true);
            } else {
                if(response.data.code === 20041) {
                    store.clearConfig();
                    router.push("/forum/forum");
                }
            }
        });
    deleteCancel();
}

watch(() => store.user.ownPage, () => {
    getOwnArticle(true);
});

watch(() => store.user.index, () => {
    if(store.user.index == 0) {
        getOwnArticle();
    }
});

onMounted(() => {
    getOwnArticle(true);
});
</script>

<style lang="scss" scoped>
.prevent-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
