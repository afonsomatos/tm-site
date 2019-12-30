import Vue from "vue"
import Vuex from "vuex"
import table from "./modules/table"
import diagram from "./modules/diagram"
import run from "./modules/run"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        run,
        diagram,
        table
    },
})