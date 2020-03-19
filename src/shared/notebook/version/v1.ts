import * as v0 from "./v0"

export type Notebook = {
	version: 1,
	name: string,
	models: Model[]
}
export type Model = Omit<v0.Model, 'transitions'> & { tapes: number, transitions: Transition[], wildcard?: string, blank: string }
export type Transition = Omit<v0.Transition, 'read' | 'direction' | 'write'> & {
	direction: v0.Direction[],
	read: string[],
	write: string[],
}

export * from "./v0"

export function upgrade(oldNotebook: v0.Notebook): Notebook {

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
	return newNotebook as Notebook
}