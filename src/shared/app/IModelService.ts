import { Model, Type, Transition, State, Link } from "../model";
import { ICommand } from "../command";
import { Vector, SimpleTransition } from "../types";

export interface IStateProperties {
	label: string,
	position: Vector
}

export interface IModelProperties {
	wildcard?: string,
	blank: string,
}

export interface IModelService {
	execute(cmd: (arg: IModelHandlerService) => ICommand): void
	undo(): void
	redo(): void
	setModel(model: Model): void
	getStateType(state: State): Type
	getModel(): Model
	getStartState(): State
	getTransitions(): Transition[]
	getDefaultTransition(link: Link): Transition
	getProperties(): IModelProperties
	getTapes(): number
	getTransitionTape(transition: Transition, tape: number): SimpleTransition
	changeTransitionPartial(transition: Transition, partial: Partial<Transition>): void
}

export interface IModelHandlerService extends IModelService {
	setStateType(state: State, type: Type): void
	removeState(state: State): void
	addState(state: State): void
	setStartState(state: State): void
	removeTransition(transition: Transition): void
	addTransition(transition: Transition): void
	setStateProperties(state: State, properties: IStateProperties): void
	getStateProperties(state: State): IStateProperties
	setProperties(partial: Partial<IModelProperties>): void
	setTapes(tapes: number): void
	changeTransition(transition: Transition, tape: number, edit: SimpleTransition): void
}