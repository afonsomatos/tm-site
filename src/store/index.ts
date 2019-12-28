import Vue from "vue"
import Vuex from "vuex"
import Tab, { Tabs } from "@/components/Tab"
import table from "./modules/table"
import diagram from "./modules/diagram"
import run from "./modules/run"
import edit from "./edit.module"
import Mutation from "./mutation"

import { Point, Direction } from "@/shared/types"
import { Model, State, Transition } from "@/shared/model"

Vue.use(Vuex)

const exampleNewModel = () => {
    let model = new Model();

    let a: State = {
        label: "a",
        position: {x: 100, y: 200}
    }

    let b: State = {
        label: "b",
        position: {x: 300, y: 200}
    }

    let c: Transition = {
        from: a,
        to: b,
        direction: Direction.Left,
        read: "1",
        write: "0"
    }

    let d: Transition = {
        from: b,
        to: a,
        direction: Direction.Left,
        read: "1",
        write: "2"
    }
    
    model.addState(a)
    model.addState(b)

    model.start = a

    model.addTransition(c)
    model.addTransition(d)

    return model;
}

export default new Vuex.Store({
    
    modules: {
        edit,
        run,
        diagram,
        table
    },
    
    state: {
        currentTab: Tabs.Run,
        nextModel: exampleNewModel(),
    },

    mutations: {

        [Mutation.SET_TAB]: (state, view: Tab) => {
            state.currentTab = view
        },
        
    },
})