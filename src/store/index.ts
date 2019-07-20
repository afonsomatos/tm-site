import Vue from "vue"
import Vuex from "vuex"
import Tab, { START_TAB } from "@/components/Tab"
import Mutation from "./mutation"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentTab: START_TAB,
        machine: {
        }
    },
    mutations: {
        [Mutation.SET_TAB]: (state, view: Tab) => {
            state.currentTab = view
        }
    }
})