import Tab from "@/components/Tab"
import { View } from "@/store/global"
import { IRunService } from "./runService"
import { INotebookService } from "./notebookService"
import { IDiagramService } from "./IDiagramService"
import { IModelService } from "./IModelService"

export interface IApplication {
	setTab(tab: Tab): void
	setView(view: View): void

	readonly runService: 		IRunService
	readonly notebookService: 	INotebookService
	readonly diagramService:	IDiagramService
	readonly modelService:		IModelService
}
