<template>
    <div>
        <component :is="editor[currentEditor]" />
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import Transition from "./Transition.vue"
import Char from "./Char.vue"
import State from "./State.vue"

import { Mode } from "@/store/modules/table"

export default Vue.extend({
    components: { Transition, State, Char },
    data() {
        return {
            editor: {
                [Mode.Transition]: Transition,
                [Mode.Char]: Char,
                [Mode.State]: State
            }
        }
    },
    computed: {
        currentEditor() {
            return this.$store.state.table.mode
        }
    },
})

</script>
