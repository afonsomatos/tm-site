import Tab, { Tabs } from "@/components/Tab"
import { Model } from "@/shared/model"
import { Direction } from "@/shared/types"
import { Store } from "@/store/types"

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
}

export default new Global()

function exampleNewModel() {
	let model = new Model();

	let a = {
		label: "a",
		position: {x: 100, y: 200}
	}

	let b = {
		label: "b",
		position: {x: 300, y: 200}
	}

	let c = {
		from: a,
		to: b,
		direction: Direction.Left,
		read: "1",
		write: "0"
	}

	let d = {
		from: b,
		to: a,
		direction: Direction.Left,
		read: "1",
		write: "2"
	}
	
	model.addState(a)
	model.addState(b)

	model.start = a

	model.addTransition(c)
	model.addTransition(d)

	return model;
}

