<template>
    <div class="middle">
        <div class="top">
            <Icon class="icon" icon="share"   @click.native="showDiagram()"   :class="{ active: isDiagram() }"/>
            <Icon class="icon" icon="grid_on" @click.native="showGrid()"      :class="{ active: isGrid() }"/>
        </div>
        <div class="main">
            <transition name="fade">
                <FunctionTable v-if="isGrid()" />
                <Diagram v-else />
            </transition>
        </div>
        <div class="float">
            <transition name="slide">
                <component v-bind:is="getFloat()"></component>   
            </transition>
        </div>
    </div>
</template>

<script lang="ts">

import Vue           from "vue"
import Icon          from "@/components/Icon.vue"
import FunctionTable from "@/components/FunctionTable/FunctionTable.vue"
import Diagram       from "@/components/Diagram/index.vue"

enum Mode { Diagram, Grid }

export default Vue.extend({
    methods: {
        getFloat() {
            return this.$store.state.currentTab.bottomFloat
        },
        showDiagram() {
            this.mode = Mode.Diagram
        },
        showGrid() {
            this.mode = Mode.Grid
        },
        isDiagram() {
            return this.mode === Mode.Diagram
        },
        isGrid() {
            return this.mode === Mode.Grid
        }
    },
    data() {
        return {
            mode: Mode.Diagram,
        }
    },
    components: { Icon, FunctionTable, Diagram }
})

</script>

<style lang="scss" scoped>

//fade
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


//slide 
.slide-leave-active,
.slide-enter-active {
  transition: 0.8s;
}
.slide-enter, .slide-leave-to {
  transform: translate(0, 100%);
}
.slide-enter-to, .slide-leave {
  transform: translate(0, 0);
}


.icon {
    cursor: pointer;
    transition: color 0.25s;

    &:active, &.active { color: #000; }
}

.middle {
    position: relative;
    background-color: #EFEFEF;
    overflow: hidden;
    display: grid;
    grid-template-rows: min-content auto min-content;
}

.float {
    width: 100%;
}

.top {
    height: 73px;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 20px;
    align-items: center;
    justify-content: center;
    align-content: center;
}

</style>