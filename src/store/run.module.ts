import Vue from "vue"
import Mutation from "./mutation"
import Getter from "./getter"
import Action from "./action"

export enum Event {
    Load = "load",
    Run = "run",
    Other = "other",
    Pause = "pause",
    Resume = "resume"
}

export enum Status {
    Paused,
    Playing,
    Stopped
}

const state = {
    status: Status.Paused,
    head: 0,
    input: "abcdefghijklmonpqrstuvxwyz",
    bus: new Vue()
}

const actions = {

    [Action.LOAD]: ({ state, commit, dispatch }, input) => {
        dispatch(Action.PAUSE)
        commit(Mutation.LOAD, input)
        state.bus.$emit(Event.Load)
    },

    [Action.PAUSE]: ({ state, commit }) => {
        commit(Mutation.SET_STATUS, Status.Paused)
        state.bus.$emit(Event.Pause)
    },

    [Action.RESUME]: ({ commit }) => {
        commit(Mutation.SET_STATUS, Status.Playing)
        state.bus.$emit(Event.Resume)
    },
    
    [Action.REPEAT]: ({ dispatch, state }) => {
        dispatch(Action.LOAD, state.input)
    },

}

const mutations = {

    [Mutation.LOAD]: (state, input: String) => {
        state.input = input
    },

    [Mutation.SET_STATUS]: (state, status: Status) => {
        state.status = status
    }

}

const getters = {

    [Getter.STATUS]: (state) => state.status

}

export default {
    state,
    mutations,
    getters,
    actions
}