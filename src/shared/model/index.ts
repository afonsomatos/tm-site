import _ from "lodash"

import { Vector, Direction } from "@/shared/types"
import * as v1 from "@/shared/notebook/version/v1" 

export interface State {
	position: Vector,
	label: string,
}

export interface Link {
	from: State,
	to: State
}

export type Transition = Link & {
	direction: Direction[],
	read: string[],
	write: string[],
	undefined?: boolean,
}

export enum Type {
	Start = "start",
	Normal = "normal",
	Accept = "accept",
	Reject = "reject"
}

export class Model {

	name: string = "Model"
	tapes: number = 1

	private _states: Set<State>
	private _transitions: Set<Transition>
	private _start: State
	
	accept: Set<State>
	reject: Set<State>

	/**
	 * Returns a copy of the original states.
	 */
	public get states() {
		return Array(...this._states)
	} 

	/**
	 * Returns which node is the entry point.
	 */
	public get start() {
		return this._start
	}

	/**
	 * Sets a new start node.
	 */
	public set start(state: State) {
		this._start = state
	}

	/**
	 * Returns a copy of the original transitions.
	 */
	public get transitions() {
		// Only give away defined transitions
		return this.allTransitions.filter(t => !t.undefined)
	}

	/**
	 * Returns a copy of all (including undefined) transitions.
	 */
	public get allTransitions() {
		return Array(...this._transitions)
	}

	/**
	 * Returns all links that exist.
	 */
	public get links(): Link[] {
		let links = this.transitions.map(t => {
			return { from: t.from, to: t.to }
		})
		return _.uniqWith(links, _.isEqual)
	}

	public constructor() {
		// Initialize structures
		this._states = new Set()
		this._transitions = new Set()
		
		this.reject = new Set()
		this.accept = new Set()
	}


	/**
	 * Configures the current model, so that the given state has a certain type. 
	 */
	public setType(state: State, type: Type) {
		// Make state normal
		this.reject.delete(state)
		this.accept.delete(state)

		if (this.start === state) {
			this.start = null
		}

		switch (type) {
			case Type.Accept:
				this.accept.add(state)
				break
			case Type.Reject:
				this.reject.add(state)
				break
			case Type.Start:
				this.start = state
				break
		}
	}

	/**
	 * Given a state returns the type of the state, given the current model. 
	 */
	public getType(state: State): Type {
		
		if (this._start === state) {
			return Type.Start
		} else if (this.reject.has(state)) {
			return Type.Reject
		} else if (this.accept.has(state)) {
			return Type.Accept
		}
		return Type.Normal
	}

	public addState(state: State) {
		this._states.add(state)
	}

	/**
	 * Returns all transitions with a certain link. 
	 */
	public linkToTransitions(link: Link): Transition[] {
		return this.transitions.filter(x => {
			return x.from === link.from && x.to === link.to
		})
	}

	/**
	 * Removes a state and all transitions associated with this state. 
	 */
	public removeState(state: State): boolean {
		// Remove all transitions that have this state
		for (let t of this.transitions) {
			if (t.from === state || t.to === state) {
				this._transitions.delete(t)
			}
		}
		return this._states.delete(state)
	}

	public areLinked(from: State, to: State): boolean {
		return this.transitions.some(t => t.from == from && t.to == to)
	}

	/**
	 * Removes all duplicate transitions from end to beginning.
	 */
	public normalize() {
		this._transitions = new Set(_.uniqWith(
			Array(...this._transitions).reverse(),
			(t1, t2) => _.isEqual(t1.read, t2.read) && _.isEqual(t1.from, t2.from)
		))

		this._transitions.forEach(t => {

			_.times(this.tapes - t.direction.length, () => {
				t.direction.push(Direction.Right)
			})

			_.times(this.tapes - t.read.length, () => {
				t.read.push("#")
			})

			_.times(this.tapes - t.write.length, () => {
				t.write.push("#")
			})

			t.direction.splice(this.tapes)
			t.read.splice(this.tapes)
			t.write.splice(this.tapes)
		})

	}

	public addTransition(transition: Transition) {
		
		if (!this._states.has(transition.from) || !this._states.has(transition.to)) {
			console.log("Need to add from/to states before transition.")
			return
		}

		// TODO: check repeated transitions!

		this._transitions.add(transition)
	}

	public removeTransition(transition: Transition): boolean {
		return this._transitions.delete(transition)
	}

	/**
	 * Constructs a model based on a json-friendly object.
	 */
	public static fromJSONType(modelJSON: v1.Model): Model {

		let model = new Model()
	
		// Load states
		model._states = new Set(Object.values(modelJSON.states))
		
		// Load transitions
		for (let transition of modelJSON.transitions) {
			model._transitions.add({
				from: modelJSON.states[transition.from],
				to: modelJSON.states[transition.to],
				read: transition.read,
				direction: transition.direction,
				undefined: transition.undefined,
				write: transition.write
			})
		}
		
		model._start = modelJSON.states[modelJSON.start]
		model.accept = new Set(
			modelJSON.accept.map(i => modelJSON.states[i])
		)
		model.reject = new Set(
			modelJSON.reject.map(i => modelJSON.states[i])
		)

		model.name = modelJSON.name
		model.tapes = modelJSON.tapes

		return model
	}

	/**
	 * Converts this model to a json-friendly object.
	 */
	public toJSONType(): v1.Model {

		let states: v1.State[] = this.states
		let transitions = this.allTransitions.map(t => {
			return {
				read: t.read,
				write: t.write,
				undefined: t.undefined,
				direction: t.direction,
				from: states.indexOf(t.from),
				to: states.indexOf(t.to)
			} as v1.Transition
		})

		let start: number = states.indexOf(this.start)
		let reject = [...this.reject].map(s => states.indexOf(s))
		let accept = [...this.accept].map(s => states.indexOf(s))

		let model: v1.Model = {
			states,
			transitions,
			start,
			reject,
			accept,
			name: this.name,
			tapes: this.tapes,
		}

		return model
	}

}
