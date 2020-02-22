import { Model } from "@/shared/model"
import ModelJSON from "@/shared/model/jsonType"

export interface NotebookJSON {
	version: number,
	name: string,
	models: ModelJSON.Model[],
	wildcard?: string,
	blank: string
}

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
			version: 0,
			name: this.name,
			wildcard: this.wildcard,
			blank: this.blank,
			models: [...this.models].map(x => x.toJSONType())
		} as NotebookJSON, null, 4)
	}

	public static unserialize(json: string): Notebook {
		let notebook = new Notebook()
		let notebookJSON = JSON.parse(json) as NotebookJSON

		notebook.name = notebookJSON.name
		notebook.models = notebookJSON.models.map(Model.fromJSONType)
		notebook.wildcard = notebookJSON.wildcard

		// Convert from older versions here

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

