import Vue from "vue"
import { Module, ActionTree, GetterTree, MutationTree } from "vuex"
import { Point } from "@/shared/types"

import Action from "./action"
import Mutation from "./mutation"
import Getter from "./getter"

import { Transform } from "@/components/Diagram/Graph/types"

import Graph from "@/components/Diagram/Graph"

import { State as MState, Link, Transition } from "@/shared/model"

interface State {
    // Coordinates for the context menu
    position: Point,
    // Identifies which context menu is being shown. Null means it's closed. 
    menu: null | string,
    // Current transform on the diagram
    transform: Transform,
    // Current diagram graph object
    graph?: Graph,
    // Link being edited at the moment
    link?: Link,
    // State being edited at the moment
    state?: MState
    // Transition being edited at the moment
    transition?: Transition
}

const state: State = {
    position: [0, 0],
    transform: { x: 1, y: 1, k: 1 },
    transition: null,
    link: null,
    menu: null,
    graph: null,
    state: null
}

const actions: ActionTree<State, any> = {
    [Action.EDIT_STATE]: (state, obj) => {
        console.log("Editing state", obj)
    },

    [Action.DELETE_STATE]: ({ state }) => {
        state.graph.model.removeState(state.state)
        state.graph.update()
    },

    [Action.DELETE_TRANSITION]: (state, id) => {
        console.log("Deleting transition", id)
    },
    [Action.EDIT_TRANSITION]: (state, obj) => {
        console.log("Editing transition", obj)
    },
    [Action.DELETE_TRANSITION]: (state, id) => {
        console.log("Deleting transition", id)
    },

    [Action.CREATE_TRANSITION]: ({ state }) => {
        state.graph.newTransition(state.state)
    },

    [Action.SET_STATE_POSITION]: ({ rootState }, { id, pos }) => {
        Vue.set(rootState.model.statesPos, id, pos)
    }

}

const mutations: MutationTree<State> = {

    [Mutation.SELECT_LINK]: (state, link: Link) => {
        state.link = link
    },

    [Mutation.SET_TRANSFORM]: (state, transform: Transform) => {
        state.transform = transform
    },

    [Mutation.SET_POSITION]: (state, position: Point) => {
        state.position = position
    },
    
    [Mutation.SELECT_STATE]: (state, mstate: MState) => {
        state.state = mstate
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
    
    [Getter.TRANSFORM]: state => state.transform,

    [Getter.POSITION]: state => state.position,
    
    [Getter.STATE_NAME]: state => {
        return "State"
    },

    [Getter.CURRENT_TRANSITION]: (state, getters): Transition => {
        return getters[Getter.TRANSITION](state.transition)
    }
}

const mod: Module<State, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default mod