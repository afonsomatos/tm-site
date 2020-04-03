import { IStore } from "@/shared/app/store"
import Tab from "@/components/Tab"
import { View } from "@/store/global"
import { IRunService, RunService } from "./runService"
import { INotebookService, NotebookService } from "./notebookService"
import { ModelService } from "./modelService"
import { DiagramService } from "./diagramService"
import { IDiagramService } from "./IDiagramService"
import { IModelService } from "./IModelService"
import { IApplication } from "./IApplication"
import { ITableService } from "./ITableService"
import { TableService } from "./TableService"

export class Application implements IApplication {

	runService: 		IRunService
	notebookService: 	INotebookService
	diagramService:		IDiagramService
	modelService:		IModelService
	tableService:		ITableService

	constructor(
		private store: IStore
	) {
		this.tableService		= new TableService(store.table, this)
		this.diagramService		= new DiagramService(store.diagram, this)
		this.runService 		= new RunService(store.run)
		this.modelService 		= new ModelService(store.model, this)
		this.notebookService 	= new NotebookService(store.notebook, this.modelService)
	}

	setTab(tab: Tab) {
		this.store.tab = tab
	}

	setView(view: View) {
		this.store.view = view
	}
}