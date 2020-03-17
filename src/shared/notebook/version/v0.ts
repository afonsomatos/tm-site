import Base from "./base"
import * as v1 from "./v1"

export interface Notebook extends Base {
	version: 0,
	name: string,
	wildcard?: string,
	models: Model[],
	blank: string
}

export enum Direction {
    Left = "L",
    Right = "R",
    Stay = "S"
}

export interface Vector {
    x: number,
    y: number
}

export interface State {
	position: Vector,
	label: string,
}

export interface Link {
	// State index
	from: number,
	to: number
}

export type Transition = Link & {
	direction: Direction,
	read: string,
	write: string,
	undefined?: boolean
}

export interface Model {
	name: string,
	states: Record<number, State>,
	transitions: Transition[],
	start: number,
	reject: number[],
	accept: number[]
}

export function upgrade(oldNotebook: Notebook): v1.Notebook {

	let newNotebook = oldNotebook as any
	newNotebook.models.forEach((model: any) => {
		model.tapes = 1
		model.blank = oldNotebook.blank
		model.wildcard = oldNotebook.wildcard
		model.transitions.forEach((t: any) => {
			t.read = [t.read]
			t.write = [t.write]
			t.direction = [t.direction]
		})
	})

	newNotebook.version = 1
	return newNotebook as v1.Notebook
}