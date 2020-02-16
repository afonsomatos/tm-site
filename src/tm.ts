import _ from "lodash"

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
	read: string,

	/**
	 * Character written.
	 */
	write: string,

	/**
	 * Identifier of the next state.
	 */
	to: number,

	/**
	 * Direction taken.
	 */
	direction: Direction
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
	head: number,
	state: number,
	space: number,
	time: number,
	tape: Tape,
	visited: Set<number>,
}

export class Turing {

	/**
	 * Visited cells.
	 */
	private visited: Set<number>

	/**
	 * Loaded program.
	 */
	private program: Program

	 /**
	 * Index of the tape currently pointed to.
	 */
	private head: number

	/**
	 * The tape itself, i.e indexes matched to strings.
	 */
	private tape: Tape

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
		return this.visited.size
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
		return this.program.transitions.find(t => {
			return t.from === this.state && (t.read === this.get(this.head) || t.read === this.program.wildcard)
		})
	}

	/**
	 * Takes a snapshot of the current state.
	 */
	public get snapshot(): Snapshot {
		return {
			head: this.head,
			state: this.state,
			tape: _.clone(this.tape),
			visited: _.clone(this.visited),
			space: this.space, 
			time: this.time
		}
	}

	constructor() {
		this.visited = new Set()
		this.tape = {}
		this.head = 0
		this.time = 0
		this.state = 0
		this.program = {
			accept: [0, 1],
			empty: "#",
			reject: [2],
			start: 3,
			states: 5,
			transitions: []
		}
	}

	private get(index: number): string {
		return this.tape[index] || this.program.empty
	}

	public setProgram(program: Program) {
		this.program = program
	}

	public rollBack(snapshot: Snapshot) {
		this.head = snapshot.head
		this.state = snapshot.state
		this.tape = _.clone(snapshot.tape)
		this.visited = _.clone(snapshot.visited)
		this.time = snapshot.time
	}

	public reset() {
		this.tape = {}
		this.state = this.program.start
		this.head = 0
		this.time = 0
		this.visited = new Set()
	}

	/**
	 * Writes a character for each next cell. 
	 */
	public load(input: string) {
		// Resets the whole tape
		this.reset()
		// Write `input` on tape
		let head = this.head
		for (let char of input) {
			this.visit(head)
			this.tape[head++] = char
		}
	}

	/**
	 * Called when the machine visits a certain cell. It's used to keep track of the space taken. 
	 */
	private visit(index: number): void {
		this.visited.add(index)
	}
	
	/**
	 * Advances one step, and returns the transition taken.
	 * When using wildcards, it will return the transition with wildcards replaced, for example:
	 * * -> * and reads A, will return A -> A
	 */
    public next(): Transition | undefined {

		let transition = _.cloneDeep(this.nextTransition)
		if (this.finished ||transition === undefined) {
			return
		}

		if (transition.read === this.program.wildcard) {
			transition.read = this.get(this.head)

			if (transition.write === this.program.wildcard) {
				transition.write = transition.read
			}
		}

		this.time++
        this.tape[this.head] = transition.write
		this.state = transition.to
		this.head += transition.direction
		this.visit(this.head)
		
        return transition
    }
	/**
	 * Pretty-prints this turing machine.
	 */
    public show(length: number): string {
        const pointer = '^'
        const spacing = "  "
        // Tape
        let tapeRow = Array(length).fill("").map((_val, i) => this.get(this.head + i - length/2)).join(spacing)
        // Head pointer
        let headPointer = Array(length).fill(" ")
        headPointer[length / 2] = pointer
        let headRow = headPointer.join(spacing)

        return [tapeRow, headRow].join('\n')
	}
	
}