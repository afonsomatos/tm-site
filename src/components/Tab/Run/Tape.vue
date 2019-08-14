<template>
    <svg ref="svg" class="tape">

    </svg>
</template>

<script lang="ts">

import Vue from 'vue'
import * as d3 from "d3"
import { Event } from "@/store/run.module"

const translate = (x, y) => `translate(${x}, ${y})`

export default Vue.extend({
    
    data() {
        return {
            height: 60,
            head: 0,
            width: 0,
            fullTape: "abcdefghij",
            wrapper: null,
        }
    },
    
    computed: {
        
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
        }
    
    },
    
    mounted() {
        this.wrapper = this.svg.append("g")
        this.redraw()
        
        window.addEventListener("resize", this.redraw)

        this.bus.$on(Event.Load, () => console.log("Loading"))
        this.bus.$on(Event.Run, () => console.log("Running"))
    },

    methods: {
        
        visible() {
            return Array(this.cells).fill(" ").map((_, i) => {
                return this.head - Math.ceil(this.cells / 2) + i + 1
            })
        },

        indexToChar(i) {
            return this.fullTape[i]
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
            
            this.head++
            
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
                .attr("transform", translate(0, 0))
                // Ready to remove left most
                .on("end", () => {
                    selection.select(".cell").remove()
                    this.updateCells(selection)
                })
        },

        moveLeft(selection) {

            this.head--
            
            selection.attr("transform", translate(-this.cellSize, 0))
            this.repositionCells(this.wrapper, 1)
            
            let first = this.visible()[0]
            
            // Add cell at start
            selection.datum(first).call(this.addCell)
                
            // Smooth right transition
            selection.transition()
                .attr("transform", translate(0, 0))
                // Ready to remove left most
                .on("end", () => {
                    selection.select(".cell:last-child").remove()
                    this.updateCells(selection)
                })
        },

        simulate() {
            setInterval(selection => {
                let dx = Math.random() < 0.5 ? -1 : 1
                if (dx === 1) this.moveRight(selection)
                if (dx === -1) this.moveLeft(selection)
            }, 3000, this.wrapper)
        }

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
}

.cursor {
    fill: $color-active;
}

.rect {
    fill: white;
}

text {
    font: $tape-font-big;
}

</style>