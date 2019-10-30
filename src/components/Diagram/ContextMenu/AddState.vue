<template>
    <div class="v-menu">
        <icon-btn icon="circle-add" @click="add" :clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapActions } from 'vuex'

import IconBtn from "@/components/IconBtn.vue"

import Action from "@/store/modules/diagram/action"
import Mutation from "@/store/modules/diagram/mutation"

import { Model, State } from "@/shared/model"

export default Vue.extend({
    components: { IconBtn },
    methods: {
        ...mapActions("diagram", {
            addState: Action.ADD_STATE
        }),
        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        }),
        add() {
            this.addState()
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