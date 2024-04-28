<template>
    <div>
        <Toast position="top-center" />
        <div class="px-5 h-full relative top-elem">
            <div class="flex justify-content-center align-items-center">
                <div class="mr-3">{{store.config.username}}</div>
                <Avatar
                    v-if="store.config.avatar != ''"
                    :image="store.config.avatar"
                    @click="menuToggle"
                    size="normal"
                    shape="circle"
                ></Avatar>
                <Avatar
                    v-if="store.config.avatar === ''"
                    @click="menuToggle"
                    size="normal"
                    shape="circle"
                >
                    <template #icon>
                        <font-awesome-icon :icon="['far', 'user']" />
                    </template>
                </Avatar>
            </div>

            <div
                class="absolute w-screen h-screen right-0 top-0 top-conver"
                v-if="isHidden"
                @click="isHidden = false"
            ></div>
            <div class="top-elem w-auto h-auto absolute right-0">
                <Menu :model="items" v-if="isHidden" class="mr-5 mt-2"></Menu>
            </div>

            <Dialog v-model:visible="loginVisible" modal header="Edit Profile" :style="{ width: '30rem' }">
                <template #header>
                    <div class="flex align-items-center justify-content-center">
                        <span class="font-bold white-space-nowrap">登陆</span>
                    </div>
                </template>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <InputText class="w-full" id="username" v-model="loginEmail" />
                        <label for="username">邮箱</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <Password class="w-full" id="password" v-model="loginPassword" :feedback="false" toggleMask />
                        <label for="password">密码</label>
                    </FloatLabel>
                </div>
                <template #footer>
                    <Button label="取消" outlined severity="secondary" @click="loginToCancel" autofocus />
                    <Button label="忘记密码" outlined severity="secondary" @click="loginToResetPassword" />
                    <Button label="去注册" outlined severity="secondary" @click="loginToRegister" />
                    <Button label="登陆" outlined severity="secondary" @click="loginToLogin" />
                </template>
            </Dialog>

            <Dialog v-model:visible="registerVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
                <template #header>
                    <div class="flex align-items-center justify-content-center">
                        <span class="font-bold white-space-nowrap">注册</span>
                    </div>
                </template>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <InputText class="w-full" id="email" v-model="registerEmail" />
                        <label for="email">邮箱</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <InputText class="w-full" id="username" v-model="registerUsername" />
                        <label for="username">昵称</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <Password class="w-full" id="password" v-model="registerPassword" toggleMask :feedback="false"/>
                        <label for="password">密码</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <Password class="w-full" id="password" v-model="registerConfirmPassword" toggleMask :feedback="false"/>
                        <label for="password">确认密码</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center justify-content-between pt-4">
                    <InputOtp v-model="numValue" />
                    <Button
                        :label="timeTrue ? '发送验证码' : `${time}s 后重新发送`"
                        outlined
                        severity="secondary"
                        @click="sendCode(registerEmail)"
                        :disabled="!timeTrue"
                    />
                </div>
                <template #footer>
                    <Button label="取消" outlined severity="secondary" @click="registerToCancel" autofocus />
                    <Button label="去登陆" outlined severity="secondary" @click="registerToLogin" />
                    <Button label="注册" outlined severity="secondary" @click="registerToRegister" />
                </template>
            </Dialog>

            <Dialog v-model:visible="resetPasswordVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
                <template #header>
                    <div class="flex align-items-center justify-content-center">
                        <span class="font-bold white-space-nowrap">重置密码</span>
                    </div>
                </template>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <InputText class="w-full" id="email" v-model="resetPasswordEmail" />
                        <label for="email">邮箱</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <Password class="w-full" id="password" v-model="resetPasswordPassword" toggleMask :feedback="false"/>
                        <label for="password">新密码</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center pt-4">
                    <FloatLabel class="w-full">
                        <Password class="w-full" id="password" v-model="resetPasswordConfirmPassword" toggleMask :feedback="false"/>
                        <label for="password">确认密码</label>
                    </FloatLabel>
                </div>
                <div class="flex align-items-center justify-content-between pt-4">
                    <InputOtp v-model="resetPasswordCode" />
                    <Button
                        :label="timeTrue ? '发送验证码' : `${time}s 后重新发送`"
                        outlined
                        severity="secondary"
                        @click="sendCode(resetPasswordEmail)"
                        :disabled="!timeTrue"
                    />
                </div>
                <template #footer>
                    <Button label="取消" outlined severity="secondary" @click="resetPasswordToCancel" autofocus />
                    <Button label="确定" outlined severity="secondary" @click="resetPasswordToConfirm" />
                </template>
            </Dialog>

            <Dialog v-model:visible="logoutVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
                <template #header>
                    <div class="flex align-items-center justify-content-center">
                        <span class="font-bold white-space-nowrap">是否登出</span>
                    </div>
                </template>
                <template #footer>
                    <Button label="取消" outlined severity="secondary" @click="logoutToCancel" autofocus />
                    <Button label="登出" outlined severity="secondary" @click="logoutToConfirm" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';
import InputOtp from 'primevue/inputotp';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useGlobalStore } from "@/stores/globalStore"
import { useRouter } from "vue-router"

const toast = useToast();

let isHidden = ref(false);
let loginVisible = ref(false);
let registerVisible = ref(false);
let logoutVisible = ref(false);
let resetPasswordVisible = ref(false);

let loginEmail = ref("");
let loginPassword = ref("");

let registerEmail = ref("");
let registerUsername = ref("");
let registerPassword = ref("");
let registerConfirmPassword = ref("");

let resetPasswordEmail = ref("");
let resetPasswordPassword = ref("");
let resetPasswordConfirmPassword = ref("");
let resetPasswordCode = ref();

let numValue = ref();
let timeTrue = ref(true);
let time = ref(0);

const store = useGlobalStore();

function menuToggle() {
    isHidden.value = !isHidden.value;
}

const router = useRouter();
const items = reactive([
    {
        label: '登陆',
        icon: 'pi pi-sign-in',
        command: () => {
            if(store.config.login) {
                toast.add({ severity: 'warn', summary: '警告', detail: "请先登出", life: 2000 });
            } else {
                loginVisible.value = true;
                isHidden.value = false;
            }
        },
    },
    {
        label: '个人信息',
        login: false,
        icon: 'pi pi-align-justify',
        command: () => {
            if(!store.config.login) {
                toast.add({ severity: 'warn', summary: '警告', detail: "请先登陆", life: 2000 });
            } else {
                router.push("/forum/user");
            }
            isHidden.value = false;
        },
    },
    {
        label: '登出',
        icon: 'pi pi-sign-out',
        command: () => {
            if(!store.config.login) {
                toast.add({ severity: 'warn', summary: '警告', detail: "请先登陆", life: 2000 });
            } else {
                logoutVisible.value = true;
                isHidden.value = false;
            }
        },
    },
]);

function loginToCancel() {
    loginVisible.value = false;
}

function loginToResetPassword() {
    loginToCancel();
    resetPasswordVisible.value = true;
}

function loginToRegister() {
    loginVisible.value = false;
    registerVisible.value = true;
}

function loginToLogin() {
    axios.get(`/api/login?email=${loginEmail.value}&password=${loginPassword.value}&time=${Date.parse(new Date().toString())}`)
    .then(function (response: any) {
        if(response.data.success) {
            toast.add({ severity: 'success', summary: '成功', detail: response.data.message, life: 2000 });
            const data = JSON.parse(response.data.data);
            store.config.login = true;
            store.config.email = data.email;
            store.config.userid = data.userid;
            store.config.username = data.username;
            store.config.token = data.token;
            localStorage.setItem('mathmatic-crushed-login', response.data.data);

            if(data.avatar === null) {
                store.config.avatar = "";
            } else {
                store.config.avatar = data.avatar;
            }
            loginToCancel();
        } else {
            toast.add({ severity: 'error', summary: '错误', detail: response.data.message, life: 2000 });
        }
    })
    .catch(function () {
        toast.add({ severity: 'error', summary: '错误', detail: '请求发送失败', life: 2000 });
    });
}

function registerToCancel() {
    registerVisible.value = false;
}

function registerToRegister() {
    if(registerEmail.value.trim() === "" || registerUsername.value.trim() === "" ||
       registerPassword.value.trim() === "" || registerConfirmPassword.value.trim() === "" ||
       numValue.value.trim() === "") {
        toast.add({ severity: 'error', summary: '错误', detail: '信息不能为空', life: 2000 });
        return;
    }

    if(registerPassword.value !== registerConfirmPassword.value) {
        toast.add({ severity: 'error', summary: '错误', detail: '两次输入密码不同', life: 2000 });
        return;
    }

    axios.post('/api/register', {
        username: registerUsername.value,
        email: registerEmail.value,
        password: registerPassword.value,
        code: numValue.value,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        if(response.data.success) {
            toast.add({ severity: 'info', summary: '信息', detail: response.data.message, life: 2000 });
            loginEmail.value = registerEmail.value;
            registerToLogin();
        } else {
            toast.add({ severity: 'error', summary: '错误', detail: response.data.message, life: 2000 });
        }
    })
    .catch(function () {
        toast.add({ severity: 'error', summary: '错误', detail: '请求发送失败', life: 2000 });
    });
}

function registerToLogin() {
    registerVisible.value = false;
    loginVisible.value = true;
}

function acquire() {
    timeTrue.value = false;
    time.value = 60;
    var setTimeoutS = setInterval(() => {
        time.value--;
        if (time.value <= 0) {
            clearInterval(setTimeoutS);
            timeTrue.value = true;
        }
    }, 1000);
}

function sendCode(email: string) {
    if(email === "") {
        toast.add({ severity: 'warn', summary: '警告', detail: '邮箱不能为空', life: 2000 });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        toast.add({ severity: 'warn', summary: '警告', detail: '邮箱格式错误', life: 2000 });
        return;
    }

    acquire();
    axios.get(`/api/send_code?email=${email}`)
    .then(function (response: any) {
        if(response.data.success) {
            toast.add({ severity: 'info', summary: '信息', detail: response.data.message, life: 2000 });
        } else {
            toast.add({ severity: 'error', summary: '错误', detail: response.data.message, life: 2000 });
        }
    })
    .catch(function () {
        toast.add({ severity: 'error', summary: '错误', detail: '请求发送失败', life: 2000 });
    });
}

function logoutToCancel() {
    logoutVisible.value = false;
}

function logoutToConfirm() {
    deleteInform();
    toast.add({ severity: 'success', summary: '成功', detail: "登出成功", life: 2000 });
}

function deleteInform() {
    logoutVisible.value = false;
    store.config.login = false;
    store.config.email = "";
    store.config.userid = "";
    store.config.username = "";
    store.config.avatar = "";
    localStorage.removeItem('mathmatic-crushed-login');
}

onMounted(() => {
    const data = JSON.parse(localStorage.getItem('mathmatic-crushed-login'));

    if(data) {
        axios.get(`/api/check?userid=${data.userid}&username=${data.username}&email=${data.email}&token=${data.token}`)
        .then(function (response) {
            if(response.data.success) {
                store.config.login = true;
                store.config.email = data.email;
                store.config.userid = data.userid;
                store.config.username = data.username;
                if(data.avatar === null) {
                    store.config.avatar = "";
                } else {
                    store.config.avatar = data.avatar;
                }
            } else {
                deleteInform();
            }
        })
        .catch(function () {
            deleteInform();
        });
    }
});

function resetPasswordToCancel() {
    resetPasswordVisible.value = false;
}

function resetPasswordToConfirm() {
    if(resetPasswordEmail.value.trim() === "" || resetPasswordPassword.value.trim() === "" ||
       resetPasswordConfirmPassword.value.trim() === "" || resetPasswordCode.value.trim() === "")
    {
        toast.add({ severity: 'error', summary: '错误', detail: '信息不能为空', life: 2000 });
        return;
    }

    if(resetPasswordPassword.value !== resetPasswordConfirmPassword.value) {
        toast.add({ severity: 'error', summary: '错误', detail: '两次输入密码不同', life: 2000 });
        return;
    }

    axios.post('/api/reset_password', {
        email: resetPasswordEmail.value,
        password: resetPasswordPassword.value,
        code: resetPasswordCode.value,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        if(response.data.success) {
            toast.add({ severity: 'info', summary: '信息', detail: response.data.message, life: 2000 });
            resetPasswordToCancel();
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
.top-elem {
    z-index: 101;
}

.top-conver {
    z-index: 100;
}
</style>
