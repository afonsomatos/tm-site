import Vue from "vue"
import Vuex from "vuex"
import Tab, { Tabs } from "@/components/Tab"
import edit from "./edit.module"
import run from "./run.module"
import Mutation from "./mutation"

Vue.use(Vuex)

const exampleModel = {

    undefinedReadCharList: {},
    
    states: { 0: "S1", 1: "S2" },
    readChars: { 0: 'A',  1: '#' },

    readCharList: [0, 1],
    stateList: [0, 1],

    stateTransitions: {
        0: { 1: [0, 'D', 1, false], 0: [1, 'F', 1, false] },
        1: { 1: [1, 'E', 1, false], 0: [1, 'G', 0, false] }
    },

    nextReadCharId: 2,
    nextStateId: 2,
    accept: 0
}

function getDefaultTransition(model) {
    return [
        model.stateList[0],
        model.readChars[ model.readCharList[0] ],
        1,
        true
    ]
}

export default new Vuex.Store({
    
    modules: {
        edit,
        run
    },
    
    state: {
        currentTab: Tabs.Run,
        model: exampleModel,
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
        
            model.stateList.push(model.nextStateId)

            Vue.set(model.states, model.nextStateId, "State")
            Vue.set(model.stateTransitions, model.nextStateId, {})
            
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

        // [Mutation.DELETE_CHAR_COLUMN]: (state, index) => {
        //     state.model.charset.splice(index,  + 1)
        //     state.model.transitions = state.model.transitions.map(tArray => {
        //         return tArray.filter(v => v[1] !== index)
        //     });
        // }
    },
})