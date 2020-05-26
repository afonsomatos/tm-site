import Vue from "vue"
import App from "./App.vue"

/**
 * Automatically focus.
 */
Vue.directive('focus', {
    inserted(el) {
        el.focus()
    }
})

/**
 * Automatically select.
 */
Vue.directive("select", {
    inserted(el: HTMLInputElement) {
        el.select()
    }
})

/**
 * Automatically select when focusing.
 */
Vue.directive("selectOnFocus", {
    inserted(el: HTMLInputElement) {
        el.addEventListener("focus", () => el.select())
    }
})

new Vue({
    el: '#main',
    template: `<App/>`,
    components: { App },
})