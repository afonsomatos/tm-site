import Vue from "vue"
import { View } from "../../store/global"
import Tab from "@/components/Tab"
import { Status } from "@/shared/app/types"
import Notebook from "../notebook"
import { Model, Transition, Type } from "../model"
import { Point, Vector } from "../types"
import { DeepReadonly } from "ts-essentials"

export interface IStore {
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

export interface IDiagramStore {
	// Coordinates for the context menu
	contextMenuPosition: Vector
    // Identifies which context menu is being shown. Null means it's closed. 
	menu: null | string
	// Transition being edited at the moment
	transition?: Transition
	// State type
	type?: Type
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
	diagram: {
		contextMenuPosition: {x:0,y:0},
		transition: null,
		menu: null,
		type: null
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

export const store: Readonly<IStore> = mut