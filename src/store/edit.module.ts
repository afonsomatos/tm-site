import Mutation from "./mutation"
import Action from "./action"

enum Mode {
    Transition,
    State,
    Char
}

const state = {
    mode: Mode,
    transition: null,
    state: null,
    char: null
}

const actions = {

    [Action.SET_EDITING_TRANSITION]: ({ state, rootState }, { stateId, readCharId }) => {
        state.mode = Mode.Transition
        state.transition = rootState.model.stateTransitions[stateId][readCharId]
    },

}

const mutations = {

    [Mutation.SET_NO_EDITING]: state => {
        state.mode = null
    },

    [Mutation.SET_EDITING_CHAR]: (state, id: number) => {
        state.mode = Mode.Char
        state.char = id
    },
    
    [Mutation.SET_EDITING_STATE]: (state, id: number) => {
        state.mode = Mode.State
        state.state = id
    }

}

const getters = {
    
    isEditingState:         state => state.mode == Mode.State,
    isEditingTransition:    state => state.mode == Mode.Transition,
    isEditingChar:          state => state.mode == Mode.Char,

    isReadCharSelected: (state, getters) => (readCharId) => {
        return getters.isEditingChar && state.char === readCharId
    },

    isTransitionSelected: (state, getters, rootState) => (stateId, readCharId) => {
        return state.transition === rootState.model.stateTransitions[stateId][readCharId]
    },

    char: (state) => state.transition[1]
}

export default {
    state,
    mutations,
    getters,
    actions
}