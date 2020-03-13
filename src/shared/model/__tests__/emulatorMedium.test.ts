import "jest"
import fs from "fs"
import path from "path"
import _ from "lodash"
import { parseFromEmulator } from "../emulatorMedium"

function parse(filename: string) {
	let content = fs.readFileSync(path.resolve(__dirname, filename), "utf8")
	let model = parseFromEmulator(content)
	return {
		labels: model.states.map(x => x.label),
		transitions: model.transitions.length,
		characters: _.flatMap(model.transitions.map(x => x.read.concat(x.write))),
		tapes: model.tapes
	}
} 

describe("multi tape", () => {

	test("0n1n-2fitas", () => {

		let { labels, transitions, characters, tapes } = parse("0n1n-2fitas")

		expect(labels).toEqual(expect.arrayContaining(["A", "B", "halt-accept", "halt-reject"]))
		expect(transitions).toBe(6)
		expect(characters).toEqual(expect.arrayContaining([ "0", "1", "_"]))
		expect(tapes).toBe(2)

	})

	test("turingmachines(3fitas)", () => {

		let { labels, transitions, characters, tapes } = parse("turingmachines(3fitas)")

		expect(labels).toEqual(
			expect.arrayContaining([
				"q0", "q1", "trans1", "trans1ok", "trans",
				"move", "simb1ok", "simb1", "simb2", "simb2ok",
				"halt-accept", "halt-reject"
			])
		)
		expect(transitions).toBe(42)
		expect(characters).toEqual(expect.arrayContaining([ "0", "1", "_"]))
		expect(tapes).toBe(3)
	
	})

})

describe("simple", () => {
	test("all", () => {
		
		let { labels, transitions, characters } = parse("all")
		
		expect(labels).toEqual(expect.arrayContaining(["q0", "back", "halt-accept"]))
		expect(transitions).toBe(6)
		expect(characters).toEqual(expect.arrayContaining([ "0", "1", "_"]))
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