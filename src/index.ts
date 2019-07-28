import Vue from "vue"
import store from "@/store"
import App from "./App.vue"

Vue.directive('focus', {
    inserted(el) {
        el.focus()
    }
})

new Vue({
    store,
    el: '#main',
    template: `<App/>`,
    components: { App },
})