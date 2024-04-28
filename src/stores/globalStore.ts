import { reactive } from "vue"
import { defineStore } from "pinia";

const useGlobalStore = defineStore("globalStore", () => {
    const config = reactive({
        login: false,
        userid: "",
        username: "",
        email: "",
        avatar: "",
        token: "",
    });

    const user = reactive({
        index: 0,
        ownPage: 0,
        favoritePage: 0,
        ownPageRequest: false,
        favoritePageRequest: false,
        ownPageContent: [],
        favoritePageContent: [],
    });

    const article = reactive({
        content: "",
        title: "",
        username: "",
        avatar: "",
        time: "",
        id: -1,
    });

    function clearConfig() {
        config.login = false;
        config.userid = "";
        config.username = "";
        config.email = "";
        config.avatar = "";
        config.token = "";
    }

    return {
        config,
        user,
        article,
        clearConfig
    };
});

export { useGlobalStore };
