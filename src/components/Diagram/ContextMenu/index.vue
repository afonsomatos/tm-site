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

import { mapGetters } from "vuex"
import Getter from "@/store/modules/diagram/getter"

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
                rename: Rename,
                editTransition: EditTransition,
                addState: AddState,
            } 
        }
    },
    computed: {

        ...mapGetters("diagram", {
            position: Getter.POSITION
        }),

        currentMenu() {
            return this.$store.state.diagram.menu
        },

        style() {
            let [left, top] = this.position 
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
    font-family: "Segoe UI semibold";
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.17);
    background-color: white;
    border-radius: 6px;
}

</style>