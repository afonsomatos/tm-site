import Tab, { Tabs } from "@/components/Tab"
import { Model } from "@/shared/model"
import { Store } from "@/store/types"
import Notebook from "@/shared/notebook"
import exampleNotebook from "@/shared/notebook/example"

export enum View {
	Diagram,
	Grid
}

interface State {
	currentTab: Tab,
	model: Model,
	view: View,
	notebook: Notebook
}

class Global implements Store<State> {
	
	state = {
		notebook: {} as Notebook,
		currentTab: {} as Tab,
		model: {} as Model,
		view: View.Diagram
	}

	constructor() {
		this.loadNotebook()
	}

	get canEdit(): boolean {
		return this.state.currentTab === Tabs.Edit
	}

	set view(view: View) {
		this.state.view = view
	}

	get view() {
		return this.state.view
	}

	set tab(tab: Tab) {
		this.state.currentTab = tab
	}
	
	get tab() {
		return this.state.currentTab
	}

	get model() {
		return this.state.model
	}

	set model(model: Model) {
		this.state.model = model
	}

	get notebook() {
		return this.state.notebook
	}

	set notebook(notebook: Notebook) {
		this.state.notebook = notebook
		this.saveNotebook()
	}

	saveNotebook() {
		localStorage.setItem("notebook", this.notebook.serialize())
	}

	loadNotebook() {
		let notebookJSON = localStorage.getItem("notebook")
		if (notebookJSON) {
			this.state.notebook = Notebook.unserialize(notebookJSON)
		} else {
			this.state.notebook = exampleNotebook()
		}
		this.state.model = this.state.notebook.models[0]
	}
}

export default new Global()