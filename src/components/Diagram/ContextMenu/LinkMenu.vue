<template>
    <div class="v-menu">
        <icon-btn icon="add" class="add" @click="add" />
        <div class="group">
            <div v-for="(t, i) in transitions" :key="i" @click="clickTransition(t)">
                {{ text(t) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

import IconBtn from "@/components/IconBtn.vue"
import { Transition, Direction } from "@/shared/types"

import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"

export default Vue.extend({
    components: { IconBtn },
    data() {
        return {
            transitions: []
        }
    },
    mounted() {
        let state = this.$store.state.diagram
        this.transitions = state.graph.model.linkToTransitions(state.link)
        // This link is empty!
        if (this.transitions.length === 0) {
            this.setMenu(null)
        }
    },
    methods: {
        ...mapMutations("diagram", {
            selectTransition: Mutation.SELECT_TRANSITION,
            setMenu: Mutation.SET_MENU,
        }),

        text(transition: Transition): string {
            return `${transition.read} → ${transition.write}, ` + transition.direction
        },

        add() {
            console.log("New transition was added!")
        },

        clickTransition(transition: Transition) {
            this.selectTransition(transition)
            this.setMenu("editTransition")
        }
    },
})
</script>

<style lang="scss" scoped>
.v-menu {
    text-align: center;
    overflow: hidden;
    background-color: white;
    font-size: 20px;
    white-space: nowrap;
    color: #616161;
    border-radius: 6px;
}

.add {
    padding: 12px 0px;
}

.group {
    > div {
        font-family: "Segoe UI semibold";
        letter-spacing: 5px;
        cursor: pointer;
        padding: 10px 15px;
        background: #eee;
    }

    > div:nth-child(2n) {
        background: #e0e0e0;
    }
}
</style>