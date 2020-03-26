import Vue from "vue"
import { View } from "../../store/global"
import Tab from "@/components/Tab"
import { Status } from "@/shared/app/types"

export interface IStore {
	run: IRunStore,
	view: View,
	tab: Tab,
	readonly canEdit: boolean
}

export interface Info {
	time: number,
	space: number,
	state: string
}

export interface IRunStore {
	playing: boolean
	status: Status,
	info: Info
}

const NO_STATE = "~"

export const mut: IStore = Vue.observable({
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