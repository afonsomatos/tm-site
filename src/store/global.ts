import Tab from "@/components/Tab"

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

const localStorageRootName = "notebook"

class Global implements Store<State> {
	
	state = {
		notebook: {} as Notebook,
		currentTab: {} as Tab,
		model: {} as Model,
		view: View.Diagram
	}

	get model() {
		return this.state.model
	}

	set model(model: Model) {
		this.state.model = model
	}

}

export default new Global()