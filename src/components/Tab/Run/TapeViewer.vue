<template>
    <div class="tape-viewer">
        <Tape />
        <div class="controllers">
            <div>
                <!---->
            </div>
            <div>
                <Icon icon="replay" :clickable="true" @click="resume" />

                <Icon v-if="playing" icon="pause" :clickable="true" @click="pause" />
                <Icon v-else-if="paused" icon="play_arrow" :clickable="true" @click="resume" />

                <Icon icon="redo"   :clickable="true" />
            </div>
            <div>
                <Icon icon="repeat" :clickable="true" @click="repeat" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex';

import Icon from "@/components/Icon.vue"
import Tape from "./Tape.vue"
import Getter from "@/store/getter"
import Action from "@/store/action"
import { Status } from "@/store/run.module"

export default Vue.extend({
    components: { Icon, Tape },
    computed: {
        ...mapGetters({ status: Getter.STATUS }),

        playing() {
            return this.status === Status.Playing
        },

        paused() {
            return this.status === Status.Paused
        }
    },
    methods: {
        ...mapActions({
            resume: Action.RESUME,
            pause:  Action.PAUSE,
            repeat: Action.REPEAT
        })
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
    padding: 20px;
    background: $side-background;
}

</style>