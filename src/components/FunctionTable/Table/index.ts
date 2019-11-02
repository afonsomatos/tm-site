import { Model } from "@/shared/model"

export default class Table {

	/**
	 * Contains states and transitions to be represented.
	 */
	private _model: Model

	/**
	 * Contains the table.
	 */
	private _wrapper: HTMLElement

	constructor(wrapper: HTMLElement) {
		this._wrapper = wrapper

		this.update()
	}

	public set model(value: Model) {
		this._model = value
	}

	public update() {

	}
	
}