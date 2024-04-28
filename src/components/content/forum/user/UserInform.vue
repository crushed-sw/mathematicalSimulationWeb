<template>
    <div class="h-full m-3">
        <Fieldset class="w-full" legend="个人信息">
            <div class="flex justify-content-between">
                <div class="flex">
                    <Avatar :image="store.config.avatar" size="large" shape="circle" />
                    <div class="flex flex-column ml-3">
                        <div><span>昵称</span>：<span>{{store.config.username}}</span></div>
                        <div><span>邮箱</span>：<span>{{store.config.email}}</span></div>
                    </div>
                </div>
                <div class="flex flex-column justify-content-around gap-2">
                    <Button label="更改头像" outlined severity="secondary" @click="changeAvatar" />
                    <Button label="更改昵称" outlined severity="secondary" @click="changeName" />
                </div>
            </div>
        </Fieldset>

        <Dialog v-model:visible="usernameVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <template #header>
                <div class="flex align-items-center justify-content-center">
                    <span class="font-bold white-space-nowrap">更改昵称</span>
                </div>
            </template>
            <div class="flex align-items-center pt-4">
                <FloatLabel class="w-full">
                    <InputText class="w-full" id="username" v-model="newUsername" />
                    <label for="username">新昵称</label>
                </FloatLabel>
            </div>
            <template #footer>
                <Button label="取消" outlined severity="secondary" @click="usernameToCancel" autofocus />
                <Button label="确定" outlined severity="secondary" @click="usernmaeToConfirm" />
            </template>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import Avatar from 'primevue/avatar';
import Fieldset from 'primevue/fieldset';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import { useToast } from 'primevue/usetoast';
import { ref } from "vue"
import { useGlobalStore } from "@/stores/globalStore"
import axios from "axios";

const toast = useToast();
const store = useGlobalStore();
const newUsername = ref("");
const usernameVisible = ref(false);

function changeAvatar() {

}

function changeName() {
    newUsername.value = "";
    usernameVisible.value = true;
}

function usernameToCancel() {
    usernameVisible.value = false;
}

function usernmaeToConfirm() {
    axios.get(`api/change_username?userid=${store.config.userid}&username=${newUsername.value}&email=${store.config.email}&token=${store.config.token}`)
    .then(function (response: any) {
        if(response.data.success) {
            const username = response.data.data as string;
            store.config.username = username.split('"')[1];
            toast.add({ severity: 'success', summary: "成功", detail: response.data.message, life: 2000 });
            const user = {
                login: store.config.login,
                email: store.config.email,
                userid: store.config.userid,
                username: store.config.username,
                avatar: store.config.avatar,
            };
            localStorage.setItem('mathmatic-crushed-login', JSON.stringify(user));
        } else {
            toast.add({ severity: 'error', summary: "失败", detail: response.data.message, life: 2000 });
            if(response.data.code === 20041) {
                store.clearConfig();
                localStorage.removeItem('mathmatic-crushed-login');
            }
        }
    });
    usernameToCancel();
}
</script>

<style lang="scss" scoped>
.p-button {
    margin: 0px;
    padding: 2px;
}
</style>
