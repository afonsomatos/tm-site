<template>
    <div class="v-menu">
        <div class="add">
            <icon-btn icon="add" @click="add" />
        </div>
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
import { Direction } from "@/shared/types"
import { Link, Transition } from "@/shared/model"

import Graph from "@/components/Diagram/Graph/index"

import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"
import { app } from '../../../shared/app'
import { store } from '@/shared/app/store'

export default Vue.extend({
    components: { IconBtn },
    data() {
        return {
            transitions: []
        }
    },
    mounted() {
        this.transitions = store.model.model.linkToTransitions(store.diagram.link)
        // This link is empty!
        if (this.transitions.length === 0) {
            app.diagramService.setContextMenu(null)
        }
    },
    methods: {

        text(transition: Transition): string {
            return `${transition.read.join('')} → ${transition.write.join('')}, ` + transition.direction.join('')
        },

        add() {
            let diagram = this.$store.state.diagram
            let link: Link = store.diagram.link
            let graph: Graph = diagram.graph

            let transition = graph.createTransition(link.from, link.to)
            this.clickTransition(transition)
        },

        clickTransition(transition: Transition) {
            app.diagramService.setEditTransition(transition)
            app.diagramService.setContextMenu("editTransition")
        }
    },
})
</script>

<style lang="scss" scoped>
.v-menu {
    text-align: center;
    overflow: hidden;
    font-size: 20px;
    white-space: nowrap;
    color: #616161;
}

.add {
    font-size: 24px;
    padding: 4px 0px;
}

.group {
    > div {
        font-weight: 600;
        letter-spacing: 5px;
        cursor: pointer;
        padding: 10px 15px;
        background: #F3F3F3;
    }

    > div:nth-child(2n) {
        background: #F9F9F9;
    }
}
</style>