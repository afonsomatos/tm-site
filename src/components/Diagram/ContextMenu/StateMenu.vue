<template>
    <div class="v-menu">
        <icon-btn icon="right-arrow-alt" @click="createTransition" :clickable="true" />
        <icon-btn icon="edit" @click="edit" :clickable="true" />

        <!-- Show dot that represents current state type -->
        <icon-btn :icon="stateIcon" :class="type" :clickable="true" @click="swatch" />
        
        <icon-btn icon="delete" class="red" @click="remove" :clickable="true" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconBtn from "@/components/IconBtn.vue"
import { mapActions, mapMutations, mapGetters } from 'vuex'

import Action from "@/store/modules/diagram/action"
import Getter from "@/store/modules/diagram/getter"
import Mutation from '@/store/modules/diagram/mutation'

import { State, Model, Type } from "@/shared/model"

export default Vue.extend({
    components: { IconBtn },
    computed: {
        ...mapGetters("diagram", {
            type: Getter.STATE_TYPE  
        }),

        stateIcon() {
            return this.type === Type.Normal ? "dot-stroke" : "dot-fill"
        },
    },
    methods: {

        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        }),

        ...mapActions("diagram", {
            newTransition: Action.CREATE_TRANSITION,
            delete: Action.DELETE_STATE
        }),

        swatch() {
            this.setMenu("swatch")
        },
        
        edit() {
            this.setMenu('rename')
        },

        remove() {
            this.delete()
            this.setMenu(null)
        },

        createTransition() {
            this.newTransition()
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


.start {
    color: #6DB4EB;
}

.reject {
    color: #E46A6A;
}

.accept {
    color: #6DEB7A;
}

.red {
    color: red;
}
</style>