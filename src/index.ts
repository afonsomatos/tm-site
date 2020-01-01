import Vue from "vue"
import store from "@/store"
import App from "./App.vue"

Vue.directive('focus', {
    inserted(el) {
        el.focus()
    }
})

Vue.directive("select", {
    inserted(el: HTMLInputElement) {
        el.select()
    }
})

new Vue({
    store,
    el: '#main',
    template: `<App/>`,
    components: { App },
})