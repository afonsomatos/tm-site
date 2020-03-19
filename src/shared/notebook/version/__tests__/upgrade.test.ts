import "jest"
import path from "path"
import fs from "fs"

import * as v0 from "../v0"
import * as v1 from "../v1"

function parseJson(filename: string): any {
	return JSON.parse(
		fs.readFileSync(path.resolve(__dirname, filename), "utf8")
	)
}

describe("upgrade", () => {

	test("0 -> 1", async () => {

		let version0: v0.Notebook 	= parseJson("v0.json")
		let expected: v1.Notebook   = parseJson("v1.json")

		let actual = v1.upgrade(version0 as v0.Notebook)

		expect(actual).toEqual(expected)
	})

})
