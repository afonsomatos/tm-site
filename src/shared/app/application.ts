import { IStore } from "@/shared/app/store"
import Tab from "@/components/Tab"
import { View } from "@/store/global"
import { IRunService, RunService } from "./runService"
import { INotebookService, NotebookService } from "./notebookService"

export interface IApplication {
	setTab(tab: Tab): void
	setView(view: View): void

	readonly runService: IRunService
	readonly notebookService: INotebookService
}

export class Application implements IApplication {

	runService: 		IRunService
	notebookService: 	INotebookService

	constructor(
		private store: IStore
	) {
		this.runService = new RunService(store.run)
		this.notebookService = new NotebookService(store.notebook)
	}

	setTab(tab: Tab) {
		this.store.tab = tab
	}

	setView(view: View) {
		this.store.view = view
	}
}