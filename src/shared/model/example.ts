import { Model } from "@/shared/model"
import { Direction } from "@/shared/types"

export default () => {
	let model = new Model();

	let a = {
		label: "a",
		position: {x: 100, y: 200}
	}

	let b = {
		label: "b",
		position: {x: 300, y: 200}
	}

	let c = {
		from: a,
		to: b,
		direction: Direction.Left,
		read: "1",
		write: "0"
	}

	let d = {
		from: b,
		to: a,
		direction: Direction.Left,
		read: "1",
		write: "2"
	}
	
	model.addState(a)
	model.addState(b)

	model.start = a

	model.addTransition(c)
	model.addTransition(d)

	return model;
}
