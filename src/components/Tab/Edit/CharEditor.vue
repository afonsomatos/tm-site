<template>
    <Section title="Edit Char">
        <Input :value="char" :key="char" @input.native="setChar" maxlength="1" @focus.native="$event.target.select()"/>
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

        char() {
            return this.$store.state.model.readChars[this.$store.state.edit.char]
        },

    },

    methods: {

        deleteReadChar() {
            this.$store.commit(Mutation.DELETE_READ_CHAR, this.$store.state.edit.char)
        },

        // deleteChar() {
        //     this.$store.commit(Mutation.SET_NO_EDITING)
        //     this.$store.commit(Mutation.DELETE_CHAR_COLUMN, this.char)
        // },

        setChar(e) {
            Vue.set(this.$store.state.model.readChars, this.$store.state.edit.char, e.target.value)
        }

    },
    
    components: { Section, Input, Button }
})

</script>

<style lang="scss" scoped>
</style>