import Table from "../Table";
import { State, Transition, Type } from "../model";
import { Mode } from "./store";

export interface ITableService {
	setTable(table: Table): void
	deleteState(): void
	addState(): void
	setState(state: State): void
	addChar(): void
	renameChar(char: string): void
	deleteChar(): void
	addState(): void
	setChar(char: string): void
	setState(state: State): void
	setTransition(transition: Transition): void
	setMode(mode: Mode): void
	availableChar(char: string): boolean


	renameState(name: string): void
	setStateType(type: Type): void

	setStateTo(state: State): void
}