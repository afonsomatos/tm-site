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
import Vue from "vue"
import Graph from "./Graph/index"
import ContextMenu from "./ContextMenu/index.vue"
import Action from "@/store/action"
import { mapActions, mapMutations } from "vuex"
import Mutation from "../../store/mutation";

export default Vue.extend({
	components: { ContextMenu },
	data() {
		return {
			contextPos: [0, 0],
		}
	},
	methods: {
		...mapMutations({
			setMenu: Mutation.SET_MENU,
			selectState: Mutation.SELECT_STATE
		}),
	},
	computed: {
		showContextMenu() {
			return this.$store.state.diagram.menu !== null
		}
	},
    mounted() {
		let svg = this.$refs.svg as SVGSVGElement
		let self = this

		d3.select(svg).on("contextmenu", function() {
			d3.event.preventDefault()

			self.contextPos = d3.mouse(this)

			self.setMenu("transition")
			self.selectState(0)
		})

		d3.select(svg).on("mousedown", () => self.setMenu(null))

		new Graph(svg)
    }
})

</script>

<style lang="scss">

#app {
	height: 100%;
	@import "style";
}

</style>