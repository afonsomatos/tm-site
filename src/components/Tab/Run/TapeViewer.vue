<template>
    <div class="tape-viewer">
        <div id="tapeWrapper" ref="tapeWrapper" :class="status">

        </div>
        <div class="controllers">
            <div>
                <!---->
            </div>
            <div>
                <IconBtn icon="replay"  :clickable="true" @click="back" />
                <IconBtn icon="pause"   :clickable="true" @click="pause" v-if="playing"/>
                <IconBtn icon="play"    :clickable="true" @click="play" v-else />
                <IconBtn icon="redo"    :clickable="true" @click="stepThrottle" />
            </div>
            <div>
                <IconBtn icon="repeat"  :clickable="true" @click="reset"  />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import _ from "lodash"
import IconBtn from "@/components/IconBtn.vue"
import Tape, { Transition as SimpleTransition } from "@/shared/Tape"
import * as d3 from "d3"

import global from "@/store/global"

import simulator, { Event } from '@/shared/simulator'

import { Transition } from "@/tm"
import { Direction } from '@/shared/types'
import { Model } from '@/shared/model'
import { store } from '@/shared/app/store'
import { app } from '@/shared/app'

export default Vue.extend({
    components: { IconBtn },
    data() {
        return {
            global,
            tape: null,
            transition: null,
            resetTape: null,
        }
    },
    watch: {
        model(newModel: Model, oldModel: Model) {
            if (newModel !== oldModel)
                this.setupTapes()
        }
    },
    computed: {
        model: () => global.model,
        tapes: () => global.model.tapes,
        status: () => store.run.status,
        playing: () => store.run.playing,
        stepThrottle() {
            return _.throttle(
                () => app.runService.step(),
                simulator.interval,
                { trailing: false })
        },
    },
    methods: {
        play: () => app.runService.play(),
        pause: () => app.runService.pause(),
        back: () => app.runService.back(),
        reset: () => app.runService.reset(),
        step: () => app.runService.step(),
        setupTapes() {

            // Refresh model and default tape
            simulator.setModel(global.model)
            simulator.load(Array(global.model.tapes).fill(""))
            simulator.reset()
            
            let tapeWrapper = d3.select(this.$refs.tapeWrapper as HTMLElement)
            tapeWrapper.html(null)

            this.tape = _.times(this.tapes, i => {

                let tapeEl = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                tapeEl.setAttribute("class", "tape");
                (this.$refs.tapeWrapper).appendChild(tapeEl)

                let tape = new Tape(tapeEl as any,
                     () => simulator.turing.snapshot.head[i],
                     () => simulator.turing.snapshot.tape[i]
                )
                return tape
            })

        }
    },
    mounted() {
        
        this.setupTapes()
    
        // Sync when resetting
        this.resetTape = () => {
            this.tape.forEach((x: Tape) => x.reset())
        }
        
        simulator.bus.$on([Event.BACK, Event.RESET], this.resetTape)

        // Animate transition
        this.transition = (t: Transition) => {
            this.tape.forEach((x: Tape, i: number) => {
                return x.transition({
                    read: t.read[i],
                    write: t.write[i],
                    direction: [Direction.Left, Direction.Stay, Direction.Right][t.direction[i] + 1]
                })
            })
        }

        simulator.bus.$on(Event.TRANSITION, this.transition)

        window.addEventListener("resize", this.resetTape)
    },
    destroyed() {
        // Once we close our tape, we can halt the simulator
        app.runService.pause()
        
        // Stop listening for simulator events
        simulator.bus.$off([Event.UPDATE, Event.BACK], this.resetTape)
        simulator.bus.$off(Event.TRANSITION, this.transition)

        // Stop listening for window resizes (we no longer need to resize our tape after it's destroyed)
        window.removeEventListener("resize", this.resetTape)
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
    font-size: 38px;
    padding: 20px;
    background: $color-gray-2;
}

</style>

<style lang="scss">

@import "src/style/Lib";

#tapeWrapper {
    border: 2px solid $color-active;
    border-left: none;
    border-right: none;

    &.rejected, &.undefined { border-color: $color-negative; }
    &.accepted { border-color: $color-positive; }
    &.idle { border-color: $color-normal; }

    .tape {
        display: block;
        width: 100%;

        border-bottom: 1px solid #D2D2D2;

        .cursor {
            fill: $color-active;
            visibility: hidden;
        }

        .rect {
            fill: white;
        }

        text {
            font: bold 32px "Roboto Mono", monospace;

            &.head { fill: $color-active; }
        }

        &:last-child {
            border-bottom: none;
            .cursor {
                visibility: visible;
            }
        }
    }
}

</style>