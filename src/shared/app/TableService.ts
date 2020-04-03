import { ITableService } from "./ITableService"
import { IApplication } from "./IApplication"
import { ITableStore, Mode } from "./store"
import { State, Transition, Type } from "../model"
import { Command, ModelService } from "./modelService"
import Table from "../Table"
import { IModelHandlerService } from "./IModelService"
import { ICommand, complexCommand } from "../command"
import { Direction } from "../types"

export class TableService implements ITableService {

	private state: State
	private table: Table
	private char: string
	private transition: Transition

	constructor(
		private store: ITableStore,
		private app: IApplication
	) {

	}

	renameState(name: string) {
		this.app.modelService.execute(
			Command.changeState(this.state, { label: name })
		)
	}

	setStateType(type: Type) {
		this.app.modelService.execute(
			Command.editStateType(this.state, type)
		)
	}

	availableChar(char: string) {
		return this.app.modelService
			.getModel().allTransitions
			.findIndex(t => t.read[0] === char) === -1
	}

	setTable(table: Table) {
		this.table = table
	}

	setMode(mode: Mode) {
		this.store.mode = mode
	}

	setTransition(transition: Transition) {
		this.transition = transition
		this.store.transition = transition
		this.setMode(Mode.Transition)
	}

	setState(state: State) {
		this.state = state
		this.store.state = state
		this.setMode(Mode.State)
	}

	setChar(char: string) {
		this.char = char
		this.store.char = char
		this.setMode(Mode.Char)
	}

	deleteState() {
		this.app.modelService.execute(Command.removeState(this.state))
		this.setState(null)
		this.update()
	}

	addState() {
		this.app.modelService.execute(
			Command.addState({
				label: "New state",
				position: { x: 0, y: 0}
			})
		)
		this.update()
	}

	deleteChar() {
		this.app.modelService.execute(
			deleteCharCommand(this.char)
		)
		this.setMode(null)
		this.update()
	}

	renameChar(newChar: string) {
		this.app.modelService.execute(
			renameCharCommand(newChar)
		)
		this.update()
		this.setChar(newChar)
	}

	addChar() {
		this.app.modelService.execute(
			addCharCommand
		)
		this.update()
		this.setMode(null)
	}

	update() {
		this.table.update()
	}

}

const addCharCommand = (modelService: IModelHandlerService): ICommand => {
	const model = modelService.getModel()
	const characters = new Set(model.allTransitions.map(t => t.read[0]))
	let i = 60;
	while (characters.has(String.fromCharCode(++i)));
	const char = String.fromCharCode(i)
	return complexCommand(
		modelService.getModel().states
			.map(s => Command.addTransition({
				from: s,
				to: s,
				undefined: true,
				direction: [Direction.Right],
				read: [char],
				write: [char]
			})(modelService))
	)
}

const deleteCharCommand = (char: string) => (modelService: IModelHandlerService): ICommand => {
	let deletedTransitions: Array<Transition>
	return {
		comment: "delete char",
		execute() {
			deletedTransitions = modelService.getModel().allTransitions.filter(t => t.read[0] === char)
			deletedTransitions.forEach(t => modelService.removeTransition(t))
		},
		undo() {
			deletedTransitions.forEach(t => modelService.addTransition(t))
		}
	}
} 

const renameCharCommand = (char: string) => (modelService: IModelHandlerService): ICommand => {
	return complexCommand(
		modelService.getModel()
			.allTransitions
			.filter(t => t.read[0] === char)
			.map(t => Command.changeTransition(t, 0, { read: char })(modelService))
	)
}