<template>
    <div id="table" class="wrapper">
        <div class="main">
            <div class="row-label">States</div>
            <div class="col-label">Characters</div>
			<!-- Here -->
			<table class="table state-rows" ref="table">
				<thead>
					<tr class="header-row">
						<td><!-- empty top left corner --></td>
						<td class="right-cell">
							<icon-btn icon="add" class="add-column" @click="addColumn" />
						</td>
					</tr>
				</thead>
				<tfoot>
					<tr class="bottom-row">
						<td class="left-cell">
							<icon-btn icon="add" class="add-row" @click="addRow" />
						</td>
					</tr>
				</tfoot>
			</table>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapActions, mapMutations } from "vuex" 
import { Action, Mutation } from "@/store/modules/table"

import Table from "@/shared/Table"
import IconBtn from "@/components/IconBtn.vue"

import { Transition, State } from "@/shared/model"

import global from "@/store/global"

export default Vue.extend({
    methods: {
		...mapMutations("table", {
			setState: Mutation.SET_STATE,
			setChar: Mutation.SET_CHAR,
			setTransition: Mutation.SET_TRANSITION
		}),
		...mapActions("table", {
			addRow: Action.ADD_STATE,
			addColumn: Action.ADD_CHARACTER,
		})
	},
	computed: { },
	data() {
		return {
			global,
			table: null
		}
	},
	activated() {
		this.table.update()
	},
	mounted() {

		let wrapper = this.$refs.table as HTMLTableElement
		let table = new Table(wrapper)

		table.onTransitionClick = (transition: Transition) => {
			console.log("transition clicked:", transition)
			this.setTransition(transition)
		}

		table.onStateClick = (state: State) => {
			console.log("state clicked:", state)
			this.setState(state)
		}

		table.onCharClick = (char: String) => {
			console.log("character clicked:", char)
			this.setChar(char)
		}

		this.table = table
		table.model = global.model
		this.$store.state.table.table = table
	},
	components: { IconBtn }
})

</script>

<style lang="scss" scoped>

.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    place-items: center;
    place-content: center;
}

.main {
    display: grid;
    grid-template-areas: "empty      col-label"
                         "row-label  table";
    grid-template-rows: min-content min-content;
    grid-template-columns: min-content auto;
    grid-column-gap: 50px;
    place-content: center;
    grid-row-gap: 40px;
    height: 100%;
}

.row-label {
	grid-area: row-label;
}

.col-label {
	grid-area: col-label;
}

.table {
	grid-area: table;
}

.row-label, .col-label {
    display: flex;
	place-items: center;
	font-weight: 500;
	color: #474747;
	letter-spacing: 2px;
    place-content: center;
}

</style>

<style lang="scss">

#table {
	@import "style";
}

</style>