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
import { store } from "@/shared/app/store"

interface State {
    // Current transform on the diagram
    transform: Transform,
    // Current diagram graph object
    graph?: Graph,
}

const state: State = {
    transform: { x: 1, y: 1, k: 1 },
    graph: null,
}


const mutations: MutationTree<State> = {

}


const mod: Module<State, any> = {
    namespaced: true,
    state,
    mutations,
}

export default mod