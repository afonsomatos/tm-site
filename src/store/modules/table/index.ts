import { Module, ActionTree, GetterTree, MutationTree } from "vuex"

import Table from "@/shared/Table"

export interface State {
	/**
	 * Current table object.
	 */
	table: Table,
}

const state: State = {
	table: null
}

export enum Getter {

}

const getters: GetterTree<State, any> = {

}

export enum Mutation {

}

const mutations: MutationTree<State> = {

}

export enum Action {

}

const actions: ActionTree<State, any> = {

}

export default {
	
	namespaced: true,
	state,
	actions,
	getters,
	mutations

} as Module<State, any>
