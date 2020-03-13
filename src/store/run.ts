import simulator from "@/shared/simulator"
import { Store } from "./types"

import _ from "lodash"

export enum Status {
	Accepted = "accepted",
	Rejected = "rejected",
	Normal = "normal",
	Undefined = "undefined"
}

interface Info {
	// How many steps performed
	time: number,
	// How many cells visited
	space: number,
	// Label of the current state
	state: string
}

export interface State {

	/**
	 * Whether the turing machine is playing.
	 */
	playing: boolean

	/**
	 * Status of the turing machine.
	 */
	status: Status,

	/**
	 * Info of the current running machine.
	 */
	info: Info
}

const NO_STATE = "~"

class Run implements Store<State> {
	
	state = {
		playing: false,
		status: Status.Normal,
		info: {
			time: 0,
			space: 0,
			state: NO_STATE
		}
	}

	set status(status: Status) {
		this.state.status = status
	}

	get status() {
		return this.state.status
	}

	set info(info: Info) {
		this.state.info = info
	}

	get info() {
		return _.clone(this.state.info)
	}

	set playing(playing: boolean) {
		this.state.playing = playing
	}

	get playing() {
		return this.state.playing
	}

	sync() {
		if (simulator.turing.finished) {
			this.playing = false
		}

		
		let { time, space, state } = simulator.turing.snapshot
		this.info = {
			time,
			space,
			state:  state === -1 ? NO_STATE : simulator.converter.state(state).label
		}

		let status = Status.Normal
		if (simulator.turing.rejected) {
			status = Status.Rejected
		} else if (simulator.turing.accepted) {
			status = Status.Accepted
		} else if (simulator.turing.undefined) {
			status = Status.Undefined
		}

		this.status = status
	}

	reset() {
		this.playing = false
		simulator.reset()
	}

	load(input: string[]) {
		this.playing = false
		simulator.load(input)
	}

	step() {
		this.playing = false
		simulator.step()
	}

	play() {
		this.playing = true
		simulator.play()
	}

	pause() {
		this.playing = false
		simulator.pause()
	}

	back() {
		this.playing = false
		simulator.back()
	}
}

export default new Run()