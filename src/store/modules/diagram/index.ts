import Vue from "vue"
import { Module, ActionTree, GetterTree, MutationTree } from "vuex"
import { Point } from "@/shared/types"

import Action from "./action"
import Mutation from "./mutation"
import Getter from "./getter"

import { Transform } from "@/components/Diagram/Graph/types"

import Graph from "@/components/Diagram/Graph"

import { State as MState, Link, Transition, Type } from "@/shared/model"
import { app } from "@/shared/app"
import { Command } from "@/shared/app/modelService"

interface State {
    // Coordinates relative to the diagram
    graphPosition: Point,
    // Current transform on the diagram
    transform: Transform,
    // Current diagram graph object
    graph?: Graph,
    // Link being edited at the moment
    link?: Link,
    // State being edited at the moment
    state?: MState,
    // Transition being edited at the moment
    transition?: Transition,
    // Last obtained state type
    type?: Type
}

const state: State = {
    graphPosition: [0, 0],
    transform: { x: 1, y: 1, k: 1 },
    transition: null,
    link: null,
    graph: null,
    state: null,
    type: null
}

const actions: ActionTree<State, any> = {

    [Action.SET_STATE_TYPE]: ({ state }, type) => {
        state.graph.model.setType(state.state, type)
        state.graph.update()

        state.type = type
    },

    [Action.NORMALIZE]: ({ state }) => {
        if (state.transition !== null) {
            let t1 = state.transition
            // Let's remove all duplicate transitions
            for (let t2 of state.graph.model.allTransitions) {
                if (t1 !== t2 && t1.read === t2.read && t1.from === t2.from) {
                    state.graph.model.removeTransition(t2)                    
                }
            }
        }

        state.graph.update()
    },

    [Action.ADD_STATE]: ({ state }) => {
        // Go from absolute to relative graph positions
        let [x, y] = state.graphPosition
        let transform = state.graph.transform
        
        let statePosition = {
            x: (x - transform.x) / transform.k,
            y: (y - transform.y) / transform.k
        }
        
        app.modelService.execute(
            Command.addState({
                position: statePosition,
                label: "X"
            })
        )

        // state.graph.model.addState({
        //     position: statePosition,
        //     label: "X"
        // })

        // state.graph.update()
    },

    [Action.DELETE_STATE]: ({ state }) => {

        app.modelService.execute(
            Command.removeState(state.state)
        )

        // state.graph.model.removeState(state.state)
        // state.graph.update()
    },

    [Action.DELETE_TRANSITION]: ({ state }) => {

        app.modelService.execute(
            Command.removeTransition(state.transition)
        )

        // state.graph.model.removeTransition(state.transition)
        // state.graph.update()
    },

    [Action.CREATE_TRANSITION]: ({ state }) => {
        state.graph.newTransition(state.state)
    },

    [Action.SET_STATE_POSITION]: ({ rootState }, { id, pos }) => {
        Vue.set(rootState.model.statesPos, id, pos)
    }

}

const mutations: MutationTree<State> = {

    [Mutation.SET_GRAPH_POSITION]: (state, position: Point) => {
        state.graphPosition = position
    },

    [Mutation.SELECT_LINK]: (state, link: Link) => {
        state.link = link
    },
    
    [Mutation.SELECT_STATE]: (state, mstate: MState) => {
        state.state = mstate
        state.type = state.graph.model.getType(mstate)
    },

    [Mutation.SELECT_TRANSITION]: (state, transition) => {
        state.transition = transition
    },
    [Mutation.DELETE_TRANSITION]: state => {
        console.log("Deleting: ", state.transition)
    },
    [Mutation.EDIT_TRANSITION]: (state, newTransition) => {
        console.log("Editing to", newTransition)
    }
}

const getters: GetterTree<State, any> = {
    
    [Getter.STATE_TYPE]: state => state.type,

    [Getter.TRANSFORM]: state => state.transform,

}

const mod: Module<State, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default mod