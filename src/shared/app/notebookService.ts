import { INotebookStore } from "./store"
import Notebook from "../notebook"
import global from "@/store/global"
import exampleNotebook from "@/shared/notebook/example"

export interface INotebookService {
	load(): void
	save(): void
	reset(): void
	setNotebook(notebook: Notebook): void
}

const localStorageRootName = "notebook"

export class NotebookService implements INotebookService {

	private notebook: Notebook

	constructor(
		private notebookStore: INotebookStore
	) {
		this.load()
	}

	setNotebook(notebook: Notebook) {
		this.notebook = notebook
		this.save()
		this.notebookStore.notebook = notebook
		global.model = notebook.models[0]
	}

	save() {
		localStorage.setItem(localStorageRootName, this.notebook.serialize())
	}

	reset() {
		let notebook = exampleNotebook()
		this.setNotebook(notebook)
	}

	load() {
		let notebookJSON = localStorage.getItem(localStorageRootName)
		if (notebookJSON) {
			this.setNotebook(Notebook.unserialize(notebookJSON))
		} else {
			this.reset()
		}
	}
}