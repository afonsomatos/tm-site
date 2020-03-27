<template>
    <div class="v-menu">
        <icon-btn title="Transition to other states" icon="right-arrow-alt" @click="createTransition" :clickable="true" />
        <icon-btn title="Rename this state" icon="edit" @click="edit" :clickable="true" />

        <!-- Show dot that represents current state type -->
        <icon-btn title="Change this state's type" :icon="stateIcon" :class="type" :clickable="true" @click="swatch" />
        
        <icon-btn title="Delete this state" icon="delete" class="red" @click="remove" :clickable="true" />
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
import { app } from '../../../shared/app'

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

        ...mapActions("diagram", {
            newTransition: Action.CREATE_TRANSITION,
            delete: Action.DELETE_STATE
        }),

        swatch() {
            app.diagramService.setContextMenu("swatch")
        },
        
        edit() {
            app.diagramService.setContextMenu('rename')
        },

        remove() {
            this.delete()
            app.diagramService.setContextMenu(null)
        },

        createTransition() {
            this.newTransition()
            app.diagramService.setContextMenu(null)
        }
    }
})
</script>

<style lang="scss" scoped>

.v-menu {
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
    color: #D94444;
}
</style>