import { Model } from "@/shared/model"
import { Direction } from "@/shared/types"

export default () => {
	let model = new Model();

	let a = {
		label: "a",
		position: {x: 0, y: 0}
	}

	let b = {
		label: "b",
		position: {x: 200, y: 0}
	}

	let c = {
		from: a,
		to: a,
		direction: [Direction.Right],
		read: ["1"],
		write: ["1"]
	}

	let d = {
		from: a,
		to: b,
		direction: [Direction.Right],
		read: [model.blank],
		write: [model.blank]
	}
	
	model.addState(a)
	model.addState(b)

	model.start = a
	model.accept.add(b)

	model.addTransition(c)
	model.addTransition(d)

	return model;
}
