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

import Tab, { ALL_TABS, Tabs } from "@/components/Tab"
import global from "@/store/global"

export default Vue.extend({
    data() {
        return {
            tabs: ALL_TABS,
            global: global.state
        }
    },
    methods: {
        isTab(tab: Tab) {
            return global.tab === tab
        },
        switchTab(tab: Tab) {
            global.tab = tab
        }
    },
    created() {
        global.tab = Tabs.Run
    },
    components: { Action },
})

</script>
