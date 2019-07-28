<template>
    <Section title="Edit State">
        <Input v-focus :value="stateName" :key="state" @input.native="changeStateName" @focus.native="$event.target.select()"/>
        <br><br>
        <Button value="Set Accept" @click.native="setAccept()" />
        <Button value="Delete" @click.native="remove()" />
    </Section>
</template>

<script lang="ts">

import Vue from 'vue'
import Section from "@/components/SideBar/Section.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"

import Mutation from "@/store/mutation"

export default Vue.extend({
    computed: {
        isAccept() {
            return this.$store.state.model.accept === this.$store.state.edit.state
        },
        state() {
            return this.$store.state.edit.state
        },
        stateName() {
            return this.$store.state.model.states[this.state]
        }
    },
    methods: {
        
        remove() {
            this.$store.commit(Mutation.DELETE_STATE, this.state)
            this.$store.commit(Mutation.SET_NO_EDITING)
        },

        setAccept() {
            this.$store.commit(Mutation.SET_ACCEPT_STATE, this.state)
        },
        changeStateName(e) {
            let obj = { index: this.state, name: e.target.value }
            this.$store.commit(Mutation.SET_STATE_NAME, obj)
        }
    },
    components: { Section, Input, Button }
})

</script>


<style lang="scss" scoped>
</style>