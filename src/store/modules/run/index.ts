import { Module, ActionTree, GetterTree, MutationTree } from "vuex"

import simulator from "@/shared/simulator"

export enum Status {
	Accepted = "accepted",
	Rejected = "rejected",
	Normal = "normal",
	Undefined = "undefined"
}

interface Info {
	// How many steps performed
	time: number,
	// How many cells visited
	space: number,
	// Label of the current state
	state: string
}

export interface State {

	/**
	 * Whether the turing machine is playing.
	 */
	playing: boolean

	/**
	 * Status of the turing machine.
	 */
	status: Status,

	/**
	 * Info of the current running machine.
	 */
	info: Info
}

const state: State = {
	playing: false,
	status: Status.Normal,
	info: {
		time: 0,
		space: 0,
		state: "~"
	}
}	

export enum Getter {

}

const getters: GetterTree<State, any> = {

}

export enum Mutation {
	SET_INFO = "setInfo",
	SET_PLAYING = "setPlaying",
	SET_STATUS = "setStatus"
}

const mutations: MutationTree<State> = {

	[Mutation.SET_STATUS]: (state, status: Status) => {
		state.status = status
	},

	[Mutation.SET_INFO]: (state, info) => {
		state.info = info
	},

	[Mutation.SET_PLAYING]: (state, playing: boolean) => {
		state.playing = playing
	}

}

export enum Action {
	LOAD = "load",
	PLAY = "play",
	PAUSE = "pause",
	BACK = "back",
	STEP = "step",
	RESET = "reset",
	SYNC = "sync"
}

const actions: ActionTree<State, any> = {

	[Action.SYNC]: ({ commit }) => {
		if (simulator.turing.finished) {
			commit(Mutation.SET_PLAYING, false)
		}
		
		let snapshot = simulator.turing.snapshot
		commit(Mutation.SET_INFO, {
			time: 	snapshot.time,
			space: 	snapshot.space,
			state: 	simulator.converter.state(snapshot.state).label
		} as Info)

		let status = Status.Normal
		if (simulator.turing.rejected) {
			status = Status.Rejected
		} else if (simulator.turing.accepted) {
			status = Status.Accepted
		} else if (simulator.turing.undefined) {
			status = Status.Undefined
		}
		
		commit(Mutation.SET_STATUS, status)
	},

	[Action.RESET]: ({ commit }) => {
		commit(Mutation.SET_PLAYING, false)
		simulator.reset()
	},

	[Action.LOAD]: ({ commit }, input) => {
		commit(Mutation.SET_PLAYING, false)
		simulator.load(input)
	},

	[Action.STEP]: ({ commit }) => {
		commit(Mutation.SET_PLAYING, false)
		simulator.step()
	},

	[Action.PLAY]: ({ commit }) => {
		commit(Mutation.SET_PLAYING, true)
		simulator.play()
	},

	[Action.PAUSE]: ({ commit }) => {
		commit(Mutation.SET_PLAYING, false)
		simulator.pause()
	},

	[Action.BACK]: ({ commit }) => {
		commit(Mutation.SET_PLAYING, false)
		simulator.back()
	}

}

export default {
	
	namespaced: true,
	state,
	actions,
	getters,
	mutations

} as Module<State, any>
