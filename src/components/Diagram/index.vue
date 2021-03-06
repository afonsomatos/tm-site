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
import { mapActions, mapMutations } from "vuex"

import Mutation from "@/store/modules/diagram/mutation"
import Action from "@/store/modules/diagram/action"

import { State, Link } from "@/shared/model"
import { Point } from "@/shared/types"

import global from "@/store/global"

export default Vue.extend({
	data() {
		return {
			global,
		}
	},
	computed: {
		canEdit: () => global.canEdit,
		model: () => global.model,
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
		...mapActions("diagram", {
			setStatePosition: Action.SET_STATE_POSITION,
		}),
		
		...mapMutations("diagram", {
			setContextPosition: Mutation.SET_CONTEXT_POSITION,
			setMenu: Mutation.SET_MENU,
			selectState: Mutation.SELECT_STATE,
			selectLink: Mutation.SELECT_LINK,
			setGraphPosition: Mutation.SET_GRAPH_POSITION,
		}),

		openMenu(menu: string) {
			this.setGraphPosition(d3.mouse(this.$refs.svg))
			this.setContextPosition(d3.mouse(document.body))
			this.setMenu(menu)
		}
	},
	activated() {
		this.graph.update()
	},
	mounted() {

		let svg = this.$refs.svg as SVGSVGElement

		// Close context menu when clicking outside it
		d3.select(document.body).on("mousedown", () => {
			if (svg.contains(d3.event.target) || svg === d3.event.target) {
				this.setMenu(null)
			}
		}, true)

		// Initialize graph and SVG
		let graph = new Graph(svg)

		graph.onStateRightClick = (state: State) => {
			if (this.canEdit) {
				this.selectState(state)
				this.openMenu("state")
			}
		}

		graph.onLinkRightClick = (link: Link) => {
			if (this.canEdit) {
				this.selectLink(link)
				this.openMenu("link")
			}
		}

		this.$store.state.diagram.graph = graph

		graph.setModel(global.model)
		
		// Set diagram referential transform when SVG size has stabilized
		this.$nextTick(() => graph.resetZoom())

		graph.view = !global.canEdit

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