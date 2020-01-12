import Notebook from "@/shared/notebook"
import example from "@/shared/model/example"

export default () => {

	let notebook = new Notebook()

	for (let i = 0; i < 5; ++i) {
		notebook.models.push(example())
	}

	return notebook
}