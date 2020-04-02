import { Model, Type, Transition, State } from "../model";
import { ICommand } from "../command";

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
