import * as v0 from "./v0"

export type Notebook = Omit<v0.Notebook, 'version' | 'models'> & { version: 1, models: Model[] }
export type Model = Omit<v0.Model, 'transitions'> & { tapes: number, transitions: Transition[] }
export type Transition = Omit<v0.Transition, 'read' | 'direction' | 'write'> & {
	direction: v0.Direction[],
	read: string[],
	write: string[],
}

export * from "./v0"