import Base from "./base"

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