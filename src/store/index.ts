import Vue from "vue"
import Vuex from "vuex"
import table from "./modules/table"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        table
    },
})