import * as d3 from "d3"
import { ZoomBehavior, Selection } from "d3"

import { Transform, Vector } from "./types"
import { sub, add, mul, unit, vec, ang, norm } from "./util"
import { Point, Direction } from "@/shared/types"
import { Model, State, Transition, Link } from "@/shared/model"

function translateAttr({x, y}: Vector): string {
    return `translate(${x}, ${y})`
}

function transformAttr(transform: Transform): string {
    let {x, y, k} = transform
    return `translate(${x}, ${y}) scale(${k})`
}

function transitionLabel({ read, write, direction }: Transition): string {
    return `${read.join('')} &rarr; ${write.join('')}, ${direction.join('')}`
}

export default class Graph {

    private svg: Selection<SVGSVGElement, any, any, any>
    private wrapper: Selection<SVGGElement, any, any, any>

    private zoom: ZoomBehavior<SVGElement, any>
    private zoomLabel: Selection<SVGTextElement, Transform, any, any>

    private nodeGroup: Selection<SVGGElement, State, any, any>
    private linkGroup: Selection<SVGGElement, Link, any, any>

    // Contains all states and transitions
    public model: Model

    public transform: Transform

    private nodeRadius: number = 20

    private temporaryTransition = {
        // Node
        from: <State> null,
        // Position
        to: <Point> [0, 0],
        // Being used?
        active: false,
    }

    // Contains the id of the node being mouseovered.
    private stateHovering: State | undefined

    // Placeholder for the transition being created
    private temporaryLink: d3.Selection<SVGPathElement, null, null, null>

    // Last known position for the mouse
    public mousePosition: Point = [0, 0]

    // What zoom values are allowed
    private zoomRange: [number, number] = [0.2, 10] // * 100%

    // Can we drag a node right now?
    private get enableNodeDrag(): boolean {
        return !this.temporaryTransition.active && !this.view
    }

    // In view-mode, certain functionalities do not apply
    public view: boolean = false

    // Marks the center of the diagram
    public referentialMarker: SVGElement

    constructor(svgElement: SVGSVGElement) {

        this.model = new Model()
        this.transform = { x: 0, y: 0, k: 1}

        this.svg = d3.select(svgElement)
        this.wrapper = this.svg.append("g")
        
        this.linkGroup = this.wrapper.append("g")
        this.nodeGroup = this.wrapper.append("g")
        
        this.zoom = d3.zoom()
        this.zoomLabel = this.svg.select("#zoom-label") 
        
        // Referential marker will be at (0, 0)
        this.referentialMarker = this.wrapper.append("text")
            .classed("referential-marker", true)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("+")
            .node()

        this.setup()
    }

    /**
     * Current global mouse position, taking zoom and pan into consideration.
     */
    get pointer(): Point {
        let [x, y] = this.mousePosition
        return [
            (x - this.transform.x) / this.transform.k,
            (y - this.transform.y) / this.transform.k
        ]
    }

    /**
     * Events handlers.
     */
    public onStateRightClick: (state: State) => void
    public onLinkRightClick: (link: Link) => void
    //public onTransform: (transform: Transform) => void

    /**
     * Creates a new temporary transition from a node, till the user clicks on another node. 
     */
    public newTransition(node: State) {

        this.temporaryTransition = {
            active: true,
            from: node,
            to: this.pointer
        }

        this.svg.classed("newTransition", true)
        this.temporaryLink.style("visibility", "visible")
    }

    /**
     * Finishes a temporary transition.
     */
    private finishNewTransition() {
        this.svg.classed("newTransition", false)
        this.temporaryLink.style("visibility", "hidden")
        this.temporaryTransition.active = false
    }

    /**
     * Creates a new transition between the node `from` and `to`.
     */
    public createTransition(from: State, to: State): Transition {
        
        let newTransition = {
            from, to,
            direction: [],
            read: [],
            write: [],
        }

        this.model.addTransition(newTransition)
        this.model.normalize()
        this.update()

        return newTransition
    }

    private setupTemporaryLink() {

        // Create temporary link
        this.temporaryLink = this.wrapper.append("path")
            .attr("class", "temporary link")

        this.svg.on("mousemove mouseover", () => {
            // Save last known mouse position. This will prevent errors when accessing the mouse position
            // when the svg is not being hovered on.
            this.mousePosition = d3.mouse(this.svg.node())
            
            // Update link with pointer position.
            if (this.temporaryTransition.active) {
                this.temporaryTransition.to = this.pointer
                this.temporaryLink.attr("d", this.temporaryLine.bind(this))
            }
        })

        this.svg.on("click", () => {
            // Close temporary link
            if (this.temporaryTransition.active) {
                // If a node was selected as a target, a new link was created
                if (this.stateHovering !== undefined) {
                    // Link endpoints
                    let { from } = this.temporaryTransition
                    let to = this.stateHovering
                    // Is there a link equal to this?
                    if (this.model.areLinked(from, to)) {
                        console.log("Link already created from", from.label, "to", to.label)
                    } else {
                        this.createTransition(this.temporaryTransition.from, this.stateHovering)
                    }
                }

                this.finishNewTransition()
            }
        })
    }

    /**
     * Returns the SVG Path of a temporary transition.
     */
    private temporaryLine() {

        let source: Vector = this.temporaryTransition.from.position
        
        if (this.stateHovering === this.temporaryTransition.from) {
            // To self (loop)
            let from = add(source, vec(this.nodeRadius, -Math.PI / 2))
            let to = add(source, vec(this.nodeRadius, 0))

            return `M ${from.x} ${from.y} A ${this.nodeRadius} ${this.nodeRadius} 0 1 1 ${to.x} ${to.y}`
        
        } else if (this.stateHovering === undefined) {
            // Empty space (straight line)
            let [x, y] = this.temporaryTransition.to
            let diff = sub({ x, y }, source)
            let from = add(source, mul(unit(diff), this.nodeRadius))

            return `M ${from.x} ${from.y} L ${x} ${y}`
        
        } else {
            // Another node (straight line to border of the target node)
            let target = this.stateHovering.position
            let diff = sub(target, source)

            let to = sub(target, mul(unit(diff), this.nodeRadius))
            let from = add(source, mul(unit(diff), this.nodeRadius))

            return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
        }
    }

    public update() {
        this.setupNodes()
        this.setupLinks()
        this.startArrow()
    }

    /**
     * Marks the initial node with an arrow.
     */
    private startArrow() {

        const lineLength = 30;

        let startLink = this.linkGroup
            .selectAll<SVGPathElement, State>("#start-link")
            .data([ this.model.start ])

        startLink.exit().remove()
        
        startLink.enter()
            .append("path")
                .attr("class", "link")
                .attr("id", "start-link")
            .merge(startLink)
                .attr("visibility", s => s ? "visible" : "hidden")
                .filter(s => s !== null)
                .attr("d", state => {
                    // Left tip of start node
                    const target = add(state.position, { x: -this.nodeRadius, y: 0 })
                    const source = add(target, { x: -lineLength, y: 0 })
                    const linePath = `M ${source.x} ${source.y} L ${target.x} ${target.y}`

                    return linePath
                })
    }

    public setModel(model: Model) {
        this.model = model
        this.update()
    }

    private updateZoomLabel() {
        this.zoomLabel
            .datum(this.transform)
            .text(t => Math.floor(t.k * 100) + "%")
            .attr("x", "100%")
            .attr("y", "100%")
            .on("click", () => this.resetZoom())
    }

    public resetZoom() {
        this.zoom.translateTo(this.svg, 0, 0)
        this.zoom.scaleTo(this.svg, 1)
    }

    private setupZoom() {
        this.zoom.scaleExtent(this.zoomRange).on("zoom", () => {
            let { x, y, k } = d3.event.transform
            this.transform = { x, y, k }
            this.wrapper.attr("transform", transformAttr(this.transform))
            this.updateZoomLabel()

            // Maintain marker size
            d3.select(this.referentialMarker).attr("transform", transformAttr({
                x: 0,
                y: 0,
                k: 1 / k
            }))
        })

        this.svg.call(this.zoom)
    }

    private setup() {
        this.setupSvg()
        this.setupZoom()
        this.updateZoomLabel()
        this.setupNodes()
        this.setupLinks()
        this.setupTemporaryLink()
    }

    /**
     * Basic behaviors of the svg are created here.
     */
    private setupSvg() {
        // Hide default context menu
		this.svg.on("contextmenu", () => {
			d3.event.preventDefault()
		})
    }

    private nodeDragged(state: State, x: number, y: number, el: SVGGElement) {

        state.position = { x, y }

        // Make node visible
        d3.select(el)
            .attr("transform", transformAttr({ x, y, k: 1}))
            .raise()
        
        // Update links
        // TODO: Speed this up? Performance will suffer.
        this.setupLinks()

        if (this.model.start === state) {
            this.startArrow()
        }

    }

    /**
     * Returns a class to add to the node that represents a certain state.
     */
    private nodeClass(state: State) {

        let className = "node"
        if (this.model.start == state) {
            className += " start"
        } else if (this.model.accept.has(state)) {
            className += " accept"
        } else if (this.model.reject.has(state)) {
            className += " reject"
        }

        return className
    }

    /**
     * Create all starting nodes and setup their behavior.
     */
    private setupNodes() {

        let self = this

        // Ability to drag a node around
        let nodeDrag = d3.drag<SVGGElement, State>()
            .on("drag", function(d) {
                if (self.enableNodeDrag) {
                    self.nodeDragged(d, d3.event.x, d3.event.y, this)
                }
            })

        let nodeSelection = this.nodeGroup
            .selectAll<SVGGElement, State>(".node")
            .data(this.model.states)
        
        // Remove all unused nodes
        nodeSelection.exit().remove()

        // Setup behavior for new nodes
        let newNodes = nodeSelection
            .enter()
                .append("g")
                .on("mouseenter", state => this.stateHovering = state)
                .on("mouseleave", () => this.stateHovering = undefined)
                .on("contextmenu", state => this.onStateRightClick(state))

        newNodes.append("circle")
                .attr("class", "circle")
                .attr("r", this.nodeRadius)
        
        newNodes.append("text")
        newNodes.call(nodeDrag)
            
        // Let's translate all nodes to their true position
        let allNodes = newNodes.merge(nodeSelection)

        allNodes
            .attr("class", state => this.nodeClass(state))
            .attr("transform", state => {
                let { x, y } = state.position
                return transformAttr({ x, y, k: 1})
            })

        // Let's write the nodes' labels
        allNodes.select<SVGTextElement>("text")
                .text(state => state.label)
                // Make sure the text fits in node without wrapping or overflowing
                .attr("class", "node-label")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                // TODO: Can some of this go to scss file?
                .style("font-size", "24px")
                .attr("dy", ".1em")
                .style("font-size", function(d) {
                    let r = self.nodeRadius
                    return Math.min(2 * r, (2 * r - 10 ) /
                        this.getComputedTextLength() * 24) + "px";
                })
    }

    /**
     * Create a line for a normal link.
     */
    private line(link: Link, reversed: boolean = false): string {

        let { from, to } = link

        if (reversed)
            [from, to] = [to, from]

        let diff = sub(to.position, from.position)

        if (from == to) {
            // Loop
            let source = add(from.position, vec(this.nodeRadius, -Math.PI / 2))
            let target = add(from.position, vec(this.nodeRadius, 0))

            return `M ${source.x} ${source.y} A ${this.nodeRadius} ${this.nodeRadius} 0 1 1 ${target.x} ${target.y}`
        }
        
        let forward = this.model.areLinked(from, to)
        let backward = this.model.areLinked(to, from)

        if (forward !== backward) {
            // Straight
            let source = add(from.position, mul(unit(diff), this.nodeRadius))
            let target = sub(to.position, mul(unit(diff), this.nodeRadius))
            
            return `M ${source.x} ${source.y} L ${target.x} ${target.y}`
        } else {
            // Curved
            let sep = (reversed ? -1 : 1) * Math.PI / 4 
            // Sweep: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Arcs
            let sweep = reversed ? '0' : '1'

            let angle = ang(diff);
            let radius = 1.2 * norm(diff)
            let source = add(from.position, vec(this.nodeRadius, angle - sep))
            let target = add(to.position, vec(this.nodeRadius, angle - Math.PI + sep))
            
            return `M ${source.x} ${source.y} A ${radius} ${radius} 0 0 ${sweep} ${target.x} ${target.y}`
        }
    }

    /**
     * Create behaviors for links.
     */
    private setupLinks() {

        let selection = this.linkGroup
            .selectAll<SVGGElement, Link>(".link-wrapper")
            .data(this.model.links)

        // Remove unused links
        selection.exit().remove()
        
        // Create new links
        let newLinks = selection
            .enter()
                .append("g")
                .attr("class", "link-wrapper")
                
        newLinks.append("path")
                .attr("class", "link")
        
        newLinks.append("path")
                .attr("class", "linkShadow")

        selection = newLinks.merge(selection)
        let self = this

        // Create labels
        selection.each(function(link: Link, index: number) {
            let group = d3.select(this)
            let transitions = self.model.linkToTransitions(link)

            let reversed = link.from.position.x > link.to.position.x
            let linePath = self.line(link, reversed)

            let linkEl = group.select(".link")
                .classed("reversed", reversed)
                .attr("d", linePath)
                .attr("id", `link${index}`)

            group.select(".linkShadow")
                .attr("d", linePath)
                .on("mouseenter", () => linkEl.classed("active", true))
                .on("mouseleave", () => linkEl.classed("active", false))
                .on("contextmenu", () => {
                    self.onLinkRightClick(link)
                })

            let linkText = group
                .selectAll<SVGTextElement, Transition>(".linkText")
                .data(transitions)

            linkText.exit().remove()
            
            let newLinkText = linkText.enter()
                .append("text")
                .attr("class", "linkText")

            linkText = linkText.merge(newLinkText)
                
            // Special design for loops
            if (link.from === link.to) {
                linkText
                    .attr("transform", translateAttr(link.from.position))
                    .attr("dy", (_, i) => -3 - 1.4 * i + "em")
                    .html(transitionLabel)
            } else {
                // Design for straight and arcs
                linkText
                    .attr("transform", null)
                    .html(null)
                    .append("textPath")
                        .attr("startOffset", "50%")
                        .attr("text-anchor", "middle")
                
               linkText
                    .attr("dy", (_, i) => {
                        let val = reversed  ? 1.5 + 1.4 * i
                                            : -1 - 1.4 * i
                        return val + "em"
                    })
                    .select("textPath")
                        .attr("xlink:href", `#link${index}`)
                        .html(transitionLabel)
            }
            
        })

    }

}