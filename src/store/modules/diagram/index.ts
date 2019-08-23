import { Module, ActionTree, GetterTree, MutationTree } from "vuex"
import { Transition } from "@/shared/types"

import Action from "./action"
import Mutation from "./mutation"
import Getter from "./getter"

interface State {
    state: number,
    transitionGroup: number[],
    transition: number,
    menu: null | string
}

const state: State = {
    state: 0,
    transitionGroup: [0, 2],
    transition: 0,
    menu: null
}

const actions: ActionTree<State, any> = {
    [Action.EDIT_STATE]: (state, obj) => {
        console.log("Editing state", obj)
    },
    [Action.DELETE_STATE]: (state) => {
        console.log("Deleting!")
    },
    [Action.DELETE_TRANSITION]: (state, id) => {
        console.log("Deleting transition", id)
    },
    [Action.EDIT_TRANSITION]: (state, obj) => {
        console.log("Editing transition", obj)
    },
    [Action.DELETE_TRANSITION]: (state, id) => {
        console.log("Deleting transition", id)
    } 
}

const mutations: MutationTree<State> = {
    [Mutation.SELECT_STATE]: (state, id) => {
        state.state = id
    },
    [Mutation.SELECT_GROUP]: (state, transitionGroup) => {
        state.transitionGroup = transitionGroup
    },
    [Mutation.SET_MENU]: (state, menu) => {
        state.menu = menu
    },
    [Mutation.SELECT_TRANSITION]: (state, transition) => {
        state.transition = transition
    },
    [Mutation.ADD_TRANSITION]: (state) => {
        console.log("Adding new transition!")
    },
    [Mutation.DELETE_TRANSITION]: state => {
        console.log("Deleting: ", state.transition)
    },
    [Mutation.EDIT_TRANSITION]: (state, newTransition) => {
        console.log("Editing to", newTransition)
    }
}

const getters: GetterTree<State, any> = {
    [Getter.STATE_NAME]: state => {
        return "State"
    },
    [Getter.TRANSITION]: state => (id: number): Transition => {
        return {
            direction: 1,
            read: 'A',
            write: 'B'
        }
    },
    [Getter.CURRENT_TRANSITION]: (state, getters): Transition => {
        return getters[Getter.TRANSITION](state.transition)
    }
}

const module: Module<State, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default module