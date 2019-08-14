import Vue from "vue"
import Mutation from "./mutation"
import Action from "./action"

export enum Event {
    Load = "Load",
    Run = "Run",
    Other = "Other"
}

const state = {
    head: 0,
    input: "abcdefghijklmonpqrstuvxwyz",
    bus: new Vue()
}

const actions = {

    [Action.RUN]: ({ commit, state }, input) => {
        commit(Mutation.LOAD, input)
        state.bus.$emit(Event.Load)
        setTimeout(() => state.bus.$emit(Event.Run), 1000)
    }

}

const mutations = {

    [Mutation.LOAD]: (state, input) => {
        state.input = input
    }

}

const getters = {

}

export default {
    state,
    mutations,
    getters,
    actions
}