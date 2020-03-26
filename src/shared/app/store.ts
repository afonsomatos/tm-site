import Vue from "vue"
import { View } from "../../store/global"
import Tab from "@/components/Tab"
import Run from "@/components/Tab/Run"

export interface IStore {
	view: View
	tab: Tab
}

export const mut: IStore = Vue.observable({
	view: View.Diagram,
	tab: Run,
})

export const store: Readonly<IStore> = mut
