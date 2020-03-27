<template>
    <div class="middle">
        <div class="main">
            <keep-alive> <!-- Keep alive will save the component's state -->
                <Table v-if="isGrid" />
                <Diagram v-else />
            </keep-alive>
            <div class="top-bar">
                <select @change="changeModel">
                    <option
                        v-for="(model, i) in this.models"
                        :key="i"
                        :selected="selectedModel === model"
                        >
                        {{ displayName(model) }}
                    </option> 
                </select>
                <div class="view-mode" v-if="tapes === 1">
                    <Icon class="icon" icon="diagram"   @click.native="showDiagram()"   :class="{ active: isDiagram }"/>
                    <Icon class="icon" icon="grid"      @click.native="showGrid()"      :class="{ active: isGrid }" />
                </div>
            </div>
        </div>
        <div class="float">
            <transition
                @leave="leave"
                @enter="enter"
            >
                <component v-bind:is="bottom"></component>   
            </transition>
        </div>
    </div>
</template>

<script lang="ts">

import Vue      from "vue"
import Icon     from "@/components/Icon.vue"
import Table    from "@/components/Table/index.vue"
import Diagram  from "@/components/Diagram/index.vue"

import global, { View } from "@/store/global"
import { store } from "@/shared/app/store"

import * as d3 from "d3"
import { app } from "@/shared/app"

export default Vue.extend({
    methods: {
        displayName(model) {
            return store.notebook.notebook.modelUniqueName(model)
        },
        changeModel(e) {
            let index = e.target.selectedIndex
            app.modelService.setModel(this.models[index])
        },
        showDiagram() {
            app.setView(View.Diagram)
        },
        showGrid() {
            app.setView(View.Grid)
        },
        enter(el, done) {
            d3.select(el)
                .style("margin-bottom", -el.clientHeight + "px")
                .transition()
                .duration(this.floatTransitionDuration)
                .style("margin-bottom", "0px")
                .on("end", done)
        },
        leave(el, done) {
            d3.select(el)
                .transition()
                .duration(this.floatTransitionDuration)
                .style("margin-bottom", -el.clientHeight + "px")
                .on("end", done)
        },
    },
    computed: {
        bottom() {
            return store.tab.bottomFloat
        },
        isDiagram() {
            return store.view === View.Diagram
        },
        isGrid() {
            return store.view === View.Grid
        },
        models() {
            return store.notebook.notebook.models
        },
        selectedModel() {
            return store.model.model
        },
        tapes() {
            return store.model.model.tapes
        }
    },
    data() {
        return {
            floatTransitionDuration: 800,
            global,
        }
    },
    watch: {
        tapes(tapes: number) {
            // Temporarily switch to diagram view for multiple-tapes 
            if (tapes > 1 && store.view === View.Grid) {
                app.setView(View.Diagram)
            }
        }
    },
    components: { Icon, Table, Diagram }
})

</script>

<style lang="scss" scoped>

.icon {
    cursor: pointer;
    transition: color 0.25s;
    padding: 10px;
    color: #444;

    &:active, &.active {
        color: #5A73EF;
    }

}

.main {
    position: relative;
}

.middle {
    position: relative;
    background-color: #EFEFEF;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto min-content;
}

.float {
    width: 100%;
}

.top-bar {
    left: 50%;
    transform: translate(-50%, 0);
    position: absolute;
    z-index: 1;
    top: 10px;
}

select {
    margin-right: 20px;
    vertical-align: super;
    padding: 5px 10px;
    font-size: 14px;
    -moz-appearance: toolbox;
}

.view-mode {
    font-size: 28px;
    display: inline-flex;
}

</style>