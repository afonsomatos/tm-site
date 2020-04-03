import * as d3 from "d3"
import _ from "lodash"

import simulator from "@/shared/simulator"
import { Snapshot } from "@/tm"
import { Direction, SimpleTransition as Transition } from "@/shared/types"

const translate = (x: number, y: number) => `translate(${x}, ${y})`


export default class Tape {

	/**
	 * Fraction of time the arrow-head moves in a transition.
	 */
	readonly intervalMovingRatio = .5

	/**
	 * The tape itself.
	 */
	private _svg: SVGSVGElement

	/**
	 * The variable width of the tape (according to the window size).
	 */
	private _width: number

	/**
	 * Fixed height.
	 */
	private _height: number

	/**
	 * Contains all cells.
	 */
	private _wrapper: SVGGElement

	/**
	 * What is being shown on the tape.
	 */
	private _tape: { [index: number]: string }

	/**
	 * Where the head is pointing to.
	 */
	private _head: number

	/**
	 * Visible indexes of the cells in the tape.
	 *
	 * Example: [-1, 0, 1, 2, 3]. 
	 */
	private _visible: number[]

    constructor(svgElement: SVGSVGElement, private getHead: () => number, private getTape: () => { [index: number]: string }) {
		
        this._svg = svgElement
		this._wrapper = d3.select(this._svg).append("g").node()
		
		this._tape = {}
		this._head = 0
		this._height = 60
		this._visible = []
		this._width = this._svg.clientWidth

        this.reset()
	}

	/**
	 * Number of visible cells at a given moment.
	 */
	private get cells(): number {
		return Math.ceil(this._width / this._height)
	}

	/**
	 * Returns the side length of a squared cell.
	 */
	private get cellSize(): number {
		return this._height;
	}

	/**
	 * Given a certain index returns the text that is on that cell. 
	 */
	private indexToChar(i: number): string {
		if (i in this._tape)
			return this._tape[i]
		else
			return simulator.converter.program.empty
	}

	private drawRect(selection: d3.Selection<SVGElement, any, any, unknown>) {
		selection.append("rect")
			.attr("width", this.cellSize)
			.attr("height", this.cellSize)
			.attr("class", "rect")
	}
	
	private drawLine(selection: d3.Selection<SVGElement, any, any, unknown>) {
		selection.append("line")
			.attr("x1", this.cellSize)
			.attr("x2", this.cellSize)
			.attr("y1", this.cellSize)
			.attr("y2", 0)
			.attr("stroke", "#D2D2D2")
			.attr("stroke-width", "1")
	}

	private drawText(selection: d3.Selection<SVGElement, number, any, unknown>) {
		selection.append("text")
			.attr("text-anchor", "middle")
			.attr("dominant-baseline", "central")
			.attr("y", this.cellSize / 2)
			.attr("x", this.cellSize/ 2)
			.text(this.indexToChar.bind(this))
	}

	private drawCursor() {
            
		let cursor = d3.select(this._svg).selectAll<SVGPathElement, any>(".cursor").data([0])
		
		let triangle = d3.symbol().type(d3.symbolTriangle)
			
		let xPos = (Math.ceil(this.cells / 2) - 0.5) * this.cellSize
		
		cursor.enter()
				.append("path")
				.attr("class", "cursor")
				.attr("d", triangle.size(200))
				.attr("fill", "black")
			.merge(cursor)
			.attr("transform", () =>
				translate(xPos, this._height - 4))
			.raise()
	}

	private addCell() {
		return d3.select(this._wrapper)
			.append("g")
				.attr("class", "cell")
				.call(this.drawRect.bind(this))
				.call(this.drawLine.bind(this))
				.call(this.drawText.bind(this))
	}

	/**
	 * Animates a transition. 
	 */
	public transition(trans: Transition) {

		// Change the text of current head cell.
		this._tape[this._head] = trans.write
		this.update()

		if (trans.direction === Direction.Stay)
			return
			
		let wrapper = d3.select(this._wrapper)

		if (trans.direction === Direction.Right) {

			// Show next right-most cell
			let last = this._visible[this._visible.length - 1]
			this._visible.push(last + 1)
			this.update()
			
			// Smooth right transition
            wrapper.transition()
				.duration(0.5 * simulator.interval)
				.attr("transform", translate(-this.cellSize, 0))
				.on("end", () => {
					wrapper.attr("transform", translate(0, 0))
					this.reset()
				})
		} else if (trans.direction === Direction.Left) {

			// Show next left-most cell
			wrapper.attr("transform", translate(-this.cellSize, 0))
			this._visible.unshift(this._visible[0] - 1)
			this.update()

			wrapper.transition()
				.duration(0.5 * simulator.interval)
				.attr("transform", translate(0, 0))
				.on("end", () => {
					this.reset()
				})
		}

	}

	/**
	 * Resets the tape with simulator data.
	 */
	public reset() {
		
		//let { head, tape } = simulator.turing.snapshot
		
		this._head = this.getHead()
		this._tape = this.getTape()
		
		// Checks for the available width.
		this._width = this._svg.clientWidth

		this._visible = Array(this.cells).fill(" ").map((_, i) => {
			return this._head - Math.ceil(this.cells / 2) + i + 1
		})

		this.update()
	}

	public update() {

		// Updates the SVG dimensions.
		d3.select(this._svg)
			.attr("width", this._width)
			.attr("height", this._height)
		
		// Binds the visible cells
		let cells = d3.select(this._wrapper)
			.selectAll<SVGGElement, number>(".cell")
			.data(this._visible)
		
		// Delete unused cells
		cells.exit().remove()

		// Create missing cells
		cells.enter()
				.append("g")
				.attr("class", "cell")
				.call(this.drawRect.bind(this))
				.call(this.drawLine.bind(this))
				.call(this.drawText.bind(this))
				.attr("transform", (_, i) => translate(i * this.cellSize, 0))
			// Update all
			.merge(cells)
				.select("text")
				.text(this.indexToChar.bind(this))
				// Head transition
				.classed("head", d => d === this._head)

		this.drawCursor()
	}
	
}