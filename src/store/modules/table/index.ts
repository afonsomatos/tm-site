import { Module, ActionTree, GetterTree, MutationTree } from "vuex"

export interface State {

}

const state: State = {
	
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

const module: Module<State, any> = {
	namespaced: true,
	state,
	actions,
	getters,
	mutations
}

export default module