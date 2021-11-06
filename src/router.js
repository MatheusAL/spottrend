import Vue from "vue";
import Router from  "vue-router";
import HomePage from "../src/views/HomePage";
import App from "../src/views/App";
import Callback from "../src/views/Callback";


Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage
        },
        {
            path: "/app",
            name: "app",
            component: App
        },
        {
            path: "/callback",
            name: "callback",
            component: Callback
        },
    ]
});