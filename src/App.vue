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

import run from "@/store/run"
import global from "@/store/global"

export default Vue.extend({
	data() {
		return {
			global, run
		}
	},
    computed: {
		showContextMenu() {
			return this.$store.state.diagram.menu !== null
		},
        sidebar() {
            return global.tab.sideBar
        }
	},
    created() {
		// Set model of simulator
		simulator.setModel(global.model) 
		// Detect when simulator changes
		simulator.bus.$on(Event.UPDATE, () => {
			run.sync()
		})
    },
    components: { ActionBar, SideBar, Middle, ContextMenu }
})

</script>