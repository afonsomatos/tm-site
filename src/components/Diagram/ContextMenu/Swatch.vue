<template>
    <div class="swatch">
        <icon-btn 
			v-for="(type, i) in types"
			:key="i"
			:class="{ selected: type === stateType, [type]: true}"
			:icon="icon(type)"
			@click="set(type)"
			:clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { mapMutations, mapGetters, mapActions } from 'vuex'
import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"
import Action from "@/store/modules/diagram/action"

import IconBtn from "@/components/IconBtn.vue"
import { Model, State, Type } from "@/shared/model"

export default Vue.extend({
	components: { IconBtn },
	data() {
		return {
			types: [ Type.Normal, Type.Accept, Type.Reject, Type.Start ]
		}
	},
    computed: {
		...mapGetters("diagram", {
			stateType: Getter.STATE_TYPE
		}),
        state() {
            return this.$store.state.diagram.state
        }
    },
    methods: {

        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
		}),
		...mapActions("diagram", {
			setStateType: Action.SET_STATE_TYPE
		}),
		icon(type: Type) {
			return type === Type.Normal ? "dot-stroke" : "dot-fill"
		},
		set(type: Type) {
			this.setStateType(type)
			this.setMenu("state")
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
}

</style>