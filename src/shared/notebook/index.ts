import { Model } from "@/shared/model"
import ModelJSON from "@/shared/model/jsonType"

export interface NotebookJSON {
	name: string,
	models: ModelJSON.Model[]
}

/**
 * Compiles multiple models.
 */
export default class Notebook {
	
	name: string = "Example Notebook"
	models: Model[] = []

	public serialize(): string {
		return JSON.stringify({
			name: this.name,
			models: [...this.models].map(x => x.toJSONType())
		}, null, 4)
	}

	public static unserialize(json: string): Notebook {
		let notebook = new Notebook()
		let notebookJSON = JSON.parse(json) as NotebookJSON

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

