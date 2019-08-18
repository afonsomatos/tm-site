import Vue from "vue"
import _ from "lodash"

import Mutation from "./mutation"
import Getter from "./getter"
import Action from "./action"

import turing, {
    ProgramModel,
    Simulator,
    getProgramFromModel,
    Direction as turingDirection
} from "turing"

import Program from "turing/src/Program"

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

export enum TuringStatus {
    Rejected,
    Running,
    Accepted,
    Idle
} 

export enum Direction {
    Left = -1,
    Right = 1
}

export interface Transition {
    direction: Direction,
    write: string
}

export interface State {
    time: number,
    space: number,
    state: string
}

const state = {
    delay: 1000,
    step: 500,
    status: Status.Paused,
    input: "example",
    snapshots: [],
    simulator: undefined,
    bus: new Vue(),
    interval: null,
    transition: { direction: Direction.Right, write: 'x' } 
}

function VuexModelToProgram(model): Program {

    let states = {}

    for (let key in model.stateTransitions) {
        let arr = states[ model.states[key] ] = []
        for (let from in model.stateTransitions[key]) {
            let [state, write, dir, notdefined] = model.stateTransitions[key][from]
            if (notdefined) continue 
            arr.push([
                model.readChars[ from ],
                write,
                ['L', 'R'][dir],
                model.states[ state ]
            ]) //[read, write, directionChar, nextState] 
        }
    }

    let programModel: ProgramModel = {
        states,
        accept: model.states[ model.accept ],
        start: model.states[ model.start ],
        reject: "_qrj",
        empty: "#",
        extensions: undefined,
    }

    console.log(programModel)

    return getProgramFromModel(programModel)
}

function ProgramTransitionToVuexTransition(transition: turing.Transition): Transition {

    let direction: Direction = null
    if (transition.direction == turingDirection.Right)
        direction = Direction.Right
    else if (transition.direction == turingDirection.Left)
        direction = Direction.Left
        
    let write: string = transition.write

    return { direction, write }
}


const actions = {

    [Action.LOAD]: ({ state, commit, dispatch, rootState }, input: string) => {
        let program = VuexModelToProgram(rootState.model)
        commit(Mutation.SET_SIMULATOR, new Simulator(program))
        commit(Mutation.CLEAR_LOG)
        dispatch(Action.PAUSE)
        commit(Mutation.LOAD, input)
        state.bus.$emit(Event.Load)
    },

    [Action.PAUSE]: ({ state, commit }) => {
        commit(Mutation.SET_STATUS, Status.Paused)
        commit(Mutation.CLEAR_INTERVAL)
        state.bus.$emit(Event.Pause)
    },

    [Action.STEP]: ({ dispatch, state, commit }) => {

        let snapshot = state.simulator.snapshot
        let programTransition = state.simulator.next()

        if (state.simulator.finished) {
            dispatch(Action.PAUSE)
            return
        }

        let transition = ProgramTransitionToVuexTransition(programTransition)
        commit(Mutation.SET_TRANSITION, { transition, snapshot })
        state.bus.$emit(Event.Transition)
    },

    [Action.RESUME]: ({ state, dispatch, commit }) => {

        // Simulator has not been created
        if (!state.simulator)
            return
        
        commit(Mutation.CLEAR_INTERVAL)
        commit(Mutation.SET_INTERVAL, () => dispatch(Action.STEP))
        commit(Mutation.SET_STATUS, Status.Playing)

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
        if (state.snapshots.length === 0) return
        let snapshot = state.snapshots.pop()
        state.simulator.rollBack(snapshot)
    },

    [Mutation.LOAD]: (state, input: String) => {
        state.input = input
        state.simulator.load(input)
    },

    [Mutation.SET_STATUS]: (state, status: Status) => {
        state.status = status
    },

    [Mutation.SET_INTERVAL]: (state, interval) => {
        clearInterval(state.interval)
        state.interval = setInterval(interval, state.delay)
    },

    [Mutation.CLEAR_LOG]: state => {
        state.snapshots = []
    },

    [Mutation.CLEAR_INTERVAL]: (state) => {
        clearInterval(state.interval)
    },

    [Mutation.SET_TRANSITION]: (state, { transition, snapshot }) => {
        state.transition = transition
        state.snapshots.push(snapshot)
        // Vue.set(state.tape, state.head, transition.write)
        // state.head += transition.direction
    },

    [Mutation.SET_SIMULATOR]: (state, simulator) => state.simulator = simulator

}

const getters = {

    [Getter.LOADED]: ({ simulator }) => {
        return simulator instanceof Simulator
    }, 

    [Getter.STATUS]: ({ status }) => status,

    [Getter.TAPE]: ({ simulator }) => () => {
        if (!simulator)
            return {}
        return simulator.getTape()
    },
    
    [Getter.STATE]: ({ simulator }) => {
        if (!simulator)
            return {
                time: 0,
                space: 0,
                state: "None"
            }

        let status = simulator.getStatus()
        return {
            time: status.time,
            space: status.space,
            state: status.state
        }
    },

    [Getter.HEAD]: ({ simulator }) => {
        if (!simulator)
            return 0
        return simulator.getStatus().index
    },

    [Getter.TURING_STATUS]: ({ status, simulator }) => {
        if (!simulator)
            return TuringStatus.Idle

        if (simulator.accepted)
            return TuringStatus.Accepted
        else if (simulator.rejected)
            return TuringStatus.Rejected
        else if (status === Status.Playing)
            return TuringStatus.Running
        return TuringStatus.Idle
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}