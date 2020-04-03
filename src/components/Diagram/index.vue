<template>
	<div id="app" :class="{ view: !canEdit }">
		<div class="app-wrapper" ref="wrapper">
			<svg id="svg" ref="svg">
				<rect id="background" x="0" y="0" width="100%" height="100%" fill="transparent"/>
				<defs>
					<marker id="arrow-head" viewBox="-5 -5 10 10" refX="0" refY="0" orient="auto" markerWidth="10" markerHeight="10">
						<path d="M -5 5, 0 0.3, -5 -5"></path>
					</marker>
					<marker id="reversed-arrow-head" viewBox="-5 -5 10 10" refX="0" refY="0" orient="auto" markerWidth="10" markerHeight="10">
						<path d="M -5 5, 0 0.3, -5 -5" transform="rotate(180)"></path>
					</marker>
					<marker id="arrow-head-temporary" viewBox="-5 -5 10 10" refX="0" refY="0" orient="auto" markerWidth="10" markerHeight="10">
						<path  d="M -5 5, 0 0.3, -5 -5"></path>
					</marker>
				</defs>
				<text id="zoom-label">100%</text>
			</svg>
		</div>
	</div>
</template>

<script lang="ts">

import * as d3 from "d3"
import _ from "lodash"
import Vue from "vue"
import Graph from "./Graph/index"

import { State, Link } from "@/shared/model"
import { Point, Vector } from "@/shared/types"

import global from "@/store/global"
import { store } from "@/shared/app/store"
import { app } from "../../shared/app"
import { Command } from "@/shared/app/modelService"

export default Vue.extend({
	data() {
		return {
			global,
		}
	},
	computed: {
		canEdit: () => store.canEdit,
		model: () => store.model.model,
	},
	watch: {
		canEdit(value: boolean) {
			this.graph.view = !value
		},
		model(newModel) {
			this.graph.setModel(newModel)
		}
	},
	methods: {

		selectState(state: State) {
			app.diagramService.setEditState(state)
		},


		openMenu(menu: string) {
			let [a, b] = d3.mouse(this.$refs.svg)
			app.diagramService.setGraphPosition({ x: a, y: b })
			let [x, y] = d3.mouse(document.body)
			app.diagramService.setContextMenuPosition({ x, y })
			app.diagramService.setContextMenu(menu)
		}
	},
	activated() {
		app.diagramService.update()
	},
	mounted() {

		let svg = this.$refs.svg as SVGSVGElement

		// Close context menu when clicking outside it
		d3.select(document.body).on("mousedown", () => {
			if (svg.contains(d3.event.target) || svg === d3.event.target) {
				app.diagramService.setContextMenu(null)
			}
		}, true)

		// Initialize graph and SVG
		let graph = new Graph(svg, {
			onStateRightClick: (state: State) => {
				if (this.canEdit) {
					this.selectState(state)
					this.openMenu("state")
				}
			},
			onLinkRightClick: (link: Link) => {
				if (this.canEdit) {
					app.diagramService.setEditLink(link)
					this.openMenu("link")
				}
			},
			onStateReposition: (state: State, position: Vector) => {
				app.modelService.execute(
					Command.changeState(state, { position })
				)
			},
			onLinkCreation: (link: Link) => {
				app.modelService.execute(
					Command.addTransition(
						app.modelService.getDefaultTransition(link)
					)
				)
			}
		})

		app.diagramService.setGraph(graph)
		
		graph.setModel(store.model.model)
		
		// Set diagram referential transform when SVG size has stabilized
		this.$nextTick(() => graph.resetZoom())

		graph.view = !store.canEdit

		this.graph = graph

        // Add new state
		d3.select("#background").on("contextmenu", () => {
			if (this.canEdit) {
				this.openMenu("addState")
			}
		})
	},
	
})

</script>

<style lang="scss">

#app {
	height: 100%;
	@import "style";
}

</style>