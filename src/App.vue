<template>
		<div class="main">
				<ActionBar />
				<Middle />

				<SideBar>
						<transition name="fade" mode="out-in">
								<component v-bind:is="sidebar"></component>
						</transition>
				</SideBar>

		<context-menu v-if="showContextMenu" />
		</div>
</template>

<style lang="scss" scoped>

.fade-enter {
	opacity: 0;
}

.fade-enter-active {
	transition: opacity 0.2s ease;
}

.fade-leave-active {
	transition: opacity 0.2s ease;
	opacity: 0;
}

.main {
		width: 100%;
		height: 100%;
		display: grid;
	grid-template-columns: min-content auto min-content;
}

</style>

<style lang="scss">

@import "src/style/Base.scss";

</style>

<script lang="ts">

import Vue          from "vue"
import VueRouter    from "vue-router"
import ActionBar    from "@/components/ActionBar/ActionBar.vue"
import SideBar      from "@/components/SideBar/SideBar.vue"
import Middle       from "@/components/Middle/Middle.vue"
import ContextMenu 	from "@/components/Diagram/ContextMenu/index.vue"

import simulator, { Event } from "@/shared/simulator"

import global, { View } from "@/store/global"
import { mapMutations } from "vuex"
import Mutation from "@/store/modules/diagram/mutation"

import { store } from "@/shared/app/store"
import { app } from "./shared/app"
import Run from "./components/Tab/Run"

export default Vue.extend({
	data() {
		return {
			global
		}
	},
	watch: {
		showContextMenu(show: boolean) {
			if (!show) {
				app.diagramService.setContextMenu(null)
			}
		},
		model: {
			immediate: true,
			handler(newModel) {
				simulator.setModel(newModel)
				//run.reset()
			}
		}
	},
	computed: {
		showContextMenu() {
			return store.diagram.menu !== null &&
					store.view === View.Diagram && store.canEdit
		},
		sidebar() {
			return store.tab.sideBar
		},
		model() {
			return store.model.model
		}
	},
	created() {
        app.setTab(Run)
		// Detect when simulator changes
		simulator.bus.$on(Event.UPDATE, () => {
			app.runService.sync()
		})
		// TODO: Find better way
		setInterval(() => app.notebookService.save(), 500)
	},
	components: { ActionBar, SideBar, Middle, ContextMenu }
})

</script>