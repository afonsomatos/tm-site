import Vue from "vue"
import Vuex from "vuex"
import table from "./modules/table"
import diagram from "./modules/diagram"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        diagram,
        table
    },
})