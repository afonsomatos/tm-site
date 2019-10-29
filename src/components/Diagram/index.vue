<template>
	<div id="app">
		<div class="app-wrapper" ref="wrapper">
			<context-menu v-if="showContextMenu" />
			<svg id="svg" ref="svg">
				<rect id="background" x="0" y="0" width="100%" height="100%" fill="transparent"/>
				<defs>
					<marker id="arrow-head" viewBox="-5 -5 10 10" refX="0" refY="0" orient="auto" markerWidth="10" markerHeight="10">
						<path  d="M -5 5, 0 0.3, -5 -5"></path>
					</marker>
					<marker id="arrow-head-temporary" viewBox="-5 -5 10 10" refX="0" refY="0" orient="auto" markerWidth="10" markerHeight="10">
						<path  d="M -5 5, 0 0.3, -5 -5"></path>
					</marker>
				</defs>
			</svg>
		</div>
	</div>
</template>

<script lang="ts">

import * as d3 from "d3"
import _ from "lodash"
import Vue from "vue"
import Graph from "./Graph/index"
import ContextMenu from "./ContextMenu/index.vue"
import { mapActions, mapMutations } from "vuex"

import Mutation from "@/store/modules/diagram/mutation"
import Action from "@/store/modules/diagram/action"

import { State, Link } from "@/shared/model"
import { Point } from "@/shared/types"

export default Vue.extend({
	components: { ContextMenu },
	data() {
		return {
			graph: undefined,
		}
	},
	methods: {
		...mapActions("diagram", {
			setStatePosition: Action.SET_STATE_POSITION,
		}),
		
		...mapMutations("diagram", {
			setPosition: Mutation.SET_POSITION,
			setMenu: Mutation.SET_MENU,
			selectState: Mutation.SELECT_STATE,
		}),

	},
	computed: {
		showContextMenu() {
			return this.$store.state.diagram.menu !== null
		}
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
			// Save position where a new node will be created
			this.setPosition(graph.mousePosition)
			this.selectState(state)
			this.setMenu("state")
		}

		graph.onLinkRightClick = (link: Link) => {
			console.log(link)
		}


		// CONTINUO AQUI: ADICIONAR CAPACIDADE DE EDITAR O ESTADO E CRIAR/EDITAR TRANSICAO
		// COM NOVA API. ALTERAR A STORE PARA ESTE EFEITO.

		/*
			editLink: (from: number, to: number) => {
				this.setPosition(this.graph.mousePosition)
				this.setMenu("transition")
				this.selectLink([from, to])
		})*/

		this.$store.state.diagram.graph = graph

		graph.setModel(this.$store.state.nextModel)
		graph.setTransform(this.$store.state.diagram.transform)

        // Add new state
		d3.select("#background").on("contextmenu", () => {
			console.log("Background was right-clicked")
			let pos = d3.mouse(svg)
			this.setPosition(pos)
			this.setMenu("addState")
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