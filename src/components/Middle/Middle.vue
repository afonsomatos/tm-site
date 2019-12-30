<template>
    <div class="middle">
        <div class="main">
            <!-- <transition name="fade"> -->
                <keep-alive> <!-- Keep alive will save the component's state -->
                    <Table v-if="isGrid" />
                    <Diagram v-else />
                </keep-alive>
            <!-- </transition> -->
            <div class="view-mode">
                <Icon class="icon" icon="diagram"   @click.native="showDiagram()"   :class="{ active: isDiagram }"/>
                <Icon class="icon" icon="grid"      @click.native="showGrid()"      :class="{ active: isGrid }"/>
            </div>
        </div>
        <div class="float">
            <transition name="slide">
                <component v-bind:is="getFloat()"></component>   
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

export default Vue.extend({
    methods: {
        getFloat() {
            return global.tab.bottomFloat
        },
        showDiagram() {
            global.view = View.Diagram
        },
        showGrid() {
            global.view = View.Grid
        }
    },
    computed: {
        isDiagram() {
            return global.view === View.Diagram
        },
        isGrid() {
            return global.view === View.Grid
        }
    },
    data() {
        return {
            global: global.state
        }
    },
    components: { Icon, Table, Diagram }
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