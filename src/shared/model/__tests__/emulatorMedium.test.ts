import "jest"
import { parseFromEmulator } from "../emulatorMedium"
import fs from "fs"
import path from "path"
import _ from "lodash"

function parse(filename: string) {
	let content = fs.readFileSync(path.resolve(__dirname, filename), "utf8")
	let model = parseFromEmulator(content)
	return {
		labels: model.states.map(x => x.label),
		transitions: model.transitions.length,
		characters: _.flatMap(model.transitions.map(x => [x.read, x.from]))
	}
} 

describe("simple", () => {
	test("all", () => {
		
		let { labels, transitions, characters } = parse("all")
		
		expect(labels).toEqual(expect.arrayContaining(["q0", "back", "halt-accept"]))
		expect(transitions).toBe(6)
		expect(characters).toEqual(expect.arrayContaining(["0", "1", "_"]))
	})
	
	test("pow2", () => {
		
		let { labels, transitions, characters } = parse("pow2")
		
		expect(labels).toEqual(
			expect.arrayContaining([
				"start", "halt-reject", "one",
				"clean", "halt-accept", "back",
				"start", "stay"
			])
		)
		expect(transitions).toBe(15)
		expect(characters).toEqual(expect.arrayContaining(["#", "1", "_"]))
	})
})