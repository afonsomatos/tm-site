import { Model } from "@/shared/model"
import { upgrade } from "./version"

import * as v1 from "@/shared/notebook/version/v1"

/**
 * Compiles multiple models.
 */
export default class Notebook {
	
	name: string = "Example Notebook"
	models: Model[] = []
	wildcard?: string
	blank: string = "#"

	public serialize(): string {
		return JSON.stringify({
			version: 1,
			name: this.name,
			wildcard: this.wildcard,
			blank: this.blank,
			models: [...this.models].map(x => x.toJSONType())
		} as v1.Notebook, null, 4)
	}

	public static unserialize(json: string): Notebook {

		let notebook = new Notebook()
		let notebookJSON = upgrade(JSON.parse(json), 1) as v1.Notebook

		notebook.name = notebookJSON.name
		notebook.wildcard = notebookJSON.wildcard
		notebook.models = notebookJSON.models.map(Model.fromJSONType)

		if (notebookJSON.blank !== undefined)
			notebook.blank = notebookJSON.blank

		return notebook
	}

	/**
	 * Maps each model in this notebook to a unique name.
	 */
	public modelUniqueName(model: Model): string {
		let i = this.models.indexOf(model)
		let repeated = this.models.slice(0, i).filter(m => m.name === model.name).length
		if (repeated == 0)
			return model.name
		else
			return `${model.name} [${repeated}]` 
	}

}

