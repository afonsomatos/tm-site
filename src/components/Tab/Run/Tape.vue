<template>
    <svg ref="svg" class="tape" :class="status">

    </svg>
</template>

<script lang="ts">

import Vue from 'vue'
import * as d3 from "d3"
import { Event, TuringStatus } from "@/store/run.module"
import { mapGetters } from 'vuex';
import Getter from "@/store/getter"

const translate = (x, y) => `translate(${x}, ${y})`

export default Vue.extend({
    
    data() {
        return {
            height: 60,
            width: 0,
            wrapper: null,
        }
    },
    
    computed: {
        
        ...mapGetters({
            head: Getter.HEAD,
            tape: Getter.TAPE,
        }),

        status() {
            let turingStatus = this.$store.getters[Getter.TURING_STATUS]
            switch (turingStatus) {
                case TuringStatus.Rejected: return "rejected"
                case TuringStatus.Accepted: return "accepted"
                case TuringStatus.Running:  return "running"
                default:                    return "idle"
            }
        },

        svg() {
            return d3.select(this.$refs.svg)
        },

        cells() {
            return Math.ceil(this.width / this.height)
        },
    
        cellSize() {
            return this.height
        },

        bus() {
            return this.$store.state.run.bus
        },

        transition() {
            return this.$store.state.run.transition
        },

    },

    mounted() {
        this.wrapper = this.svg.append("g")

        this.redraw()
        window.addEventListener("resize", this.onResize)

        this.bus.$on(Event.Transition, this.onTransition)
        this.bus.$on(Event.Load, this.onLoad)
        this.bus.$on(Event.Back, this.onBack)
        
    },

    beforeDestroy() {
      this.bus.$off(Event.Transition, this.onTransition)
      this.bus.$off(Event.Load, this.onLoad)
      this.bus.$off(Event.Back, this.onBack)  
      window.removeEventListener("resize", this.onResize)
    },

    methods: {
        
        onResize() {
            this.redraw()
        },

        onTransition() { 
            this.simulate(this.wrapper)
        },

        onLoad() {
            this.redraw()
        },

        onBack() {
            this.redraw()
        },

        simulate(selection) {
            let dx = this.transition.direction
            //Math.random() < 0.5 ? -1 : 1
            if (dx === 1) this.moveRight(selection)
            if (dx === -1) this.moveLeft(selection)
        },

        visible() {
            return Array(this.cells).fill(" ").map((_, i) => {
                return this.head - Math.ceil(this.cells / 2) + i + 1
            })
        },

        indexToChar(i) {
            return this.tape()[i]
        },

        redraw() {
            this.width = this.$refs.svg.clientWidth
            this.setupSvg()
            this.updateCells(this.wrapper)
            this.drawCursor(this.svg)
        },

        setupSvg() {
            this.svg
                .attr("width", this.width)
                .attr("height", this.height)
        },
        
        drawRect(selection) {
            selection.append("rect")
                .attr("width", this.cellSize)
                .attr("height", this.cellSize)
                .attr("class", "rect")
        },
        
        drawLine(selection) {
            selection.append("line")
                .attr("x1", this.height)
                .attr("x2", this.height)
                .attr("y1", this.height)
                .attr("y2", 0)
                .attr("stroke", "#D2D2D2")
                .attr("stroke-width", "1")
        },

        drawText(selection) {
            selection.append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("y", this.cellSize / 2)
                .attr("x", this.cellSize/ 2)
                .text(this.indexToChar)
        },

        repositionCells(selection, offset = 0) {
	        selection.selectAll(".cell")
		        .attr("transform", (d, i) => translate((i + offset) * this.cellSize, 0))
        },

        addCell(selection, append = true) {
            let cell = selection.append("g")
                    .attr("class", "cell")
                    .call(this.drawRect)
                    .call(this.drawLine)
                    .call(this.drawText)
                    
            append ? cell.raise() : cell.lower()
        },

        updateCells(selection) {

            let cells = selection.selectAll(".cell").data(this.visible())

            // Delete unused cells
            cells.exit()
                .remove()

            // Create missing cells
            cells.enter()
                    .append("g")
                    .attr("class", "cell")
                    .call(this.drawRect)
                    .call(this.drawLine)
                    .call(this.drawText)
                // Update all
                .merge(cells)
                    .select("text")
                    .text(this.indexToChar)
                    // Head transition
                    .classed("head", false)
                    .filter(d => d === this.head)
                    .classed("head", true)
                
            this.repositionCells(selection)
        },

        drawCursor(selection) {
            
            let cursor = selection.selectAll(".cursor").data([0])
            
            let triangle = d3.symbol().type(d3.symbolTriangle)
                
            let xPos = (Math.floor((this.width / this.height) / 2) + 0.5) * this.cellSize
            
            cursor.enter()
                    .append("path")
                    .attr("class", "cursor")
                    .attr("d", triangle.size(200))
                    .attr("fill", "black")
                .merge(cursor)
                .attr("transform", () =>
                    translate(xPos, this.height - 4))
                .raise()
        },

        moveRight(selection) {
            
            let array = this.visible()
            let last = array[ array.length - 1]
            
            // Add cell
            selection.datum(last).call(this.addCell)

            // Shift wrapper right
            selection.attr("transform", translate(this.cellSize, 0))

            // Shift cells to the left
            this.repositionCells(this.wrapper, -1)
            
            // Smooth right transition
            selection.transition()
                .duration(this.$store.state.run.step)
                .attr("transform", translate(0, 0))
                // Ready to remove left most
                .on("end", () => {
                    selection.select(".cell").remove()
                    this.updateCells(selection)
                })
        },

        moveLeft(selection) {

            selection.attr("transform", translate(-this.cellSize, 0))
            this.repositionCells(this.wrapper, 1)
            
            let first = this.visible()[0]
            
            // Add cell at start
            selection.datum(first).call(this.addCell)
                
            // Smooth right transition
            selection.transition()
                .duration(this.$store.state.run.step)
                .attr("transform", translate(0, 0))
                // Ready to remove left most
                .on("end", () => {
                    selection.select(".cell:last-child").remove()
                    this.updateCells(selection)
                })
        },

    },
})

</script>

<style lang="scss">

@import "src/style/Lib";

.tape {
    border: 2px solid $color-active;
    border-left: none;
    border-right: none;
    width: 100%;

    &.rejected { border-color: $color-negative; }
    &.accepted { border-color: $color-positive; }
    &.idle { border-color: $color-normal; }
}

.cursor {
    fill: $color-active;
}

.rect {
    fill: white;
}

text {
    font: $tape-font-big;

    &.head { fill: $color-active; }
}

</style>