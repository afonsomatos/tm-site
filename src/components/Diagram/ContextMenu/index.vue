<template>
    <div class="wrapper" :style="style">
        <component :is="menus[currentMenu]" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import StateMenu from "./StateMenu.vue"
import LinkMenu from "./LinkMenu.vue"
import EditTransition from "./EditTransition.vue"
import Rename from "./Rename.vue"
import AddState from "./AddState.vue"
import Swatch from "./Swatch.vue"

import { store } from '../../../shared/app/store'

export default Vue.extend({
    components: {
        StateMenu,
        Rename,
        LinkMenu,
    },
    data() {
        return {
            menus: {
                state: StateMenu,
                link: LinkMenu,
                swatch: Swatch,
                rename: Rename,
                editTransition: EditTransition,
                addState: AddState,
            } 
        }
    },
    computed: {

        position() {
            return store.diagram.contextMenuPosition
        },

        currentMenu() {
            return store.diagram.menu
        },

        style() {
            let {x: left, y: top} = this.position 
            return {
                left: left + "px",
                top: top + "px"
            }
        }
    }
})
</script>

<style lang="scss" scoped>

.wrapper {
    position: absolute;
    color: #616161;
    font-size: 24px;
    border-radius: 6px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.09);
    overflow: hidden;
    background-color: white;
}

</style>