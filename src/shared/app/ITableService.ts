import Table from "../Table";
import { State, Transition, Type } from "../model";
import { Mode } from "./store";
import { Direction } from "../types";

export interface ITableService {
	update(): void
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
	setWrite(char: string): void
	setUndefined(value: boolean): void
	setDirection(dir: Direction): void
}