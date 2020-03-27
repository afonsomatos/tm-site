
import { IModelStore } from "./store"
import { Model, Transition, State, Type } from "../model"
import { ICommand, IInvoker, Invoker } from "../command"
import { IDiagramService } from "./diagramService"
import { Vector } from "../types"
import { toUnicode } from "punycode"

export interface IModelProperties {
	wildcard?: string,
	blank: string,
	tapes: number
}

export interface IModelService {
	execute(cmd: (arg: IModelHandlerService) => ICommand): void
	undo(): void
	redo(): void
	setModel(model: Model): void
	// addTransition(transition: Transition): void
	// removeTransition(transition: Transition): void
	// getTransitions(): Transition[]
	// getStartState(): State
	// setStartState(state: State): void
	// setProperties(modelProperties: IModelProperties): void
	//getProperties(): IModelProperties
	getStateType(state: State): Type
	getModel(): Model
	getStartState(): State
	getTransitions(): Transition[]
}

export interface IModelHandlerService extends IModelService {
	setStateType(state: State, type: Type): void
	removeState(state: State): void
	addState(state: State): void
	setStartState(state: State): void
	removeTransition(transition: Transition): void
	addTransition(transition: Transition): void
}

export interface IStateProperties {
	label: string,
	position: Vector
}


export class ModelService implements IModelHandlerService {

	private model: Model
	private invoker: Map<Model, IInvoker>

	constructor(
		private modelStore: IModelStore,
		private diagramService: IDiagramService
	) {
		this.invoker = new Map()
	}

	undo() {
		this.invoker.get(this.model).undo()
	}

	redo() {
		this.invoker.get(this.model).redo()
	}

	execute(cmd: (arg: IModelHandlerService) => ICommand) {
		this.invoker.get(this.model).execute(cmd(this))
	}

	removeState(state: State): void {
		this.model.removeState(state)
		this.diagramService.update()
	}
	
	addState(state: State): void {
		this.model.addState(state)
		this.diagramService.update()
	}

	setModel(model: Model) {
		if (!this.invoker.has(model)) {
			this.invoker.set(model, new Invoker())
		}
		this.model = model
		this.modelStore.model = model
		this.diagramService.update()
	}

	getModel(): Model {
		return this.model
	}

	setStartState(state: State) {
		this.model.start = state
		this.diagramService.update()
	}

	addTransition(transition: Transition): void {
		this.model.addTransition(transition)
		this.diagramService.update()
	}
	
	removeTransition(transition: Transition): void {
		this.model.removeTransition(transition)
		this.diagramService.update()
	}

	getStartState() {
		return this.model.start
	}

	getTransitions() {
		return this.model.transitions
	}

	getStateType(state: State) {
		return this.model.getType(state)
	}

	setStateType(state: State, type: Type) {
		this.model.setType(state, type)
		this.diagramService.update()
	}

}

export namespace Command {

	export const addState = (state: State) => (modelService: IModelHandlerService): ICommand => {
		return {
			comment: "add state",
			execute: () => modelService.addState(state),
			undo: () => modelService.removeState(state)
		}
	}

	export const removeState = (state: State) => (modelService: IModelHandlerService): ICommand => {
		let wasStart: boolean
		let deletedTransitions: Transition[] = []
		return {
			comment: "remove state",
			execute() {
				wasStart = modelService.getStartState() === state

				deletedTransitions = modelService.getTransitions().filter(t => t.from === state || t.to === state)
				deletedTransitions.forEach(t => modelService.removeTransition(t))
		
				if (wasStart) {
					modelService.setStartState(null)
				}
		
				modelService.removeState(state)
			},
			undo() {
				modelService.addState(this.state)
		
				if (wasStart) {
					modelService.setStartState(this.state)
				}
		
				deletedTransitions.forEach(t => modelService.addTransition(t))
			}
		}
	}

	export const removeTransition = (transition: Transition) => (modelService: IModelHandlerService): ICommand => {
		return {
			comment: "remove transition",
			execute: () => modelService.removeTransition(transition),
			undo: () => modelService.addTransition(transition)
		}
	}

	export const editStateType = (state: State, type: Type) => (modelService: IModelHandlerService): ICommand => {
		let oldType: Type
		return {
			comment: "edit state type",
			execute() {
				oldType = modelService.getStateType(state)
				modelService.setStateType(state, type)
			},
			undo() {
				modelService.setStateType(state, oldType)
			}
		}
	}

}

/**


 */