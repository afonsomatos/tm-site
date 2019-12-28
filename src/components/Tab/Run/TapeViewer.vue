<template>
    <div class="tape-viewer">
        <svg id="tape" ref="tape" :class="status">

        </svg>
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
import Tape from "@/shared/Tape"
import Getter from "@/store/getter"
import { Mutation, Action, Status } from "@/store/modules/run"

import simulator, { Event } from '@/shared/simulator'

export default Vue.extend({
    components: { IconBtn },
    data() {
        return {
            tape: null,
            transition: null,
            resetTape: null,
        }
    },
    computed: {
        ...mapState("run", {
            playing: "playing"
        }),
        status() {
            return this.$store.state.run.status
        },
        stepThrottle() {
            return _.throttle(
                () => this.step(),
                simulator.interval,
                { trailing: false })
        },
    },
    methods: {
        ...mapActions("run", {
            step: Action.STEP,
            pause: Action.PAUSE,
            play: Action.PLAY,
            back: Action.BACK,
            reset: Action.RESET
        }),
    },
    mounted() {
        this.tape = new Tape(this.$refs.tape as SVGSVGElement)
        
        // Sync when resetting
        this.resetTape = () => this.tape.reset()
        simulator.bus.$on([Event.BACK, Event.RESET], this.resetTape)

        // Animate transition
        this.transition = (t: unknown) => this.tape.transition(t)
        simulator.bus.$on(Event.TRANSITION, this.transition)

        window.addEventListener("resize", this.resetTape)
    },
    destroyed() {
        // Once we close our tape, we can halt the simulator
        this.pause()
        
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

<style lang="scss">

@import "src/style/Lib";

#tape {
    border: 2px solid $color-active;
    border-left: none;
    border-right: none;
    width: 100%;

    &.rejected, &.undefined { border-color: $color-negative; }
    &.accepted { border-color: $color-positive; }
    &.idle { border-color: $color-normal; }

    .cursor {
        fill: $color-active;
    }

    .rect {
        fill: white;
    }

    text {
        font: $tape-font-big;

        &.head { fill: $color-active; }
    }

}

</style>