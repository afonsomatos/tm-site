<template>
    <div class="action-bar">
        <div class="top">
            <Action
                v-for="(tab, index) in tabs"
                :key="index"
                :icon="tab.tabIcon"
                :selected="isTab(tab)"
            
                @click.native="setTab(tab)"
                />
        </div>

        <div class="bottom">
            <Action icon="code" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

@import "src/style/Lib";

.action-bar {
    display: grid;
    background: $side-background;
    grid-template-rows: auto min-content;
}

</style>

<script lang="ts">

import Vue from 'vue'
import { mapMutations } from "vuex"
import Action from "./Action.vue"

import Mutation from "@/store/mutation"
import Tab, { ALL_TABS } from "@/components/Tab"

export default Vue.extend({
    data() {
        return {
            tabs: ALL_TABS
        }
    },
    methods: {
        isTab(tab: Tab) {
            return this.$store.state.currentTab === tab
        },
        setTab(tab: Tab) {
            this.$store.commit(Mutation.SET_TAB, tab)
        }
    },
    components: { Action },
})

</script>
