<template>
    <div class="wrapper" :style="{ left: x + 'px', top: y + 'px' }">
        <component :is="menus[currentMenu]" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import StateMenu from "./StateMenu.vue"
import TransitionMenu from "./TransitionMenu.vue"
import EditTransition from "./EditTransition.vue"
import Rename from "./Rename.vue"

export default Vue.extend({
    components: {
        StateMenu,
        Rename,
        TransitionMenu,
    },
    props: {
        x: {
            type: Number,
            default: 400
        },
        y: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {
            menus: {
                state: StateMenu,
                transition: TransitionMenu,
                rename: Rename,
                editTransition: EditTransition,
            } 
        }
    },
    computed: {
        currentMenu() {
            return this.$store.state.diagram.menu
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