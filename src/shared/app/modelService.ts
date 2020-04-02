
import { IModelStore } from "./store"
import { Model, Transition, State, Type, Link } from "../model"
import { ICommand, IInvoker, Invoker } from "../command"
import { Vector, Direction } from "../types"
import { IModelHandlerService, IStateProperties } from "./IModelService"
import { IDiagramService } from "./IDiagramService"
import { IApplication } from "./IApplication"

export interface IModelProperties {
	wildcard?: string,
	blank: string,
	tapes: number
}

export class ModelService implements IModelHandlerService {

	private model: Model
	private invoker: Map<Model, IInvoker>

	private get diagramService(): IDiagramService {
		return this.app.diagramService
	}

	constructor(
		private modelStore: IModelStore,
		private app: IApplication
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

	setStateProperties(state: State, properties: IStateProperties): void {
		state.label = properties.label
		state.position = properties.position
		this.diagramService.update()
	}
	
	getStateProperties(state: State): IStateProperties {
		return {
			label: state.label,
			position: state.position
		}
	}

	getDefaultTransition(link: Link): Transition {
        let newTransition = {
            ...link,
            direction: 	Array(this.model.tapes).fill(Direction.Right),
            read: 		Array(this.model.tapes).fill(this.model.blank),
            write: 		Array(this.model.tapes).fill(this.model.blank),
		}
		return newTransition	
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

	export const addTransition = (transition: Transition) => (modelService: IModelHandlerService): ICommand => {
		return {
			comment: "add transition",
			execute: () => modelService.addTransition(transition),
			undo: () => modelService.removeTransition(transition),
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

	export const changeState = (state: State, properties: Partial<IStateProperties>) => (modelService: IModelHandlerService): ICommand => {
		let oldProperties: IStateProperties
		return {
			execute() {
				oldProperties = modelService.getStateProperties(state)
				let newProperties = { ...oldProperties, ...properties }
				modelService.setStateProperties(state, newProperties)
			},
			undo() {
				modelService.setStateProperties(state, oldProperties)
			},
			comment: "change state"
		}
	}
}