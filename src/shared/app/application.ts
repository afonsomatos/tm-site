import { IStore } from "@/shared/app/store"
import Tab from "@/components/Tab"
import { View } from "@/store/global"
import { IRunService, RunService } from "./runService"
import { INotebookService, NotebookService } from "./notebookService"
import { ModelService, IModelService } from "./modelService"
import { IDiagramService, DiagramService } from "./diagramService"

export interface IApplication {
	setTab(tab: Tab): void
	setView(view: View): void

	readonly runService: 		IRunService
	readonly notebookService: 	INotebookService
	readonly diagramService:	IDiagramService
	readonly modelService:		IModelService
}

export class Application implements IApplication {

	runService: 		IRunService
	notebookService: 	INotebookService
	diagramService:		IDiagramService
	modelService:		IModelService

	constructor(
		private store: IStore
	) {
		let diagramService		= new DiagramService(store.diagram)
		this.runService 		= new RunService(store.run)
		this.modelService 		= new ModelService(store.model, diagramService)
		this.notebookService 	= new NotebookService(store.notebook, this.modelService)

		diagramService.modelService = this.modelService
		this.diagramService = diagramService
	}

	setTab(tab: Tab) {
		this.store.tab = tab
	}

	setView(view: View) {
		this.store.view = view
	}
}