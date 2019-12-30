<template>
    <div class="action-bar">
        <div class="top">
            <Action
                v-for="(tab, index) in tabs"
                :key="index"
                :icon="tab.tabIcon"
                :selected="isTab(tab)"
            
                @click.native="switchTab(tab)"
                />
        </div>

        <div class="bottom">
            <a href="http://github.com/afonsomatos/tm-site.git">
                <Action icon="github" />
            </a>
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

import { Mutation } from "@/store"
import Tab, { ALL_TABS, Tabs } from "@/components/Tab"

export default Vue.extend({
    data() {
        return {
            tabs: ALL_TABS
        }
    },
    methods: {
        ...mapMutations({
            setTab: Mutation.SET_TAB
        }),
        isTab(tab: Tab) {
            return this.$store.state.currentTab === tab
        },
        switchTab(tab: Tab) {
            if (this.isTab(tab)) return
            this.setTab(tab)
        }
    },
    components: { Action },
})

</script>
