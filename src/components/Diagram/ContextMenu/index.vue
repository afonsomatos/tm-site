<template>
    <div class="wrapper" :style="{ left: x + 'px', top: y + 'px' }">
        <component :is="menus[currentMenu]" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import StateMenu from "./StateMenu.vue"
import TransitionMenu from "./TransitionMenu.vue"
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
}

</style>