import { Module, ActionTree, GetterTree, MutationTree } from "vuex"
import { Transition, Point } from "@/shared/types"

import Action from "./action"
import Mutation from "./mutation"
import Getter from "./getter"

import RootMutation from "@/store/mutation"
import RootAction from "@/store/action"
import { Transform } from "@/components/Diagram/Graph/types"

import Vue from "vue"
import Graph from "@/components/Diagram/Graph"

interface State {
    position: Point,
    state: number,
    transitionGroup: number[],
    transition: number,
    // Identifies which context menu is being shown. Null means it's closed. 
    menu: null | string,
    // Current transform on the diagram
    transform: Transform,
    // Current diagram graph object
    graph?: Graph,
    // Selected link between two nodes
    link?: [number, number]
}

const state: State = {
    position: [0, 0],
    state: 0,
    transitionGroup: [0, 2],
    transition: 0,
    menu: null,
    graph: null,
    transform: { x: 1, y: 1, k: 1 },
    link: null,
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
    },
    [Action.ADD_STATE]: ({ commit, dispatch, state, rootState }) => {

        const id = rootState.model.nextStateId
        commit(RootMutation.ADD_STATE, null, { root: true })

        // Get real position
        let { transform } = state
        let [x, y] = state.position
        let pos = [ (x - transform.x) / transform.k, (y - transform.y) / transform.k ]

        dispatch(Action.SET_STATE_POSITION, { id, pos })

        if (state.graph) {
            state.graph.addNode(x, y, "Hehe", id)
        }

    },

    [Action.CREATE_TRANSITION]: () => {

        if (state.graph) {
            state.graph.newTransition(state.state)
        }
    },

    [Action.SET_STATE_POSITION]: ({ rootState }, { id, pos }) => {
        Vue.set(rootState.model.statesPos, id, pos)
    }

}

const mutations: MutationTree<State> = {

    [Mutation.SELECT_LINK]: (state, link: [number, number]) => {
        state.link = link
    },

    [Mutation.SET_TRANSFORM]: (state, transform: Transform) => {
        state.transform = transform
    },

    [Mutation.SET_POSITION]: (state, position: Point) => {
        state.position = position
    },
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
    
    [Getter.TRANSFORM]: state => state.transform,

    [Getter.POSITION]: state => state.position,
    
    [Getter.STATE_NAME]: state => {
        return "State"
    },
    [Getter.TRANSITION]: state => (id: number): Transition => {
        console.log("Getting transition", id)
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

const mod: Module<State, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default mod