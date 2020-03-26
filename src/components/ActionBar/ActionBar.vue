<template>
    <div class="action-bar">
        <div class="top">
            <Action
                v-for="(tab, i) in tabs"
                :key="i"
                :icon="tab.tabIcon"
                :selected="isTab(tab)"
                :title="tab.name"
                @click.native="switchTab(tab)"
                />
        </div>

        <div class="bottom">
            <a target="_blank" href="https://github.com/afonsomatos/tm-site/tree/master/docs">
                <Action title="See documentation on Github" icon="help" />
            </a>
            <a href="http://github.com/afonsomatos/tm-site.git">
                <Action title="See project on Github" icon="github" />
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

import Edit      from "@/components/Tab/Edit"
import Run       from "@/components/Tab/Run"
import Notebook  from "@/components/Tab/Notebook"

import Tab from "@/components/Tab"

import { store } from "@/shared/app/store"
import { app } from "@/shared/app"

export default Vue.extend({
    data() {
        return {
            tabs: [Run, Edit, Notebook]
        }
    },
    methods: {
        isTab(tab: Tab) {
            return store.tab === tab
        },
        switchTab(tab: Tab) {
            app.setTab(tab)
        }
    },
    components: { Action },
})

</script>
