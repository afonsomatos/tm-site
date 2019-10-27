import * as d3 from "d3"
import { ZoomBehavior, Selection, } from "d3"

import { Diagram, Status, Transform, Vector, Line, Node, Adapter, Link } from "./types"
import { sub, add, mul, unit, vec, ang, norm } from "./util"
import { Point } from "@/shared/types"

function defaultDiagram(): Diagram {
    return {
        links: {
            2: {
                from: 1,
                to: 2,
                label: "Hey"
            },
            3: {
                from: 2,
                to: 1,
                label: "xoxo"
            },
            4: {
                from: 3,
                to: 3,
                label: "hello"
            },
            5: {
                from: 1,
                to: 3,
                label: "dude"
            }
        },
        nodes: {
            1: {
                x: 100,
                y: 100,
                label: "One"
            },
            2: {
                x: 200,
                y: 200,
                label: "Two"
            },
            3: {
                x: 300,
                y: 300,
                label: "Three"
            },
            4: {
                x: 250,
                y: 250,
                label: "Four"
            }
        },
        linkIds: [2, 3, 4, 5],
        nodeIds: [1, 2, 3, 4],
    }
}

function defaultStatus(): Status {
    return {
        activeLink: 0,
        activeNode: 0
    }
}

function transformAttr(transform: Transform): string {
    let {x, y, k} = transform
    return `translate(${x}, ${y}) scale(${k})`
}

export default class Graph {

    private svg: Selection<SVGSVGElement, any, any, any>
    private wrapper: Selection<SVGGElement, any, any, any>

    private zoom: ZoomBehavior<SVGElement, any>
    private zoomLabel: Selection<SVGTextElement, Transform, any, any>

    private nodeGroup: Selection<SVGGElement, number, any, any>
    private linkGroup: Selection<SVGGElement, number, any, any>

    private diagram: Diagram
    private status: Status
    private transform: Transform

    private nodeRadius: number = 20

    private temporaryTransition = {
        // Node number
        from: 0,
        // Position
        to: <Point> [0, 0],
        // Being used?
        active: false,
    }

    // Contains the id of the node being mouseovered.
    private nodeHovering: number | undefined

    // Placeholder for the transition being created
    private temporaryLink: d3.Selection<SVGPathElement, null, null, null>

    // Last known position for the mouse
    private mousePosition: Point = [0, 0]

    // Can we drag a node right now?
    private enableNodeDrag: boolean = true

    constructor(svgElement: SVGSVGElement, private adapter: Adapter) {

        this.diagram = defaultDiagram()
        this.status = defaultStatus()
        this.transform = { x: 0, y: 0, k: 1}

        this.svg = d3.select(svgElement)
        this.wrapper = this.svg.append("g")

        this.linkGroup = this.wrapper.append("g")
        this.nodeGroup = this.wrapper.append("g")

        this.zoom = d3.zoom()
        this.zoomLabel = this.svg.append("text").attr("class", "zoom-label")

        this.setup()
        //this.update()
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
     * Creates a new temporary transition from a node, till the user clicks on another node. 
     */
    public newTransition(nodeId: number) {

        this.temporaryTransition = {
            active: true,
            from: nodeId,
            to: this.pointer
        }

        this.svg.classed("newTransition", true)
        this.temporaryLink.style("visibility", "visible")
        this.enableNodeDrag = false
    }

    /**
     * Creates a new transition between the node `from` and `to`.
     */
    private createTransition(from: number, to: number) {
        
        // Is there a link equal to this?
        if (this.areLinked(from, to)) {
            console.log("Transition already filled from", from, "to", to)
            return
        }

        // Find next available link id
        let linkIds = this.diagram.linkIds.slice()
        linkIds.sort()

        let nextLinkId = linkIds[linkIds.length - 1] + 1
        let link = { from, to, label: "Example" }
        
        // Add to the diagram
        this.diagram.linkIds.push(nextLinkId)
        this.diagram.links[nextLinkId] = link

        this.update()
        this.adapter.newLink(from, to)
    }

    private finishNewTransition() {

        this.temporaryTransition.active = false
        this.svg.classed("newTransition", false)
        this.temporaryLink.style("visibility", "hidden")
        this.enableNodeDrag = true
    }

    private setupTemporaryLink() {

        // Create temporary link
        this.temporaryLink = this.wrapper.append("path")
            .attr("class", "temporary link")

        this.svg.on("mousemove", () => {
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
                if (this.nodeHovering !== undefined) {
                    this.createTransition(this.temporaryTransition.from, this.nodeHovering)
                }

                this.finishNewTransition()
            }
        })
    }

    private temporaryLine() {

        let source: Vector = this.diagram.nodes[this.temporaryTransition.from]

        if (this.nodeHovering === this.temporaryTransition.from) {
            // Self
            let from = add(source, vec(this.nodeRadius, -Math.PI / 2))
            let to = add(source, vec(this.nodeRadius, 0))

            return `M ${from.x} ${from.y} A ${this.nodeRadius} ${this.nodeRadius} 0 1 1 ${to.x} ${to.y}`
        
        } else if (this.nodeHovering === undefined) {
            // Empty space
            let [x, y] = this.temporaryTransition.to
            let diff = sub({ x, y }, source)

            let from = add(source, mul(unit(diff), this.nodeRadius))

            return `M ${from.x} ${from.y} L ${x} ${y}`
        
        } else {
            // Another node
            let target = this.diagram.nodes[this.nodeHovering]
            let diff = sub(target, source)

            let to = sub(target, mul(unit(diff), this.nodeRadius))
            let from = add(source, mul(unit(diff), this.nodeRadius))

            return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
        }
    }

    public setTransform(transform: Transform) {
        this.transform = transform
        this.zoom.scaleTo(this.svg, transform.k)
    }

    private update() {
        this.setupNodes()
        this.setupLinks()
    }

    public setDiagram(diagram: Diagram) {
        this.diagram = diagram
        this.update()
    }

    private areLinked(a: number, b: number): boolean {
        return this.diagram.linkIds.some(id => {
            let link = this.diagram.links[id]
            return link.from == a && link.to == b
        })
    }

    private updateZoomLabel() {
        this.zoomLabel
            .datum(this.transform)
            .text(t => Math.floor(t.k * 100) + "%")
            .attr("x", "100%")
            .attr("y", "100%")
            .on("click", () => this.zoom.scaleTo(this.svg, 1))
    }

    private setupZoom() {
        this.zoom.scaleExtent([0.2, 10]).on("zoom", () => {
            let { x, y, k } = d3.event.transform
            this.transform = { x, y, k }
            this.wrapper.attr("transform", transformAttr(this.transform))
            this.updateZoomLabel()
            this.adapter.transformed(this.transform)
        })

        this.svg.call(this.zoom)
    }

    /**
     * Creates a new node at `(x, y)`, with `label` text. 
     */
    public addNode(x: number, y: number, label: string) {

        // Find next available link id
        let nodeIds = this.diagram.nodeIds.slice()
        nodeIds.sort()

        let nextNodeId = nodeIds[nodeIds.length - 1] + 1
        let node = { x, y, label }
        
        // Add to the diagram
        this.diagram.nodeIds.push(nextNodeId)
        this.diagram.nodes[nextNodeId] = node

        this.update()
    }

    private setupTools() {
        // this.svg.on("contextmenu", () => {
        //     d3.event.preventDefault()
        //     this.addNode({
        //         y: d3.event.y - this.nodeRadius / 2,
        //         x: d3.event.x - this.nodeRadius / 2,
        //         label: "State" 
        //     })
        // })
    }

    private setup() {
        this.setupZoom()
        this.updateZoomLabel()
        this.setupNodes()
        this.setupLinks()
        this.setupTools()
        this.setupTemporaryLink()
    }

    private nodeDragged(id: number, x: number, y: number, el: SVGGElement) {
        this.diagram.nodes[id].x = x
        this.diagram.nodes[id].y = y

        // Make node visible
        d3.select(el)
            .attr("transform", transformAttr({ x, y, k: 1}))
            .raise()
        
        // Update links
        d3.selectAll(".link")
            .data(this.diagram.linkIds)
            .attr("d", d => this.line(d))

        // Notify adapter
        this.adapter.stateMoved(id, [x, y])
    }

    private setupNodes() {

        let nodeDrag = d3.drag<SVGGElement, number>()
            .on("drag", function(d) {
                if (self.enableNodeDrag) {
                    self.nodeDragged(d, d3.event.x, d3.event.y, this)
                }
            })

        let nodeSelection = this.nodeGroup
            .selectAll<SVGGElement, number>(".node")
            .data(this.diagram.nodeIds)

        nodeSelection.exit().remove()

        let newNodes = nodeSelection
            .enter()
                .append("g")
                .attr("class", "node")
                .attr("id", id => id)
                .on("contextmenu", id => this.adapter.nodeRightClick(id))
                .on("mouseenter", id => {
                    this.nodeHovering = id
                })
                .on("mouseleave", () => {
                    this.nodeHovering = undefined
                })

        newNodes.append("circle")
                .attr("class", "circle")
                .attr("r", this.nodeRadius)
        
        newNodes.append("text")

        newNodes.call(nodeDrag)
        
        let allNodes = newNodes.merge(nodeSelection)

        allNodes.attr("transform", id => {
            let { x, y } = this.diagram.nodes[id]
            return transformAttr({ x, y, k: 1})
        })

        let labelSelection = allNodes
            .select<SVGTextElement>("text")

        let self = this
        
        labelSelection
                .text(id => this.diagram.nodes[id].label)
                .attr("text-anchor", "middle")
                .attr("class", "node-label")
                .attr("alignment-baseline", "middle")
                .style("font-size", "24px")
                .attr("dy", ".1em")
                .style("font-size", function(d) {
                    let r = self.nodeRadius
                    return Math.min(2 * r, (2 * r - 10 ) /
                        this.getComputedTextLength() * 24) + "px";
                })
    }

    private line(linkId: number): string {

        let { nodes, links } = this.diagram
        let { from, to } = links[linkId]
        
        let node2: Vector = nodes[to]
        let node1: Vector = nodes[from]

        let diff = sub(node2, node1)

        let forward = this.areLinked(from, to)
        let backward = this.areLinked(to, from)

        if (node1 == node2) {
            // Loop
            let source = add(node1, vec(this.nodeRadius, -Math.PI / 2))
            let target = add(node1, vec(this.nodeRadius, 0))

            return `M ${source.x} ${source.y} A ${this.nodeRadius} ${this.nodeRadius} 0 1 1 ${target.x} ${target.y}`
        } else if (forward !== backward) {
            // Straight
            let source = add(node1, mul(unit(diff), this.nodeRadius))
            let target = sub(node2, mul(unit(diff), this.nodeRadius))
            
            return `M ${source.x} ${source.y} L ${target.x} ${target.y}`
        } else {
            // Curved
            let angle = ang(diff);
            let radius = 1.2 * norm(diff)
            let sep = Math.PI / 4
            let source = add(node1, vec(this.nodeRadius, angle - sep))
            let target = add(node2, vec(this.nodeRadius, angle - Math.PI + sep))

            return `M ${source.x} ${source.y} A ${radius} ${radius} 0 0 1 ${target.x} ${target.y}`
        }
    }

    private setupLinks() {

        let selection = this.linkGroup
            .selectAll<SVGPathElement, number>(".link")
            .data(this.diagram.linkIds)

        selection.exit().remove()
        
        selection
            .enter()
                .append("path")
                .attr("class", "link")
            .merge(selection)
                .attr("d", d => this.line(d))
                .on("click", d => console.log(d))
    }

}