import { IStore } from "@/shared/app/store"
import Tab from "@/components/Tab"

export interface IApplication {
	setTab(tab: Tab): void
}

export class Application implements IApplication {
	constructor(
		private store: IStore
	) {

	}

	setTab(tab: Tab) {
		this.store.tab = tab
	}
}