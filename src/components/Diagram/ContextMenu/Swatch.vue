<template>
    <div class="swatch">
        <icon-btn 
			v-for="(type, name) in types"
			:key="name"
			:title="name"
			:class="{ selected: type === stateType, [type]: true}"
			:icon="icon(type)"
			@click="set(type)"
			:clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import IconBtn from "@/components/IconBtn.vue"
import { Model, State, Type } from "@/shared/model"
import { app } from '../../../shared/app'
import { store } from '../../../shared/app/store'
import { Command } from '../../../shared/app/modelService'

export default Vue.extend({
	components: { IconBtn },
	data() {
		return {
			types: {
				"Normal": Type.Normal,
				"Accept": Type.Accept,
				"Reject": Type.Reject,
				"Start": Type.Start
			}
		}
	},
    computed: {
		stateType() {
			return store.diagram.type
		},
        state() {
            return store.diagram.state
        }
    },
    methods: {



		icon(type: Type) {
			return type === Type.Normal ? "dot-stroke" : "dot-fill"
		},
		set(type: Type) {
			app.modelService.execute(
				Command.editStateType(store.diagram.state, type)
			)
			app.diagramService.setContextMenu("state")
		}
    }
})
</script>

<style lang="scss" scoped>

.icon {
	padding: 10px 8px;
}

.start {
	&.selected { background: #cae8ff; } 
    color: #6DB4EB;
}

.reject {
    &.selected { background: #ffcbcb; }
    color: #E46A6A;
}

.accept {
    &.selected { background: #e6ffe8; }
    color: #6DEB7A;
}

.swatch {
    display: grid;
    grid-auto-flow: column;
	overflow: hidden;
	padding-left: 5px;
	padding-right: 5px;
}

</style>