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
							<icon-btn icon="add" class="add-column" />
						</td>
					</tr>
				</thead>
				<tfoot>
					<tr class="bottom-row">
						<td class="left-cell">
							<icon-btn icon="add" class="add-row" />
						</td>
					</tr>
				</tfoot>
			</table>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Table from "@/shared/Table"
import IconBtn from "@/components/IconBtn.vue"

export default Vue.extend({
    methods: { },
	computed: { },
	data() {
		return {
			table: null
		}
	},
	activated() {
		this.table.update()
	},
	mounted() {

		let wrapper = this.$refs.table as HTMLTableElement
		let table = new Table(wrapper)

		this.table = table
		table.model = this.$store.state.nextModel
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