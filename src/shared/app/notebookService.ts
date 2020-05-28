import { INotebookStore } from "./store"
import Notebook from "../notebook"
import exampleNotebook from "@/shared/notebook/example"
import { Model } from "../model"
import _ from "lodash"
import { ICommand, complexCommand, IInvoker, Invoker } from "../command"
import { IModelService } from "./IModelService"

export interface INotebookService {
	execute(cmd: (arg: INotebookService) => ICommand): void,
	load(): void
	save(): void
	setNotebook(notebook: Notebook): void
	addModel(model: Model): void
	removeModel(model: Model): void
	setNotebookName(name: string)
	getNotebook(): Notebook
	getNotebookName(): string
	redo(): void
	undo(): void
}

const localStorageRootName = "notebook"

export class NotebookService implements INotebookService {

	private notebook: Notebook
	private invoker: IInvoker

	constructor(
		private notebookStore: INotebookStore,
		private modelService: IModelService
	) {
		this.invoker = new Invoker()
		this.load()
	}

	execute(command: (arg: INotebookService) => ICommand) {
		this.invoker.execute(command(this))
	}

	redo() {
		console.log("redo!")
		this.invoker.redo()
	}

	undo() {
		console.log("undo!")
		this.invoker.undo()
	}

	getNotebook() {
		return this.notebook
	}

	setNotebook(notebook: Notebook) {
		this.notebook = notebook

		this.save()
		this.notebookStore.notebook = notebook

		this.modelService.setModel(notebook.models[0])
	}

	save() {
		localStorage.setItem(localStorageRootName, this.notebook.serialize())
	}

	load() {
		let notebookJSON = localStorage.getItem(localStorageRootName)
		if (notebookJSON) {
			this.setNotebook(Notebook.unserialize(notebookJSON))
		} else {
			let notebook = exampleNotebook()
			this.setNotebook(notebook)
		}
	}

	addModel(model: Model) {
		this.notebook.models.push(model)
	}
	
	removeModel(model: Model) {
		_.remove(this.notebook.models, x => x === model)
	}

	setNotebookName(name: string) {
		this.notebook.name = name
	}

	getNotebookName() {
		return this.notebook.name = name
	}
}

export namespace Command {

	export const addModel = (model: Model) => (notebookService: INotebookService): ICommand => {
		return {
			comment: "add model",
			execute: () => notebookService.addModel(model),
			undo: () => notebookService.removeModel(model),
		}
	}

	export const removeModel = (model: Model) => (notebookService: INotebookService): ICommand =>  {
		return {
			comment: "remove model",
			execute: () => notebookService.removeModel(model),
			undo: () => notebookService.addModel(model)
		}
	}

	export const addModels = (models: Array<Model>) => (notebookService: INotebookService): ICommand => {
		return complexCommand(
				models.map(model => addModel(model)(notebookService)),
				"add multiple commands"
		)
	}

	export const setName = (newName: string) => (notebookService: INotebookService): ICommand =>  {
		let oldName: string
		return {
			comment: "set notebook name",
			execute() {
				oldName = notebookService.getNotebookName()
				notebookService.setNotebookName(newName)
			},
			undo: () => notebookService.setNotebookName(oldName)
		}
	}

	export const setNotebook = (notebook: Notebook) => (notebookService: INotebookService): ICommand =>  {
		let oldNotebook: Notebook
		return {
			comment: "set notebook",
			execute() {
				oldNotebook = notebookService.getNotebook()
				notebookService.setNotebook(notebook)
			},
			undo: () => notebookService.setNotebook(oldNotebook)
		}
	}	

	export const reset = setNotebook(exampleNotebook())
}