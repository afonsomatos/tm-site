import "jest"
import { complexCommand, ICommand, Invoker } from "../"
import _ from "lodash"

test("complex command", () => {

	const n = 5
	let executeTrace = []
	let undoTrace = []
	let commands = _.times(n, i => ({
		execute: () => executeTrace.push(i),
		undo: () => undoTrace.push(i)
	} as ICommand))


	let complex = complexCommand(commands)
	complex.execute()
	expect(executeTrace).toEqual(_.times(n, i => i))

	complex.undo()
	expect(undoTrace).toEqual(_.times(n, i => i).reverse())
})

test("invoker", () => {

	let invoker = new Invoker()
	const n = 1000
	let executeTrace = []
	let undoTrace = []
	let commands = _.times(n, i => ({
		execute: () => executeTrace.push(i),
		undo: () => undoTrace.push(i)
	} as ICommand))

	commands.forEach(c => invoker.execute(c))
	expect(executeTrace).toEqual(_.times(n, i => i))

	_.times(n, () => invoker.undo())
	expect(undoTrace).toEqual(_.times(n, i => i).reverse())

	executeTrace = []
	_.times(n, () => invoker.redo())
	expect(executeTrace).toEqual(_.times(n, i => i))
})