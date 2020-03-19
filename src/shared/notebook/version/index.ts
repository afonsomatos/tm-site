import _ from "lodash"
import * as v0 from "./v0"
import * as v1 from "./v1"

type Notebook = v0.Notebook | v1.Notebook

const upgradeChain: {
	[version: number]: (arg: Notebook) => Notebook
} = {
	[0]: v1.upgrade,
	[1]: _.identity
}

/**
 * Upgrades a serialized notebook from an older version
 * @param notebook Current serialized notebook
 * @param target Version of the target
 */
export function upgrade(notebook: Notebook, target: number): Notebook {
	if (notebook.version >= target)
		return notebook

	if (!(target in upgradeChain))
		throw new Error("Version not supported: " + target)

	return upgrade(upgradeChain[notebook.version](notebook), target)
}