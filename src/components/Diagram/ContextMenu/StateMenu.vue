<template>
    <div class="v-menu">
        <icon name="create" @click="setMenu('rename')" />
        <icon name="delete" class="red" @click="remove" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from "./Icon.vue"
import { mapActions, mapMutations } from 'vuex'

import Action from "@/store/modules/diagram/action"
import Mutation from '@/store/modules/diagram/mutation'

export default Vue.extend({
    components: { Icon },
    methods: {

        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        }),

        ...mapActions("diagram", {
            delete: Action.DELETE_STATE
        }),

        remove() {
            this.delete()
            this.setMenu(null)
        }
    }
})
</script>

<style lang="scss" scoped>
.v-menu {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 0px 40px 6px rgba(0, 0, 0, 0.3);

    display: grid;
    grid-gap: 20px;
    padding: 20px 15px;
}

.red {
    color: red;
}
</style>