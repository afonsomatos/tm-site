import "jest"
import {
	Direction,
	Program,
	Turing,
} from "./tm"

// Reads a sequence of three 1s
const program: Program = {
	empty: "#",
	states: 2,
	start: 0,
	accept: [1],
	reject: [],
	transitions: [
		{ from: 0, read: "1", write: "1", to: 0, direction: Direction.Right },
		{ from: 0, read: "#", write: "#", to: 1, direction: Direction.Right }
	]
}

test("basic machine", () => {
	

	let turing = new Turing()
	turing.setProgram(program)
	turing.load("111")

	while (turing.next())
		;

	expect(turing.snapshot)
		.toMatchObject({
			time: 4,
			space: 5,
			head: 4,
			state: 1,
			tape: {
				0: '1',
				1: '1',
				2: '1',
				3: '#'
			}
		})

	expect(turing.accepted).toBe(true)
})

test("reset", () => {

	let turing = new Turing()
	turing.setProgram(program)
	turing.load("111")
	while (turing.next())
		;

	turing.reset()

	expect(turing.snapshot)
		.toMatchObject({
			head: 0,
			time: 0,
			tape: {},
			state: program.start
		})

})

test("reject example", () => {
	
	let turing = new Turing()
	turing.setProgram(program)
	turing.load("110")
	while (turing.next())
		;

	expect(turing.snapshot)
		.toMatchObject({
			head: 2,
			time: 2,
			tape: { 0: '1', 1: '1' },
		})

	expect(turing.undefined).toBe(true)
})