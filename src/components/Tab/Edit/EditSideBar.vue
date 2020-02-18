<template>
    <div>
        <component :is="editor[currentEditor]" v-if="isGridView" />
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import Transition from "./Transition.vue"
import Char from "./Char.vue"
import State from "./State.vue"

import { Mode } from "@/store/modules/table"
import global, { View } from "@/store/global"

export default Vue.extend({
    components: { Transition, State, Char },
    data() {
        return {
            global,
            editor: {
                [Mode.Transition]: Transition,
                [Mode.Char]: Char,
                [Mode.State]: State
            }
        }
    },
    computed: {
        isGridView() {
            return global.view === View.Grid
        },
        currentEditor() {
            return this.$store.state.table.mode
        }
    },
})

</script>
