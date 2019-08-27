<template>
    <div class="tape-viewer">
        <Tape />
        <div class="controllers">
            <div>
                <!---->
            </div>
            <div>
                <IconBtn icon="replay" :clickable="true" @click="back" :disable="!loaded"/>

                <IconBtn v-if="playing" icon="pause" :clickable="true" @click="pause"           :disable="!loaded"/>
                <IconBtn v-else-if="paused" icon="play" :clickable="true" @click="resume" :disable="!loaded"/>

                <IconBtn icon="redo"   :clickable="true" @click="step" :disable="!loaded"/>
            </div>
            <div>
                <IconBtn icon="repeat" :clickable="true" @click="repeat" :disable="!loaded" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex';

import _ from "lodash"
import IconBtn from "@/components/IconBtn.vue"
import Tape from "./Tape.vue"
import Getter from "@/store/getter"
import Action from "@/store/action"
import { Status } from "@/store/run.module"

export default Vue.extend({
    components: { IconBtn, Tape },
    computed: {
        ...mapGetters({ status: Getter.STATUS, loaded: Getter.LOADED }),

        playing() {
            return this.status === Status.Playing
        },

        paused() {
            return this.status === Status.Paused
        },

        stepThrottle() {
            return _.throttle(
                () => this.$store.dispatch(Action.STEP),
                this.$store.state.run.step,
                { trailing: false })
        }
    },
    methods: {
        ...mapActions({
            resume: Action.RESUME,
            pause:  Action.PAUSE,
            repeat: Action.REPEAT,
            backAction:   Action.BACK
        }),

        step() {
            if (!this.playing)
                this.stepThrottle()
        },

        back() {
            if (!this.playing)
                this.backAction()
        }
    }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

$cell-size: 60px;

.controllers {
    display: grid;
    grid-template-columns: min-content auto min-content;
    place-items: center;
    margin-top: 20px;

    > div {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 30px;
    }
}

.cell {
    width: $cell-size;
    height: $cell-size;
    font: $tape-font-big;
    line-height: $cell-size;
    text-align: center;
    border-right: 1px solid #D2D2D2;
}

.cursor {
    position: absolute;
    width: $cell-size;
    color: $color-active;
    font-size: 50px;
    bottom: 0;
    margin-bottom: -21px;
    vertical-align: text-bottom;
    text-align: center;
}

.tape-viewer {
    //border: 1px solid #C4C4C4;
    border-bottom: none;
    font-size: 38px;
    padding: 20px;
    background: $color-gray-2;
}

</style>