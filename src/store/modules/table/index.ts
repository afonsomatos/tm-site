import { Module, ActionTree, GetterTree, MutationTree } from "vuex"

import Table, { NEW_COLUMN_CHAR } from "@/shared/Table"
import { Transition, State as MState } from "@/shared/model"
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
	mode: Mode | null
}

const state: State = {
	table: null,
	transition: null,
	char: null,
	state: null,
	mode: null,
}

export enum Getter {

}

const getters: GetterTree<State, any> = {

}

export enum Mutation {
	SET_TRANSITION = "setTransition",
	SET_STATE = "setState",
	SET_CHAR = "setChar",
}

const mutations: MutationTree<State> = {

	[Mutation.SET_TRANSITION]: (state, transition: Transition) => {
		state.transition = transition
		state.mode = Mode.Transition
	},

	[Mutation.SET_STATE]: (state, mstate: MState) => {
		state.state = mstate
		state.mode = Mode.State
	},

	[Mutation.SET_CHAR]: (state, char: string) => {
		state.char = char
		state.mode = Mode.Char
	}

}

export enum Action {
	ADD_STATE = "addState",
	ADD_CHARACTER = "addCharacter",
}

const actions: ActionTree<State, any> = {

	[Action.ADD_STATE]: ({ state }) => {
		
		state.table.model.addState({
			position: { x: 0, y: 0 },
			label: "New State"
		})

		state.table.update()
	},

	/**
	 * The column in the turing table.
	 */
	[Action.ADD_CHARACTER]: ({ state }, char: string = NEW_COLUMN_CHAR) => {
		
		let model = state.table.model

		/**	
		 * Add transition (column cell) to each state.
		 */
		for (let s of model.states) {
			model.addTransition({
				read: char,
				write: char,
				from: s,
				to: s,
				direction: Direction.Right,
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
