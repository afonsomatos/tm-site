import _ from "lodash"
import { isEqualBy } from "@/shared/util"

/**
 * Direction taken within a transition.
*/
export enum Direction {
	Left = -1,
	Right = 1,
	Stay = 0
}

/**
 * Definition of a transition between two states.
 */
export interface Transition {

	/**
	 * Identifier of the coming state.
	 */
	from: number,
	
	/**
	 * Character read.
	 */
	read: string[],

	/**
	 * Character written.
	 */
	write: string[],

	/**
	 * Identifier of the next state.
	 */
	to: number,

	/**
	 * Direction taken.
	 */
	direction: Direction[]
}

export interface Program {

	/**
	 * Empty character.
	 */
	empty: string,

	/**
	 * Number of states.
	 */
	states: number,

	/**
	 * Identifier of the beginning state.
	 */
	start: number,

	/**
	 * Identifiers of the accept states.
	 */
	accept: number[],

	/**
	 * Identifiers of the reject states.
	 */
	reject: number[],

	/**
	 * Set of all transitions possible between states.
	 */
	transitions: Transition[],

	/**
	 * Wildcard character.
	 */
	wildcard?: string
}

/**
 * Stores the indexes and values of cells within a tape.
 * Same as using an array, but can have negative indexes.
 */
export type Tape = {
	[index: number]: string
}

/**
 * Has sufficient information for restoring a turing session.
 */
export type Snapshot = {
	head: number[],
	state: number,
	space: number,
	time: number,
	tape: Tape[],
	visited: Set<number>[],
}

export class Turing {

	/**
	 * Number of tapes.
	 */
	private tapes: number

	/**
	 * Visited cells.
	 */
	private visited: Set<number>[]

	/**
	 * Loaded program.
	 */
	private program: Program

	 /**
	 * Index of the tape currently pointed to.
	 */
	private head: number[]

	/**
	 * The tape itself, i.e indexes matched to strings.
	 */
	private tape: Tape[]

	/**
	 * Identifier of the current state.
	 */
	private state: number

	/**
	 * How many steps taken since start.
	 */
	private time: number

	/**
	 * How many cells visited since start (including load).
	 */
	private get space(): number {
		return _.sumBy(this.visited, x => x.size)
	}

	/**
	 * Returns whether the current state is an accepted state.
	 */
	public get accepted(): boolean {
		return this.program.accept.indexOf(this.state) !== -1
	}

	/**
	 * Returns whether the current state is a rejected state.
	 */
	public get rejected(): boolean {
		return this.program.reject.indexOf(this.state) !== -1
	}

	/**
	 * Returns whether there are no appropriate transitions.
	 */
	public get undefined(): boolean {
		return this.nextTransition === undefined
	}

	/**
	 * Returns whether there are no transitions left to take, i.e the machine has finished.
	 */
	public get finished(): boolean {
		return this.accepted || this.rejected || this.undefined
	}

	/**
	 * Returns the next transition to take.
	 */
	private get nextTransition(): Transition | undefined {
		
		// Get characters from each tape's head
		let currentHeads = this.tape.map((_, i) => this.get(i, this.head[i]))
		
		// Find all transitions that match
		let matches = this.program.transitions.filter(t => {
			return t.from === this.state &&
				isEqualBy(t.read, currentHeads, (a, b) => a === b || a === this.program.wildcard)
		})

		// Get the transition with the least wildcards
		let next = _.minBy(matches, match => {
			return match.read.filter(x => x === this.program.wildcard).length
		})

		return next
	}

	/**
	 * Takes a snapshot of the current state.
	 */
	public get snapshot(): Snapshot {
		return _.cloneDeep({
			head: this.head,
			state: this.state,
			tape: this.tape,
			visited: this.visited,
			space: this.space, 
			time: this.time
		})
	}

	constructor(tapes: number = 1, program?: Program) {
		this.tapes = tapes
		this.visited = _.times(tapes, () => new Set())
		this.tape = _.times(tapes, () => ({}))
		this.head = new Array(tapes).fill(0)
		this.time = 0
		this.state = 0
		this.program = program || {
			accept: [0, 1],
			empty: "#",
			reject: [2],
			start: 3,
			states: 5,
			transitions: []
		}
	}

	private get(tape: number, index: number): string {
		return this.tape[tape][index] || this.program.empty
	}

	public setProgram(program: Program) {
		this.program = program
	}

	public rollBack(snapshot: Snapshot) {
		this.head = _.cloneDeep(snapshot.head)
		this.state = snapshot.state
		this.tape = _.cloneDeep(snapshot.tape)
		this.visited = _.cloneDeep(snapshot.visited)
		this.time = snapshot.time
	}

	public reset() {
		this.tape = _.times(this.tapes, () => ({}))
		this.state = this.program.start
		this.head.fill(0)
		this.time = 0
		this.visited.map(() => new Set())
	}

	/**
	 * Writes a character for each next cell. 
	 */
	public load(inputs: string[]) {
		// Resets the whole tape
		this.reset()
		// Write `input` on tape
		for (let i = 0; i < this.tapes; ++i) {
			let head = this.head[i]
			let input = inputs[i]			
			for (let char of input) {
				this.visit(i, head)
				this.tape[i][head++] = char
			}
		}
	}

	/**
	 * Called when the machine visits a certain cell. It's used to keep track of the space taken. 
	 */
	private visit(tape: number, index: number): void {
		this.visited[tape].add(index)
	}
	
	/**
	 * Advances one step, and returns the transition taken.
	 * When using wildcards, it will return the transition with wildcards replaced, for example:
	 * * -> * and reads A, will return A -> A
	 */
    public next(): Transition | undefined {

		let transition = _.cloneDeep(this.nextTransition)
		if (this.finished || transition === undefined) {
			return
		}

		for (let i = 0; i < this.tapes; ++i) {

			if (transition.read[i] === this.program.wildcard) {
				transition.read[i] = this.get(i, this.head[i])
			
				if (transition.write[i] === this.program.wildcard) {
					transition.write[i] = transition.read[i]
				}
			}

			this.tape[i][this.head[i]] = transition.write[i]
			this.head[i] += transition.direction[i]
			this.visit(i, this.head[i])
		}

		this.time++
		this.state = transition.to

        return transition
    }
	/**
	 * Pretty-prints this turing machine.
	 */
    public show(length: number): string {
        const pointer = '^'
		const spacing = "  "

		let tapes = []
		
		for (let i = 0; i < this.tapes; ++i) {
			// Tape
			let tapeRow = Array(length).fill("").map((_val, i) => this.get(i, this.head[i] + i - length/2)).join(spacing)
			// Head pointer
			let headPointer = Array(length).fill(" ")
			headPointer[length / 2] = pointer
			let headRow = headPointer.join(spacing)
			tapes.push([tapeRow, headRow].join('\n'))
		}

		return tapes.join('\n')
	}
	
}