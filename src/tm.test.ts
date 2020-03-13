import "jest"
import {
	Direction,
	Program,
	Turing,
} from "./tm"


describe("Simple machine", () => {

	// Reads a sequence of three 1s
	const program: Program = {
		empty: "#",
		states: 2,
		start: 0,
		accept: [1],
		reject: [],
		transitions: [
			{ from: 0, read: ["1"], write: ["1"], to: 0, direction: [Direction.Right] },
			{ from: 0, read: ["#"], write: ["#"], to: 1, direction: [Direction.Right] }
		]
	}

	let turing: Turing = null

	beforeEach(() => {
		turing = new Turing()
		turing.setProgram(program)
	})

	test("basic machine", () => {
		
		turing.load(["111"])

		while (turing.next())
			;

		expect(turing.snapshot)
			.toMatchObject({
				time: 4,
				space: 5,
				head: [4],
				state: 1,
				tape: [{
					0: '1',
					1: '1',
					2: '1',
					3: '#'
				}]
			})

		expect(turing.accepted).toBe(true)
	})

	test("reset", () => {

		turing.load(["111"])
		while (turing.next())
			;

		turing.reset()

		expect(turing.snapshot)
			.toMatchObject({
				head: [0],
				time: 0,
				tape: [{}],
				state: program.start
			})

	})

	test("reject example", () => {
		
		turing.load(["110"])
		while (turing.next())
			;

		expect(turing.snapshot)
			.toMatchObject({
				head: [2],
				time: 2,
				tape: [{ 0: '1', 1: '1' }],
			})

		expect(turing.undefined).toBe(true)
	})

})

describe("Multi-tape", () => {

	test("Lots of wildcards", () => {

		const program: Program = {
			empty: "#",
			states: 2,
			start: 0,
			accept: [1],
			reject: [],
			wildcard: "*",
			transitions: [
				{ from: 0, read: ["1", "*", "*"], write: ["A", "A", "A"], to: 0, direction: [Direction.Right, Direction.Right, Direction.Right] },
				{ from: 0, read: ["1", "1", "*"], write: ["B", "B", "B"], to: 1, direction: [Direction.Right, Direction.Right, Direction.Right] },
			]
		}


		let turing = new Turing(3)
		turing.setProgram(program)
		turing.load([
			"1",
			"1",
			"1"
		])

		while (turing.next()) {}
	
		expect(turing.snapshot).toMatchObject({
			time: 1,
			space: 6,
			state: 1,
			head: [1, 1, 1],
			tape: [
				{ 0: "B" },
				{ 0: "B" },
				{ 0: "B" }
			]	
		})
	})

	test("Wildcards", () => {

		const program: Program = {
			empty: "#",
			states: 2,
			start: 0,
			accept: [1],
			reject: [],
			wildcard: "*",
			transitions: [
				{ from: 0, read: ["1", "*"], write: ["A", "B"], to: 0, direction: [Direction.Right, Direction.Right] },
				{ from: 0, read: ["*", "*"], write: ["C", "D"], to: 0, direction: [Direction.Right, Direction.Right] },
				{ from: 0, read: ["#", "#"], write: ["#", "#"], to: 1, direction: [Direction.Right, Direction.Right] }
			]
		}

		let turing = new Turing(2)
		turing.setProgram(program)
		turing.load([
			"121",
			"222"
		])

		while (turing.next())
			;

		expect(turing.snapshot).toMatchObject({
			time: 4,
			space: 10,
			state: 1,
			head: [4, 4],
			tape: [
				{ 0: "A", 1: "C", 2: "A", 3: "#" },
				{ 0: "B", 1: "D", 2: "B", 3: "#" }
			]	
		})

	})

	test("No wildcards", () => {

		// Reads a sequence of three 1s, 2s and 3s (one sequence for each tape)
		const program: Program = {
			empty: "#",
			states: 2,
			start: 0,
			accept: [1],
			reject: [],
			transitions: [
				{ from: 0, read: ["1", "2", "3"], write: ["1", "2", "3"], to: 0, direction: [Direction.Right, Direction.Right, Direction.Right] },
				{ from: 0, read: ["#", "#", "#"], write: ["#", "#", "#"], to: 1, direction: [Direction.Right, Direction.Right, Direction.Right] }
			]
		}


		let turing = new Turing(3)
		turing.setProgram(program)
		turing.load(["111", "222", "333"])

		while (turing.next())
			;

		expect(turing.snapshot)
			.toMatchObject({
				time: 4,
				space: 15,
				head: [4, 4, 4],
				state: 1,
				tape: [{
					0: '1',
					1: '1',
					2: '1',
					3: '#'
				}, {
					0: '2',
					1: '2',
					2: '2',
					3: '#',
				}, {
					0: '3',
					1: '3',
					2: '3',
					3: '#'
				}]
			})

		expect(turing.accepted).toBe(true)
	})

})
