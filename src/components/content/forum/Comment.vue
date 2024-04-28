<template>
    <div>
        <Dialog v-model:visible="deleteVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <template #header>
                <div class="flex align-items-center justify-content-center">
                    <span class="font-bold white-space-nowrap">是否删除该评论</span>
                </div>
            </template>
            <template #footer>
                <Button label="取消" outlined severity="secondary" @click="deleteToCancel" autofocus />
                <Button label="确定" outlined severity="secondary" @click="deleteToConfirm" />
            </template>
        </Dialog>

        <v-md-editor
            right-toolbar="customToolbar"
            :toolbar="toolbar"
            v-model="text"
            :height="`300px`"
        ></v-md-editor>
        <Divider></Divider>

        <Panel v-for="item in commentContent" class="m-3">
            <template #header>
                <div class="flex align-items-center gap-2">
                    <Avatar :image="item.avatar" size="normal" shape="circle" @click="intoUser(item.userid)" />
                    <span>{{item.username}}</span>
                </div>
            </template>
            <template #icons>
                <i
                    v-if="item.userid.toString() === store.config.userid"
                    class="pi pi-trash"
                    @click="deleteComment"
                ></i>
            </template>
            <p class="m-0">{{item.content}}</p>
            <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                <i></i>
                <span class="p-text-secondary">{{item.time}}</span>
            </div>
        </Panel>

        <Paginator v-model:first="page" :rows="1" :totalRecords="totalPage" template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput"></Paginator>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import Paginator from 'primevue/paginator';
import Avatar from 'primevue/avatar';
import Panel from 'primevue/panel';
import Divider from 'primevue/divider';
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import axios from "axios";
import { useRouter } from "vue-router"
import { useGlobalStore } from "@/stores/globalStore"
import { useToast } from 'primevue/usetoast';

const totalPage = ref(0);
const page = ref(0);
const commentContent = ref([]);
const deleteVisible = ref(false);

const router = useRouter();
const store = useGlobalStore();
const toast = useToast();

const props = defineProps({
    articleid: {
        type: String,
        required: true,
    },
});

function getNowDate(): string {
    const date = new Date();
    let month: string | number = date.getMonth() + 1;
    let strDate: string | number = date.getDate();

    if (month <= 9) {
        month = "0" + month;
    }

    if (strDate <= 9) {
        strDate = "0" + strDate;
    }

    return date.getFullYear() + "-" + month + "-" + strDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

const text = ref("");
const toolbar = {
    customToolbar: {
        icon: 'v-md-icon-tip',
        title: '发布文章',
        action() {
            if(store.config.login) {
                axios.post('/api/insert_comment', {
                    userid: store.config.userid.toString(),
                    articleid: props.articleid,
                    content: text.value,
                    time: getNowDate(),
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
                            getComment();
                        }
                    });
            } else {
                toast.add({ severity: 'info', summary: '信息', detail: "请先登录", life: 2000 });
            }
        },
    },
};

function intoUser(userid: string) {
    router.push({ path: `/user/${userid}` });
}

function getComment() {
    commentContent.value = [];
    axios.get(`/api/get_num_comment?articleid=${props.articleid}&page=-1`)
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

    axios.get(`/api/get_comment?articleid=${props.articleid}&page=${page.value}`)
        .then(function (response: any) {
            if(response.data.success) {
                const data = JSON.parse(response.data.data);
                commentContent.value = data;
            } else {
                if(response.data.code === 20041) {
                    store.clearConfig();
                    router.push("/forum/forum");
                }
            }
        });
}

function deleteToCancel() {
    deleteVisible.value = false;
}

function deleteToConfirm() {
    if(store.config.login) {
        axios.post('/api/delete_comment', {
            userid: store.config.userid.toString(),
            articleid: props.articleid,
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
                    getComment();
                    deleteToCancel();
                }
            });
    } else {
        toast.add({ severity: 'info', summary: '信息', detail: "请先登录", life: 2000 });
    }
}

function deleteComment() {
    deleteVisible.value = true;
}

watch([() => page, () => props.articleid], () => {
    getComment();
}, {deep: true});

onMounted(() => {
    getComment();
});
</script>

<style lang="scss" scoped>
</style>
