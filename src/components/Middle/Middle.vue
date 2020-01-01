<template>
    <div class="middle">
        <div class="main">
            <keep-alive> <!-- Keep alive will save the component's state -->
                <Table v-if="isGrid" />
                <Diagram v-else />
            </keep-alive>
            <div class="view-mode">
                <Icon class="icon" icon="diagram"   @click.native="showDiagram()"   :class="{ active: isDiagram }"/>
                <Icon class="icon" icon="grid"      @click.native="showGrid()"      :class="{ active: isGrid }"/>
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

import * as d3 from "d3"

export default Vue.extend({
    methods: {
        showDiagram() {
            global.view = View.Diagram
        },
        showGrid() {
            global.view = View.Grid
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
            return global.tab.bottomFloat
        },
        isDiagram() {
            return global.view === View.Diagram
        },
        isGrid() {
            return global.view === View.Grid
        }
    },
    data() {
        return {
            floatTransitionDuration: 800,
            global,
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
    background-color: #E8E8E8;

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

.view-mode {
    font-size: 28px;
    left: 50%;
    top: 10px;
    transform: translate(-50%, 0);
    display: flex;
    z-index: 1;
    border: 1px solid #e0e0e0;
    position: absolute;
}

</style>