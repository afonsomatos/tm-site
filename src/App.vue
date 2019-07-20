<template>
    <div class="main">
        <ActionBar />
        <Middle />

        <SideBar>
            <transition name="fade" mode="out-in">
                <component v-bind:is="getSideBar()"></component>
            </transition>
        </SideBar>
    </div>
</template>

<style lang="scss" scoped>

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.2s ease;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
  opacity: 0;
}

.main {
    width: 100%;
    height: 100%;
    display: grid;
	grid-template-columns: min-content auto min-content;
}

</style>

<style lang="scss">

@import "src/style/Base.scss";

</style>

<script lang="ts">

import Vue          from "vue"
import VueRouter    from "vue-router"
import ActionBar    from "@/components/ActionBar/ActionBar.vue"
import SideBar      from "@/components/SideBar/SideBar.vue"
import Middle       from "@/components/Middle/Middle.vue"

export default Vue.extend({
    methods: {
        getSideBar() {
            return this.$store.state.currentTab.sideBar
        }
    },
    components: { ActionBar, SideBar, Middle }
})

</script>