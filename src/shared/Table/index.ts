import * as d3 from "d3"
import _ from "lodash"

import { Model, State, Transition } from "@/shared/model"

export default class Table {

	/**
	 * Contains states and transitions to be represented.
	 */
	private _model: Model

	/**
	 * The table itself. The outmost wrapper.
	 */
	private _table: HTMLTableElement

	/**
	 * Characters read header.
	 */
	private _headerRow: HTMLTableRowElement

	/**
	 * Placeholder row. 
	 */
	private _bottomRow: HTMLTableRowElement

	/**
	 * Add column table cell button.
	 */
	private _addColumn: HTMLTableCellElement

	constructor(table: HTMLTableElement) {
		this._model = new Model()
		this._table = table

		let tableSelect = d3.select(this._table)

		this._headerRow = tableSelect.select<HTMLTableRowElement>(".header-row").node()
		this._bottomRow = tableSelect.select<HTMLTableRowElement>(".bottom-row").node()
		
		this._addColumn = d3.select(this._headerRow).select<HTMLTableCellElement>("td.right-cell").node()

		this.update()
	}

	public set model(value: Model) {
		this._model = value
		this.update()
	}

	public get model() {
		return this._model
	}

	private transitionsFrom(state: State) {
		return this._model.transitions.filter(transition => {
			return transition.from === state
		})
	}

	public update() {
		
		// All characters to read from will be represented as columns 
		let readCharacters = _.uniq(this._model.transitions.map(a => a.read))
		
		// Bind characters to headers
		let headers = d3.select(this._headerRow)
			.selectAll<HTMLTableCellElement, String>("td.header")
			.data(readCharacters)
		
		// Create and setup missing headers
		let newHeaders = headers.enter().append("td").classed("header", true)

		// Update all headers
		headers = newHeaders.merge(headers)
		headers.text(label => label)

		// Bind states to rows
		let rowWrappers = d3.select(this._table)
			.selectAll<HTMLTableSectionElement, State>("tbody.row-wrapper")
			.data(this._model.states)

		// Create and setup missing rows
		let newRowWrappers = rowWrappers.enter().append("tbody").classed("row-wrapper", true)

		let newDividers = newRowWrappers
			.append("td")
			.classed("divider", true)
			.attr("colspan", readCharacters.length + 2)

		let newRows = newRowWrappers.append("tr").classed("row", true)
		newRows.append("td").classed("state", true)
		newRows.append("td").classed("empty", true)

		let rows = rowWrappers.select("tr.row").merge(newRows)
		let dividers = rowWrappers.select("td.divider").merge(newDividers).raise()

		// Update All rows
		rowWrappers = newRowWrappers.merge(rowWrappers)
		rowWrappers.select("td.state").text(state => state.label)
		
		let self = this

		// Classify row
		rowWrappers.each(function (state: State) {
			let rowWrapper = d3.select(this)

			// Classify reject/accept/start states
			let type = self.model.getType(state)
			rowWrapper.classed(type, true)
		})

		// For each state, bind transitions to table cells
		rows.each(function (state: State) {
			let row = d3.select(this)

			// Find transitions from this state
			let transitions = Array<Transition | undefined>(readCharacters.length).fill(undefined)
			
			// Fill in defined transitions
			self.transitionsFrom(state).forEach(t => {
				transitions[ readCharacters.indexOf(t.read) ] = t
			})
			
			// Bind cells to transitions
			let transitionCells = row.selectAll<HTMLTableCellElement, Transition>("td.transition").data(transitions)
			
			// Create remaining cells
			transitionCells = transitionCells
				.enter()
					.append("td")
					.classed("transition", true)
				.merge(transitionCells)

			// Edit and fill defined & undefined cells
			transitionCells.each(function (transition: Transition | undefined) {
				let cell = d3.select(this)

				cell.classed("undefined", transition === undefined)

				if (transition === undefined) {
					cell.text("undefined")
				} else {
					let { write, direction, from: state } = transition
					cell.text(`(${state.label}, ${write}, ${direction})`)
				}
			})

			// Push empty place-holder to right-most edge
			row.select(".empty").raise()
		})

		// Fill bottom-row place-holder cells
		let emptyCells = d3.select(this._bottomRow)
			.selectAll("td.empty")
			.data(
				d3.range(readCharacters.length + 1)
			)

		emptyCells.exit().remove()
		emptyCells.enter()
			.append("td")
			.classed("empty", true)

		// Push add-column table cell to right-most edge
		d3.select(this._addColumn).raise()
	}
	
}