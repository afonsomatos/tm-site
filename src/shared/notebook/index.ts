import { Model } from "@/shared/model"
import { upgrade } from "./version"

import * as v1 from "@/shared/notebook/version/v1"

/**
 * Compiles multiple models.
 */
export default class Notebook {
	
	name: string = "Example Notebook"
	models: Model[] = []

	public serialize(): string {
		return JSON.stringify({
			version: 1,
			name: this.name,
			models: [...this.models].map(x => x.toJSONType())
		} as v1.Notebook, null, 4)
	}

	public static unserialize(json: string): Notebook {

		let notebook = new Notebook()
		let notebookJSON = upgrade(JSON.parse(json), 1) as v1.Notebook

		notebook.name = notebookJSON.name
		notebook.models = notebookJSON.models.map(Model.fromJSONType)

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

