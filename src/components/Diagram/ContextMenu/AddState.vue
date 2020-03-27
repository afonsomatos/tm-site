<template>
    <div class="v-menu">
        <icon-btn title="Add a new state" icon="circle-add" @click="add" :clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapActions } from 'vuex'

import IconBtn from "@/components/IconBtn.vue"

import Action from "@/store/modules/diagram/action"
import Mutation from "@/store/modules/diagram/mutation"

import { Model, State } from "@/shared/model"
import { app } from '../../../shared/app'

export default Vue.extend({
    components: { IconBtn },
    methods: {
        add() {
            app.diagramService.addState()
            app.diagramService.setContextMenu(null)
        }
    }
})
</script>

<style lang="scss" scoped>

.v-menu {
    display: grid;
    grid-gap: 20px;
    font-size: 30px;
    padding: 10px 8px;
}

</style>