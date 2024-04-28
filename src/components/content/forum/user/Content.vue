<template>
    <div class="">
        <Dialog v-model:visible="titleVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <template #header>
                <div class="flex align-items-center justify-content-center">
                    <span class="font-bold white-space-nowrap">标题(最多50字符)</span>
                </div>
            </template>
            <div class="flex align-items-center pt-4">
                <FloatLabel class="w-full">
                    <InputText class="w-full" id="title" v-model="title" />
                    <label for="title">标题</label>
                </FloatLabel>
            </div>
            <template #footer>
                <Button label="取消" outlined severity="secondary" @click="titleToCancel" autofocus />
                <Button label="确定" outlined severity="secondary" @click="titleToConfirm" />
            </template>
        </Dialog>

        <TabView :scrollable="true" v-model:activeIndex="store.user.index">
            <TabPanel header="我的文章">
                <OwnArticle></OwnArticle>
            </TabPanel>
            <TabPanel header="收藏">
                <FavoriteArticle></FavoriteArticle>
            </TabPanel>
            <TabPanel header="写文章">
                <div class="flex flex-column">
                    <div class="flex mb-3 gap-3">
                        <Button label="保存草稿" outlined severity="secondary" @click="storeArticle" />
                        <Button label="加载草稿" outlined severity="secondary" @click="uploadArticle" />
                        <Button label="上传文章" outlined severity="secondary" @click="chooseFile" />
                        <Button label="发布文章" outlined severity="secondary" @click="publishArticle" />
                    </div>
                    <v-md-editor v-model="text" :height="`${height - 150}px`"></v-md-editor>
                </div>
            </TabPanel>
        </TabView>
        <input type="file" ref="uploadFile" name="file" hidden="true" @input="getFile" />
    </div>
</template>

<script lang="ts" setup>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import { useGlobalStore } from "@/stores/globalStore"
import { useToast } from 'primevue/usetoast';
import { ref } from "vue";
import axios from "axios";
import OwnArticle from './OwnArticle.vue';
import FavoriteArticle from './FavoriteArticle.vue';

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

const toast = useToast();
const text = ref("");
const uploadFile = ref();
const titleVisible = ref(false);
const title = ref("");

const store = useGlobalStore();

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

function chooseFile() {
    uploadFile.value.click();
}

async function getFile(event: any) {
    const files = event.target.files;
    if(files.length != 0) {
        const fileRes = await waitReader(files[0]);
        text.value = fileRes as string;
    }
}

function waitReader (file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function(evt: any) {
            const fileString = evt.target.result;
            fileString ? resolve(fileString) : reject(evt);
        }
    });
}

function storeArticle() {
    localStorage.setItem('mathmatic-article', text.value);
    toast.add({ severity: 'success', summary: "成功", detail: "草稿保存成功", life: 2000 });
}

function uploadArticle() {
    let article = localStorage.getItem('mathmatic-article');
    if(article === null) {
        toast.add({ severity: 'info', summary: "消息", detail: "您还没有草稿", life: 2000 });
    } else {
        text.value = article;
    }
}

function publishArticle() {
    titleVisible.value = true;
    title.value = "";
}

function titleToCancel() {
    titleVisible.value = false;
}

function titleToConfirm() {
    if(title.value.trim().length === 0) {
        toast.add({ severity: 'warn', summary: "警告", detail: "标题不能为空", life: 2000 });
        return;
    }

    if(title.value.trim().length > 50) {
        toast.add({ severity: 'warn', summary: "警告", detail: "标题字数大于50", life: 2000 });
        return;
    }

    axios.post('/api/publish_article', {
        title: title.value,
        content: text.value,
        time: getNowDate(),
        author: store.config.userid,
        email: store.config.email,
        token: store.config.token,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        if(response.data.success) {
            store.user.ownPageRequest = true;
            store.user.index = 0;
            toast.add({ severity: 'info', summary: '信息', detail: response.data.message, life: 2000 });
            titleToCancel();
        } else {
            toast.add({ severity: 'error', summary: '错误', detail: response.data.message, life: 2000 });
        }
    })
    .catch(function () {
        toast.add({ severity: 'error', summary: '错误', detail: '请求发送失败', life: 2000 });
    });

}
</script>

<style lang="scss" scoped>
.p-button {
    margin: 0px;
    padding: 2px;
}
</style>
