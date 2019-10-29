import _ from "lodash"

import { Vector, Direction } from "@/shared/types"

export interface State {
	position: Vector,
	label: string,
}

export interface Link {
	from: State,
	to: State
}

export type Transition = Link & {
	direction: Direction,
	read: string,
	write: string,
}

export class Model {

	_states: Set<State>
	_transitions: Set<Transition>

	/**
	 * Returns a copy of the original states.
	 */
	public get states() {
		return Array(...this._states)
	} 

	/**
	 * Returns a copy of the original transitions.
	 */
	public get transitions() {
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

}