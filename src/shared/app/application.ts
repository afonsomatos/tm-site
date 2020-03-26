import { IStore } from "@/shared/app/store"
import Tab from "@/components/Tab"
import { View } from "@/store/global"
import { IRunService, RunService } from "./runService"

export interface IApplication {
	setTab(tab: Tab): void
	setView(view: View): void

	readonly runService: IRunService
}

export class Application implements IApplication {

	runService: IRunService

	constructor(
		private store: IStore
	) {
		this.runService = new RunService(store.run)
	}

	setTab(tab: Tab) {
		this.store.tab = tab
	}

	setView(view: View) {
		this.store.view = view
	}
}