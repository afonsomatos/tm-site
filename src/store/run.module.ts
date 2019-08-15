import Vue from "vue"
import Mutation from "./mutation"
import Getter from "./getter"
import Action from "./action"

export enum Event {
    Load = "load",
    Run = "run",
    Other = "other",
    Pause = "pause",
    Resume = "resume",
    Transition = "transition",
    Back = "roll",
}

export enum Status {
    Paused,
    Playing,
    Stopped
}

export enum Direction {
    Left = -1,
    Right = 1
}

export interface Transition {
    direction: Direction
}

const state = {
    step: 2000,
    head: 0,
    status: Status.Paused,
    input: "example",
    log: [],
    tape: "example".split(''),
    bus: new Vue(),
    interval: null,
    transition: { direction: Direction.Right, write: 'x' } 
}

const actions = {

    [Action.LOAD]: ({ state, commit, dispatch }, input) => {
        dispatch(Action.PAUSE)
        commit(Mutation.LOAD, input)
        state.bus.$emit(Event.Load)
    },

    [Action.PAUSE]: ({ state, commit }) => {
        commit(Mutation.SET_STATUS, Status.Paused)
        commit(Mutation.CLEAR_INTERVAL)
        state.bus.$emit(Event.Pause)
    },

    [Action.STEP]: ({ state, commit }) => {
        let direction = Direction.Right // Math.random() < 0.5 ? Direction.Right : Direction.Left
        let write = 'x'
        commit(Mutation.SET_TRANSITION, { direction, write })
        state.bus.$emit(Event.Transition)
    },

    [Action.RESUME]: ({ dispatch, commit }) => {
        commit(Mutation.SET_STATUS, Status.Playing)
        commit(Mutation.SET_INTERVAL, () => dispatch(Action.STEP))
        state.bus.$emit(Event.Resume)
    },
    
    [Action.REPEAT]: ({ dispatch, state }) => {
        dispatch(Action.LOAD, state.input)
    },

    [Action.BACK]: ({ commit }) => {
        commit(Mutation.BACK)
        state.bus.$emit(Event.Back)
    }
}

const mutations = {

    [Mutation.BACK]: (state) => {
        if (state.log.length === 0) return
        let { tape, head } = state.log.pop()
        state.tape = tape.slice()
        state.head = head
    },

    [Mutation.LOAD]: (state, input: String) => {
        state.input = input
        state.tape = input.split('')
        state.head = 0
        state.log = []
    },

    [Mutation.SET_STATUS]: (state, status: Status) => {
        state.status = status
    },

    [Mutation.SET_INTERVAL]: (state, interval) => {
        state.interval = setInterval(interval, state.step)
    },

    [Mutation.CLEAR_INTERVAL]: (state) => {
        clearInterval(state.interval)
    },

    [Mutation.SET_TRANSITION]: (state, transition) => {
        state.transition = transition
        state.log.push({ head: state.head, tape: state.tape.slice() })
        Vue.set(state.tape, state.head, transition.write)
        state.head += transition.direction
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