<template>
    <div>
        <component :is="editor[currentEditor]" />
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import TransitionEditor from "./TransitionEditor.vue"
import CharEditor from "./CharEditor.vue"
import StateEditor from "./StateEditor.vue"

import { Mode } from "@/store/modules/table"

export default Vue.extend({
    components: { TransitionEditor, StateEditor, CharEditor },
    data() {
        return {
            editor: {
                [Mode.Transition]: TransitionEditor,
                [Mode.Char]: CharEditor,
                [Mode.State]: StateEditor
            }
        }
    },
    computed: {
        currentEditor() {
            console.log(this.$store.state.table.mode)
            return this.$store.state.table.mode
        }
    },
})

</script>
