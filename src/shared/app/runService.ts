import { IRunStore } from "./store"
import { Status } from "./types"
import simulator from "@/shared/simulator"

export interface IRunService {
	sync(): void
	play(): void
	pause(): void
	step(): void
	back(): void
	reset(): void
	load(input: string[]): void
}

const NO_STATE = "~"

export class RunService implements IRunService {
	constructor(
		private runStore: IRunStore
	) {

	}

	sync() {
		if (simulator.turing.finished) {
			this.runStore.playing = false
		}

		
		let { time, space, state } = simulator.turing.snapshot
		this.runStore.info = {
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

		this.runStore.status = status
	}

	reset() {
		this.runStore.playing = false
		simulator.reset()
	}

	load(input: string[]) {
		this.runStore.playing = false
		simulator.load(input)
	}

	step() {
		this.runStore.playing = false
		simulator.step()
	}

	play() {
		this.runStore.playing = true
		simulator.play()
	}

	pause() {
		this.runStore.playing = false
		simulator.pause()
	}

	back() {
		this.runStore.playing = false
		simulator.back()
	}
}