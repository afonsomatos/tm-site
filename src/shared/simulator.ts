// Just using Vue as an event-bus
import Vue from "vue"

import { Model, State } from "@/shared/model"
import { Snapshot, Program, Turing } from "@/tm"
import { Direction } from "./types"

/**
 * Events that happen within the simulator.
 */
export enum Event {
	PLAY = "play",
	STOP = "stop",
	TRANSITION = "transition",
	UPDATE = "update",
	RESET = "reset",
	BACK = "back"
}

const directionOffset = {
	[Direction.Left]: -1,
	[Direction.Right]: 1,
	[Direction.Stay]: 0
}

/**
 * Converts a model to a program.
 */
class ProgramConverter {

	/**
	 * Converted program.
	 */
	program: Program

	/**
	 * Original model.
	 */
	model: Model

	constructor(model: Model) {
		this.model = model

		this.program = {
			empty: "#",
			transitions: [],
			
			// The identifier of each state will be its index
			accept: [...model.accept].map(x => this.stateId(x)),
			reject: [...model.reject].map(x => this.stateId(x)),

			start: this.stateId(model.start),
			states: model.states.length
		}

		for (let transition of model.transitions) {
			this.program.transitions.push({
				direction: directionOffset[transition.direction],
				read: transition.read,
				write: transition.write,
				from: this.stateId(transition.from),
				to: this.stateId(transition.to),
			})
		}
	}

	/**
	 * Given a state identifier, returns its raw model form. 
	 */
	state(id: number): State {
		return this.model.states[id]
	}

	/**
	 * The identifier of each state will be its index. 
	 */
	stateId(state: State): number {
		return this.model.states.indexOf(state)
	}

}

/**
 * Simulates a running turing machine.
 */
class Simulator {

	/**
	 * Time waited between steps.
	 */
	interval: number = 1000

	/**
	 * Old snapshots of the simulator. Used for going back.
	 */
	history: Snapshot[]

	/**
	 * Last used input.
	 */
	input: string = ''

	/**
	 * Transitions and states.
	 */
	model: Model

	/**
	 * The interval identifier for the simulator. 
	 */
	timer: number

	/**
	 * Backend turing machine.
	 */
	turing: Turing = new Turing()

	/**
	 * Event-bus.
	 */
	bus: Vue = new Vue()

	/**
	 * Converts between a program and model. 
	 */
	converter: ProgramConverter

	/**
	 * Sets the model used in the simulator. This function converts the model to a turing program. 
	 */
	public setModel(model: Model) {
		this.model = model
		this.converter = new ProgramConverter(model)
		this.turing.setProgram(this.converter.program)
	}

	/**
	 * Prepare tape.
	 */
	public load(input: string) {
		this.input = input
		this.reset()
	}

	/**
	 * Finish 
	 */
	public reset() {
		this.history = []
		clearInterval(this.timer)
		this.setModel(this.model)
		this.turing.reset()
		this.turing.load(this.input)
		this.bus.$emit(Event.RESET)
		this.bus.$emit(Event.UPDATE)
	}

	/**
	 * Takes the next transition.
	 */
	public step() {

		// Don't take steps if already finished
		if (this.turing.finished) {
			return
		}

		this.history.push(this.turing.snapshot)

		let transition = this.turing.next()
		this.bus.$emit(Event.TRANSITION, transition)

		// If just finished, stop
		if (this.turing.finished) {
			clearInterval(this.timer)
		}

		this.bus.$emit(Event.UPDATE)
	}
	
	/**
	 * Rolls back state of the tape before the last transition.
	 */
	public back() {
		// If there are no previous states, do nothing
		if (this.history.length === 0)
			return

		this.turing.rollBack(this.history.pop())
		this.pause()
		this.bus.$emit(Event.BACK)
	}

	/**
	 * Clears timer for taking steps.
	 */
	public pause() {
		clearInterval(this.timer)
		this.bus.$emit(Event.UPDATE)
	}

	/**
	 * Sets a constant timer for taking steps.
	 */
	public play() {
		this.pause()
		this.timer = window.setInterval(() => this.step(), this.interval)
	}

}

export default new Simulator()