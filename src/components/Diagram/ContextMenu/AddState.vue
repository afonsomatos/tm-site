<template>
    <div class="v-menu">
        <icon-btn icon="circle-add" @click="addState" :clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'

import IconBtn from "@/components/IconBtn.vue"
import Mutation from "@/store/modules/diagram/mutation"
import { Model, State } from "@/shared/model"

export default Vue.extend({
    components: { IconBtn },
    methods: {
        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        }),
        addState() {

            let graph = this.$store.state.diagram.graph

            let transform = graph.transform
            let [x, y] = this.$store.state.diagram.position

            let position = {
                x: (x - transform.x) / transform.k,
                y: (y - transform.y) / transform.k
            }

            graph.model.addState({
                position,
                label: "X"
            })

            graph.update()

            this.setMenu(null)
        }
    }
})
</script>

<style lang="scss" scoped>

.v-menu {
    border-radius: 6px;
    display: grid;
    grid-gap: 20px;
    font-size: 30px;
    padding: 10px 8px;
}

</style>