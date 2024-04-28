<template>
    <div class="w-full surface-50 flex justify-content-center">
        <div :style="{width: '75%'}" class="bg-white h-full">
            <div class="w-full">
                <div class="w-full flex justify-content-between align-items-end" :style="{'margin-top': '20px'}">
                    <div class="flex ml-6">
                        <Avatar
                            :image="avatar"
                            size="large"
                            shape="circle"
                            class="mr-4"
                             @click="intoUsers(userid)"
                        ></Avatar>
                        <p>{{username}}</p>
                    </div>
                    <div class="text-ms text-400 mr-3">{{time}}</div>
                </div>
                <Divider />
                <h2 class="flex justify-content-center">{{title}}</h2>
            </div>
            <v-md-preview :text="content" class="mb-3"></v-md-preview>
            <div class="flex justify-content-between">
                <i></i>
                <div class="mr-5">
                    <i v-if="!isFavorite" class="pi pi-star" @click="addFavorite"></i>
                    <i v-if="isFavorite" class="pi pi-star-fill" @click="removeFavorite"></i>
                </div>
            </div>
            <Divider></Divider>

            <Comment :articleid="articleId"></Comment>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Avatar from 'primevue/avatar';
import Divider from 'primevue/divider';
import { useToast } from 'primevue/usetoast';
import axios from "axios";
import { useRoute, useRouter } from "vue-router"
import { useGlobalStore } from "@/stores/globalStore"
import Comment from "./Comment.vue";

const store = useGlobalStore();
const route = useRoute();
const router = useRouter();

const toast = useToast();

const content = ref("");
const title = ref("");
const time = ref("");
const id = ref("");
const username = ref("");
const userid = ref("");
const avatar = ref("");

const articleId = ref("");

const isFavorite = ref(false);

function intoUsers(userid: string) {
    router.push({ path: `/user/${userid}` });
}

function addFavorite() {
    if(store.config.login) {
        axios.post('/api/insert_favorite', {
            userid: store.config.userid.toString(),
            articleid: articleId.value,
            email: store.config.email,
            token: store.config.token,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if(response.data.code === 20041) {
                    toast.add({ severity: 'info', summary: '信息', detail: "请先登录或者重新登录", life: 2000 });
                } else if(response.data.code === 200) {
                    isFavorite.value = true;
                    store.user.favoritePageRequest = true;
                }
            });
    } else {
        toast.add({ severity: 'info', summary: '信息', detail: "请先登录", life: 2000 });
    }
}

function removeFavorite() {
    if(store.config.login) {
        axios.post('/api/delete_favorite', {
            userid: store.config.userid.toString(),
            articleid: articleId.value,
            email: store.config.email,
            token: store.config.token,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if(response.data.code === 20041) {
                    toast.add({ severity: 'info', summary: '信息', detail: "请先登录或者重新登录", life: 2000 });
                } else if(response.data.code === 200) {
                    isFavorite.value = false;
                    store.user.favoritePageRequest = true;
                }
            });
    } else {
        toast.add({ severity: 'info', summary: '信息', detail: "请先登录", life: 2000 });
    }
}

onMounted(() => {
    articleId.value = route.params.articleId as string;
    axios.get(`/api/get_article?id=${articleId.value}`)
        .then(function (response: any) {
            if(response.data.success) {
                const data = JSON.parse(response.data.data);
                content.value = data.content;
                title.value = data.title;
                time.value = data.time;
                id.value = data.id;
                username.value = data.username;
                userid.value = data.userid;
                avatar.value = data.avatar;
            }
        });

    if(store.config.login) {
        axios.get(`/api/is_favorite?userid=${store.config.userid}&articleid=${articleId.value}&email=${store.config.email}&token=${store.config.token}`)
            .then(function (response: any) {
                isFavorite.value = response.data.code === 200;
            });
    }
});
</script>

<style lang="scss" scoped>
</style>
