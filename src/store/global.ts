import Tab, { Tabs } from "@/components/Tab"
import { Model } from "@/shared/model"
import { Store } from "@/store/types"
import exampleNewModel from "@/shared/model/example"

export enum View {
	Diagram,
	Grid
}

interface State {
	currentTab: Tab,
	model: Model,
	view: View
}

class Global implements Store<State> {
	
	state = {
		currentTab: {} as Tab,
		model: exampleNewModel(),
		view: View.Diagram
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

	saveModel() {
		localStorage.setItem("model", this.model.serialize())
	}

	loadModel() {
		let modelJSON = localStorage.getItem("model")
		if (modelJSON) {
			this.state.model = Model.unserialize(modelJSON)
		}
	}
}

export default new Global()