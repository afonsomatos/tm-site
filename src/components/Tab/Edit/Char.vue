<template>
    <Section title="Edit Char">
        <Input v-focus :value="char" :key="char" @input.native="setChar" maxlength="1" @focus.native="$event.target.select()"/>
        <br><br>
        <Button class="danger" value="Delete column" @click.native="deleteReadChar()"/>
    </Section>
</template>

<script lang="ts">

import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Input    from "@/components/Input.vue"
import Button   from "@/components/Button.vue"

import Mutation from "@/store/mutation"

export default Vue.extend({
    
    computed: {

        charId() {
            return this.$store.state.edit.char
        },

        char() {
            return this.$store.state.model.readChars[this.charId]
        },

    },

    methods: {

        deleteReadChar() {
            this.$store.commit(Mutation.DELETE_READ_CHAR, this.$store.state.edit.char)
            this.$store.commit(Mutation.SET_NO_EDITING)
        },

        setChar(e) {
            this.$store.commit(Mutation.SET_READ_CHAR, {
                charId: this.charId,
                char: e.target.value
            })
        }

    },
    
    components: { Section, Input, Button }
})

</script>

<style lang="scss" scoped>
</style>