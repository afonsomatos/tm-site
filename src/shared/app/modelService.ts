
import { IModelStore } from "./store"
import { Model, Transition, State, Type } from "../model"
import { ICommand } from "../command"
import { IDiagramService } from "./diagramService"

export interface IModelProperties {
	wildcard?: string,
	blank: string,
	tapes: number
}

export interface IModelService {
	setModel(model: Model): void
	// addTransition(transition: Transition): void
	// removeTransition(transition: Transition): void
	// getTransitions(): Transition[]
	// getStartState(): State
	// setStartState(state: State): void
	// removeState(state: State): void
	// addState(state: State): void
	// setProperties(modelProperties: IModelProperties): void
	// getProperties(): IModelProperties
	// getStateType(state: State): Type
	// setStateType(state: State, type: Type): void
	getModel(): Model
}

export class ModelService implements IModelService {

	private model: Model

	constructor(
		private modelStore: IModelStore,
		private diagramService: IDiagramService
	) {

	}

	setModel(model: Model) {
		this.model = model
		this.modelStore.model = model
		this.diagramService.update()
	}

	getModel(): Model {
		return this.model
	}

}

export namespace Command {

	// const addState = (state: State) => (modelService: IModelService): ICommand => {
	// 	return {
	// 		comment: "add state",
	// 		execute: () => modelService.ad
	// 	}
	// }


}

/**
 * 
 * 
 export class AddStateCommand implements ICommand {
	comment = "add state"

	constructor(
		private modelService: IModelService,
		private state: State) {
		
	}

	execute() {
		this.modelService.addState(this.state)
	}

	undo() {
		this.modelService.removeState(this.state)
	}
}
 */