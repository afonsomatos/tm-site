import Vue from "vue"
import { View } from "../../store/global"
import Tab from "@/components/Tab"
import { Status } from "@/shared/app/types"
import Notebook from "../notebook"
import { Model, Transition, Type, Link, State } from "../model"
import { Point, Vector } from "../types"
import Table from "../Table"
import { DeepReadonly } from "ts-essentials"

export interface IStore {
	table: ITableStore,
	notebook: INotebookStore,
	run: IRunStore,
	model: IModelStore,
	diagram: IDiagramStore,
	view: View,
	tab: Tab,
	readonly canEdit: boolean
}

export interface Info {
	time: number,
	space: number,
	state: string
}

export enum Mode {
	Transition = "transition",
	Char = "char",
	State = "state"
}

export interface ITableStore {
	// Current transition being edited.
	transition: Transition,
	// Current character being edited.
	char: string,
	// Current state being edited.
	state: State,
	// Current mode of editing. Null means nothing is being edited.
	mode: Mode | null,
	// Last obtained state type.
	type: Type | null,
}

export interface IDiagramStore {
	// Coordinates for the context menu
	contextMenuPosition: Vector
    // Identifies which context menu is being shown. Null means it's closed. 
	menu: null | string
	// Transition being edited at the moment
	transition?: Transition
	// State type
	type?: Type
    // Link being edited at the moment
	link?: Link
	// State being edited at the moment
	state?: State,
}

export interface IModelStore {
	model: Model 
}

export interface INotebookStore {
	notebook: Notebook
}

export interface IRunStore {
	playing: boolean
	status: Status,
	info: Info
}

const NO_STATE = "~"

export const mut: IStore = Vue.observable({
	table: {
		transition: null,
		char: null,
		type: null,
		mode: null,
		state: null
	},
	diagram: {
		contextMenuPosition: {x:0,y:0},
		transition: null,
		menu: null,
		type: null,
	},
	notebook: {
		notebook: null	
	},
	model: {
		model: null
	},
	run: {
		playing: false,
		status: Status.Normal,
		info: {
			time: 0,
			space: 0,
			state: NO_STATE
		}
	},
	view: View.Diagram,
	tab: null,
	get canEdit() {
		return this.tab.canEdit
	}
})

export const store: DeepReadonly<IStore> = mut