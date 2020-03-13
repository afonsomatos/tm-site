/**
 * This parser parses turing machines described with the syntax from
 * http://morphett.info/turing/turing.html
 */

import { Model, State, Transition, Type } from "@/shared/model"
import { Direction } from "@/shared/types"

const removeCommentAndEmptyLines = /^[^;%]*/
const extractTokens = /^ *([^ ]+) +([^ ]) +([^ ]) +([lr\*]) +([^ ]+) *$/

const directions = {
	"r": Direction.Right,
	"l": Direction.Left,
	"*": Direction.Stay
}

const acceptLabel = "halt-accept"
const rejectLabel = "halt-reject"

class EmulatorParser {

	private model = new Model()
	private labelToState = new Map<String, State>()

	/**
	 * Create a new transition if it does not exist. 
	 */
	createTransition(from: State, read: string, write: string, direction: Direction, to: State) {
		const transition: Transition = {
			from,
			to,
			direction,
			read: read,
			write: write,
		}
		this.model.addTransition(transition)
		this.model.normalize()
	}

	/**
	 * Create a new state if it does not exist. 
	 */
	createState(label: string): State {
		if (!this.labelToState.has(label)) {
			let newState = {
				label,
				position: {
					x: 0,
					y: 0
				}
			}
			this.labelToState.set(label, newState)
			this.model.addState(newState)

			if (label === acceptLabel) {
				this.model.setType(newState, Type.Accept)
			} else if (label === rejectLabel) {
				this.model.setType(newState, Type.Reject)
			} else if (this.labelToState.size === 1) {
				this.model.setType(newState, Type.Start)
			}
		}
		return this.labelToState.get(label)
	}

	/**
	 * Parses a bunch of lines according to the alternative syntax.
	 * Spits out `null` if it could not parse correctly. Otherwise, the constructed model. 
	 */
	parse(text: string): Model | null {

		let lines = text.split("\n")

		for (let line of lines) {
			
			// Remove comments & left/right whitespace
			let str = line.match(removeCommentAndEmptyLines)[0].trim()
			if (str.length === 0) continue
			
			// Get tokens
			let obj = str.match(extractTokens)
			if (obj === null)
				return null
	
			let [ _, from, read, write, direction, to ] = obj

			let modelFrom = this.createState(from)
			let modelTo = this.createState(to)
			let modelDir = directions[direction]

			this.createTransition(modelFrom, read, write, modelDir, modelTo)
		}

		this.setPositions()

		return this.model
	}

	/**
	 * Arrange positions of the model states.
	 */
	setPositions() {
		const states = this.model.states
		const slice = 2 * Math.PI / states.length
		const radius = 150 * states.length / 5
		
		let angle = 0
		for (let state of states) {
			state.position = {
				x: Math.cos(angle) * radius,
				y: Math.sin(angle) * radius
			}
			angle += slice
		}
	}
}

/**
 * This is a parser from the emulator-like syntax.
 */
export function parseFromEmulator(text: string): Model | null {
	return new EmulatorParser().parse(text)
}