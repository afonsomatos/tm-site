import "jest"
import path from "path"
import fs from "fs"
import * as v0 from "../v0"

function parseJson(filename: string): any {
	return JSON.parse(
		fs.readFileSync(path.resolve(__dirname, filename), "utf8")
	)
}

describe("upgrade", () => {

	test("version 0", async () => {

		let version0: v0.Notebook 	= parseJson("v0.json")
		let expected: any			= parseJson("v1.json")

		let actual = v0.upgrade(version0 as v0.Notebook)

		expect(actual).toEqual(expected)
	})

})
