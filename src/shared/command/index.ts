import _ from "lodash"

export interface ICommand {
	comment?: string
	execute(): void
	undo(): void
}

export function complexCommand(commands: Array<ICommand>, comment?: string): ICommand {
	return {
		execute: () => _.forEach(commands, x => x.execute()),
		undo:	 () => _.forEachRight(commands, x => x.undo()),
		comment: comment || commands.map(x => x.comment).join(" > ")
	}
}

export interface IInvoker {
	execute(command: ICommand): void
	redo(): void
	undo(): void
}

export class Invoker implements IInvoker {

	private undoStack: ICommand[] = []
	private redoStack: ICommand[] = [] 

	execute(command: ICommand): void {
		// console.log(`[execute] ${command.comment}`)
		this.undoStack.push(command)
		this.redoStack = []
		command.execute()
	}

	redo(): void {
		let command = _.last(this.redoStack)
		if (command) {
			this.redoStack.pop()
			// console.log(`[redo] ${command.comment}`)
			command.execute()
			this.undoStack.push(command)
		}
	}

	undo(): void {
		let command = _.last(this.undoStack)
		if (command) {
			this.undoStack.pop()
			// console.log(`[undo] ${command.comment}`)
			command.undo()
			this.redoStack.push(command)
		}
	}
}