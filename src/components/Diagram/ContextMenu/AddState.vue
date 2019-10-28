<template>
    <div class="v-menu">
        <icon-btn icon="circle-add" @click="addState" :clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconBtn from "@/components/IconBtn.vue"
import { mapActions, mapMutations, mapGetters } from 'vuex'

import Action from "@/store/modules/diagram/action"
import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"

export default Vue.extend({
    components: { IconBtn },
    methods: {
        
        ...mapMutations({
            setPosition: Mutation.SET_POSITION
        }),

        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        }),

        ...mapActions("diagram", {
            delete: Action.DELETE_STATE,
            add: Action.ADD_STATE,
        }),

        remove() {
            this.delete()
            this.setMenu(null)
        },

        addState() {
            this.add()
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