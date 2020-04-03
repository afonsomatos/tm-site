
import _ from "lodash"
import { IModelStore } from "./store"
import { Model, Transition, State, Type, Link } from "../model"
import { ICommand, IInvoker, Invoker, complexCommand } from "../command"
import { Vector, Direction, SimpleTransition } from "../types"
import { IModelHandlerService, IStateProperties, IModelProperties } from "./IModelService"
import { IDiagramService } from "./IDiagramService"
import { IApplication } from "./IApplication"

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

	setProperties(props: Partial<IModelProperties>) {
		Object.assign(this.model, props)
	}

	getProperties(): IModelProperties {
		return {
			blank: this.model.blank,
			wildcard: this.model.wildcard
		}
	}

	getTapes() {
		return this.model.tapes
	}

	setTapes(value: number): void {
		this.model.tapes = value
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

	changeTransitionLink(transition: Transition, newLink: Link) {
		transition.to = newLink.to
		transition.from = newLink.from
		this.diagramService.update()
	}

	changeTransition(transition: Transition, tape: number, edit: SimpleTransition) {
		transition.direction[tape]  = edit.direction
		transition.read[tape]		= edit.read
		transition.write[tape]		= edit.write
		this.diagramService.update()
	}

	getTransitionTape(transition: Transition, tape: number): SimpleTransition {
		return {
			direction: 	transition.direction[tape],
			read: 		transition.read[tape],
			write:		transition.write[tape]
		}
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

	export const changeModel = (properties: Partial<IModelProperties>) => (modelService: IModelHandlerService): ICommand => {
		let oldProperties: IModelProperties
		return {
			comment: "change model",
			execute() {
				oldProperties = modelService.getProperties()
				modelService.setProperties(properties)
			},
			undo() {
				modelService.setProperties(oldProperties)
			}
		}
	}	

	export const changeTapes = (tapes: number) => (modelService: IModelHandlerService): ICommand => {
		// TODO: Set transitions method on modelService? 
		let oldTransitions: Array<Transition>
		let newTransitions: Array<Transition>
		let oldTapes: number
		return {
			comment: "change tapes",
			execute() {
				oldTapes = modelService.getTapes()
				oldTransitions = modelService.getTransitions()
				newTransitions = oldTransitions.map(t => {
					modelService.removeTransition(t)
					let newTransition = _.clone(t)
					newTransition.direction = _.times(tapes, i => t.direction[i] || Direction.Right).slice(0, tapes + 1)
					newTransition.read 		= _.times(tapes, i => t.read[i] 	 || modelService.getProperties().blank).slice(0, tapes + 1)
					newTransition.write		= _.times(tapes, i => t.write[i]	 || modelService.getProperties().blank).slice(0, tapes + 1)
					console.log(newTransition)
					modelService.addTransition(newTransition)
					return newTransition
				})
				modelService.setTapes(tapes)
			},
			undo() {
				newTransitions.forEach(t => modelService.removeTransition(t))
				oldTransitions.forEach(t => modelService.addTransition(t))
				modelService.setTapes(oldTapes)
			}
		}
	}

	export const changeTransition = (transition: Transition, tape: number, partial: Partial<SimpleTransition>) => (modelService: IModelHandlerService): ICommand => {
		let oldTransition: SimpleTransition
		return {
			comment: "change transition",
			execute() {
				oldTransition = modelService.getTransitionTape(transition, tape)
				modelService.changeTransition(transition, tape, { ...oldTransition, ...partial })
			},
			undo() {
				modelService.changeTransition(transition, tape, oldTransition)
			}
		}
	}

}