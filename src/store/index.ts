import Vue from "vue"
import Vuex from "vuex"
import Tab, { Tabs } from "@/components/Tab"
import diagram from "./modules/diagram"
import edit from "./edit.module"
import run from "./run.module"
import Mutation from "./mutation"

import { Point, Direction } from "@/shared/types"
import { Model, State, Transition } from "@/shared/model"

Vue.use(Vuex)

const exampleModel = {

    undefinedReadCharList: {},

    statesPos: { 0: [100, 100], 1: [200, 200], 2: [300, 300] },

    
    states: { 0: "S1", 1: "S2", 2: "S3" },
    readChars: { 0: "0",  1: "1", 2: "#" },

    readCharList: [0, 1, 2],
    stateList: [0, 1, 2],

    stateTransitions: {
        0: { 1: [0, '0', 1, false],  0: [0, '1', 1, false], 2: [1, '#', 0, false] },
        1: { 1: [1, '0', 0, false],  0: [1, '1', 0, false], 2: [0, '#', 1, false] },

        2: { 1: [1, '0', 0, true ],  0: [1, '1', 0, true],  2: [1, '#', 1, true] }
    },

    nextReadCharId: 3,
    nextStateId: 3,
    accept: 2,
    start: 0
}

function getDefaultTransition(model) {
    return [
        model.stateList[0],
        model.readChars[ model.readCharList[0] ],
        1,
        true
    ]
}

const exampleNewModel = () => {
    let model = new Model();
    let a: State = {
        label: "a",
        position: {x: 100, y: 100}
    }

    let b: State = {
        label: "b",
        position: { x: 200, y: 200}
    }

    let c: Transition = {
        from: a,
        to: b,
        direction: Direction.Right,
        read: "K",
        write: "M"
    }

    model.addState(a)
    model.addState(b)
    model.addTransition(c)
    return model;
}

export default new Vuex.Store({
    
    modules: {
        edit,
        run,
        diagram
    },
    
    state: {
        currentTab: Tabs.Run,
        model: exampleModel,
        nextModel: exampleNewModel(),
    },

    mutations: {

        [Mutation.DELETE_STATE]: ({ model }, stateId) => {
            
            Vue.delete(model.states, stateId)
            Vue.delete(model.stateList, model.stateList.indexOf(stateId))

            // Make dependent transitions undefined
            for (let id of model.stateList) {
                if (stateId == id) continue
                for (let char of model.readCharList) {
                    let transition = model.stateTransitions[id][char]
                    if (transition[0] === stateId) {
                        transition[0] = model.stateList[0]
                        transition[3] = true
                    }
                }
            }
        },

        [Mutation.SET_READ_CHAR]: ({model }, { charId, char }) => {
            Vue.set(model.undefinedReadCharList, charId, false)
            Vue.set(model.readChars, charId, char)
        },

        [Mutation.DELETE_READ_CHAR]: ({ model }, charId) => {
            Vue.delete(model.readChars, charId)
            Vue.delete(model.readCharList, model.readCharList.indexOf(charId))
        },

        [Mutation.ADD_READ_CHAR]: ({ model }) => {

            Vue.set(model.readChars, model.nextReadCharId, '?')
            Vue.set(model.undefinedReadCharList, model.nextReadCharId, true)

            // Add default transitions
            model.stateList.forEach(id =>
                Vue.set(model.stateTransitions[id], model.nextReadCharId, getDefaultTransition(model))
                // model.stateTransitions[id][model.nextReadCharId] = getDefaultTransition()
            )

            model.readCharList.push(model.nextReadCharId)
            model.nextReadCharId++
        },

        [Mutation.ADD_STATE]: ({ model }) => {
            
            let id = model.nextStateId
            model.stateList.push(id)

            Vue.set(model.states, id, "State")
            Vue.set(model.stateTransitions, id, {})

            // Set default position of state on diagram
            Vue.set(model.statesPos, id, [100, 100])

            // Add default transitions
            model.readCharList.forEach((id: number) =>
                Vue.set(model.stateTransitions[model.nextStateId], id, getDefaultTransition(model))
                // model.stateTransitions[model.nextStateId][id] = getDefaultTransition()
            )
            
            model.nextStateId++
        },

        [Mutation.SET_TAB]: (state, view: Tab) => {
            state.currentTab = view
        },
        
        [Mutation.SET_MODEL]: (state, model) => {
            state.model = model
        },

        [Mutation.SET_STATE_NAME]: (state, {index, name}) => {
            Vue.set(state.model.states, index, name)
        },

        [Mutation.SET_ACCEPT_STATE]: (state, index) => {
            state.model.accept = index
        },

        [Mutation.SET_START_STATE]: (state, index) => {
            state.model.start = index
        }

        // [Mutation.DELETE_CHAR_COLUMN]: (state, index) => {
        //     state.model.charset.splice(index,  + 1)
        //     state.model.transitions = state.model.transitions.map(tArray => {
        //         return tArray.filter(v => v[1] !== index)
        //     });
        // }
    },
})