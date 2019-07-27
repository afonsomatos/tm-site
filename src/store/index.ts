import Vue from "vue"
import Vuex from "vuex"
import Tab, { START_TAB } from "@/components/Tab"
import edit from "./edit.module"
import Mutation from "./mutation"

Vue.use(Vuex)

const exampleModel = {

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

const getDefaultTransition = () => [0, 'X', 1, true]

export default new Vuex.Store({
    
    modules: { edit },
    
    state: {
        currentTab: START_TAB,
        model: exampleModel,
    },

    mutations: {

        [Mutation.DELETE_READ_CHAR]: ({ model }, charId) => {
            Vue.delete(model.readChars, charId)
            Vue.delete(model.readCharList, model.readCharList.indexOf(charId))
        },

        [Mutation.ADD_READ_CHAR]: ({ model }) => {
            Vue.set(model.readChars, model.nextReadCharId, '?')
            
            // Add default transitions
            model.stateList.forEach(id =>
                Vue.set(model.stateTransitions[id], model.nextReadCharId, getDefaultTransition())
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
                Vue.set(model.stateTransitions[model.nextStateId], id, getDefaultTransition())
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