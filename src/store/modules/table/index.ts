import { Module, ActionTree, GetterTree, MutationTree } from "vuex"

import Table from "@/shared/Table"
import { Transition, State as MState, Type, Model } from "@/shared/model"
import { Direction } from "@/shared/types"

export enum Mode {
	Transition = "transition",
	Char = "char",
	State = "state"
}

export interface State {
	/**
	 * Current table object.
	 */
	table: Table,
	/**
	 * Current transition being edited.
	 */
	transition: Transition,
	/**
	 * Current character being edited.
	 */
	char: string,
	/**
	 * Current state being edited.
	 */
	state: MState,
	/**
	 * Current mode of editing. Null means nothing is being edited.
	 */
	mode: Mode | null,
	/**
	 * Last obtained state type.
	 */
	type: Type | null,
}

const state: State = {
	table: null,
	transition: null,
	char: null,
	state: null,
	mode: null,
	type: null
}

export enum Getter {
	STATE_TYPE = "stateType",
	AVAILABLE_CHAR = "availableChar"
}

const getters: GetterTree<State, any> = {

	[Getter.STATE_TYPE]: state => state.type,

	[Getter.AVAILABLE_CHAR]: state => (char: string) => {
		return state.table.model.allTransitions
			.findIndex(t => t.read[0] === char) === -1
	}

}

export enum Mutation {
	SET_TRANSITION = "setTransition",
	SET_STATE = "setState",
	SET_CHAR = "setChar",
	SET_MODE = "setMode"
}

const mutations: MutationTree<State> = {

	[Mutation.SET_TRANSITION]: (state, transition: Transition) => {
		state.transition = transition
		state.mode = Mode.Transition
	},

	[Mutation.SET_STATE]: (state, mstate: MState) => {
		state.state = mstate
		state.mode = Mode.State
		state.type = state.table.model.getType(mstate)
	},

	[Mutation.SET_CHAR]: (state, char: string) => {
		state.char = char
		state.mode = Mode.Char
	},

	[Mutation.SET_MODE]: (state, mode: Mode) => {
		state.mode = mode
	}

}

export enum Action {
	ADD_STATE = "addState",
	ADD_CHARACTER = "addCharacter",
	DELETE_STATE = "deleteState",
	RENAME_CHARACTER = "deleteChracter",
	SET_STATE_TYPE = "setStateType",
	DELETE_CHARACTER = "deleteCharacter"
}

const actions: ActionTree<State, any> = {

	[Action.SET_STATE_TYPE]: ({ state }, type) => {
        state.table.model.setType(state.state, type)
        state.table.update()
        state.type = type
	},
	
	[Action.DELETE_STATE]: ({ state }) => {
		state.table.model.removeState(state.state)
		state.table.update()
	},

	[Action.ADD_STATE]: ({ state }) => {
		
		state.table.model.addState({
			position: { x: 0, y: 0 },
			label: "New State"
		})

		state.table.update()
	},

	/**
	 * Deletes a column in the table.
	 */
	[Action.DELETE_CHARACTER]: ({ state }) => {

		let model = state.table.model
		
		model.allTransitions
			.filter(t => t.read[0] === state.char)
			.forEach(t => model.removeTransition(t))

		state.mode = null
		state.table.update()
	},

	/**
	 * Renames a column in the table.
	 */
	[Action.RENAME_CHARACTER]: ({ state }, newChar: string) => {

		let model = state.table.model

		for (let transition of model.allTransitions) {
			if (transition.read[0] === state.char) {
				transition.read[0] = newChar
			}
		}

		state.char = newChar
		state.table.update()
	},

	/**
	 * The column in the turing table.
	 */
	[Action.ADD_CHARACTER]: ({ state }) => {
		
		let model = state.table.model

		// Find next available character
		let characters = new Set(model.allTransitions.map(t => t.read[0]))
		let i = 60;
		while (characters.has(String.fromCharCode(++i)));

		let char = String.fromCharCode(i)

		/**	
		 * Add transition (column cell) to each state.
		 */
		for (let s of model.states) {
			model.addTransition({
				read: [char],
				write: [char],
				from: s,
				to: s,
				direction: [Direction.Right],
				undefined: true
			})
		}

		state.table.update()
	}

}

export default {
	
	namespaced: true,
	state,
	actions,
	getters,
	mutations

} as Module<State, any>
