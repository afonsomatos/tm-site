import Vue from "vue"
import Vuex from "vuex"
import Tab, { START_TAB } from "@/components/Tab"
import Mutation from "./mutation"

Vue.use(Vuex)

const exampleModel = {
    states: ["S1", "S2"],
    charset: ["#", "A"],
    transitions: [
        [ [0, 0, 0], [1, 1, 1] ],
        [ [1, 1, 1], [0, 0, 0] ]
    ],
}

export default new Vuex.Store({
    state: {
        currentTab: START_TAB,
        model: exampleModel,
        editTransition: null
    },
    getters: {
        transition: (state) => {
            let [i, j] = state.editTransition
            return state.model.transitions[i][j]
        }
    },
    mutations: {
        [Mutation.SET_TAB]: (state, view: Tab) => {
            state.currentTab = view
        },
        [Mutation.SET_EDITING_TRANSITION]: (state, [i, j]) => {
            state.editTransition = [i, j]
        },
        [Mutation.SET_MODEL]: (state, model) => {
            state.model = model
        }
    }
})