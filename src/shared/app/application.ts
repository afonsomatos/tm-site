import { IStore } from "@/shared/app/store"
import Tab from "@/components/Tab"
import { View } from "@/store/global"

export interface IApplication {
	setTab(tab: Tab): void
	setView(view: View): void
}

export class Application implements IApplication {
	constructor(
		private store: IStore
	) {

	}

	setTab(tab: Tab) {
		this.store.tab = tab
	}

	setView(view: View) {
		this.store.view = view
	}
}