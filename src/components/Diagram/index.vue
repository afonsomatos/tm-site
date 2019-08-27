<template>
	<div id="app">
		<div class="app-wrapper" ref="wrapper">
			<context-menu
				v-if="showContextMenu"
				:x="contextPos[0]"
				:y="contextPos[1]"
				/>
			<svg id="svg" ref="svg">
				<rect id="background" x="0" y="0" width="100%" height="100%" fill="transparent"/>
				<defs>
					<marker id="arrow-head" viewBox="-5 -5 10 10" refX="0" refY="0" orient="auto" markerWidth="10" markerHeight="10">
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
import { Diagram, Node, Link } from "./Graph/types"
import Graph from "./Graph/index"
import ContextMenu from "./ContextMenu/index.vue"
import { mapActions, mapMutations } from "vuex"

import Mutation from "@/store/modules/diagram/mutation"
import Action from "@/store/modules/diagram/action"

export default Vue.extend({
	components: { ContextMenu },
	data() {
		return {
			graph: undefined,
			contextPos: [0, 0],
		}
	},
	methods: {
		...mapMutations("diagram", {
			setMenu: Mutation.SET_MENU,
			selectState: Mutation.SELECT_STATE
		}),

		update() {
			let model = this.$store.state.model
			let nodeIds: number[] = _.clone(model.stateList)
			let linkIds: number[] = []
			let links: Link[] = []
			let nodes: Node[] = nodeIds.map(id => {
				let [x, y] = model.statesPos[id]
				return { x, y, label: model.states[id] } as Node
			})

			let i = 0
			for (let nodeId in model.stateTransitions) {
				let transitions = model.stateTransitions[nodeId]
				Object.values(transitions)
					.filter(x => !x[3])
					.map<Link>(x => {
						return {
							from: model.stateList[nodeId],
							to: <number> x[0],
							label: "hoho"
						}
					})
					.forEach(l => {
						linkIds.push(i++)
						links.push(l)
					})
			}

			let diagram: Diagram = {
				nodes,
				nodeIds,
				linkIds,
				links
			}

			console.log(diagram)
			this.graph.update(diagram)
		}
	},
	computed: {
		showContextMenu() {
			return this.$store.state.diagram.menu !== null
		}
	},
	mounted() {
		let svg = this.$refs.svg as SVGSVGElement

		d3.select(svg).on("contextmenu", () => d3.event.preventDefault())
	
		// Close context menu when clicking outside it
		d3.select(document.body).on("mousedown", () => {
			if (svg.contains(d3.event.target) || svg === d3.event.target)
				this.setMenu(null)
		}, true)

		// Initialize graph
		this.graph = new Graph(svg, {
			nodeRightClick: (id: number) => {
				d3.event.preventDefault()
				console.log("State was right-clicked", id)
				this.contextPos = d3.mouse(svg)
				this.selectState(id)
				this.setMenu("state")
			}
		})

		this.update()
    }
})

</script>

<style lang="scss">

#app {
	height: 100%;
	@import "style";
}

</style>