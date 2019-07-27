<template>
    <div>
        <StateEditor        v-if="$store.getters.isEditingState" />
        <CharEditor         v-if="$store.getters.isEditingChar" />
        <TransitionEditor   v-else-if="$store.getters.isEditingTransition" />
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import TransitionEditor from "./TransitionEditor.vue"
import CharEditor from "./CharEditor.vue"
import StateEditor from "./StateEditor.vue"

export default Vue.extend({
    components: { TransitionEditor, StateEditor, CharEditor }
})

</script>

<style lang="scss" scoped>
</style>
