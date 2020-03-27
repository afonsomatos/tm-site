<template>
    <div>
        <component :is="editor[currentEditor]" v-if="isGridView" />
        <Category name="machine" />
        <Section>
            <Field name="Tapes">
                <select title="Number of tapes" @change="changeTapes">
                    <option
                        v-for="(number, i) in [1, 2, 3, 4, 5]"
                        :key="i"
                        :selected="number === tapes">
                        {{ number }}
                    </option> 
                </select>
            </Field>
        </Section>
        <Section>
            <Field name="Wildcard">
                <Input
                    maxlength="1"
					class="char-input"
                    @input="renameWildcard($event)"
                    :value="model.wildcard"
					v-selectOnFocus
                />
            </Field>
            <Field name="Blank">
                <Input
                    maxlength="1"
					class="char-input"
                    @input="renameBlank($event)"
                    :value="model.blank"
					v-selectOnFocus
                />
            </Field>
        </Section>
</div>
</template>

<script lang="ts">

import Vue from "vue"
import Transition from "./Transition.vue"
import Char from "./Char.vue"
import State from "./State.vue"

import Section from "@/components/SideBar/Section.vue"
import Category from "@/components/SideBar/Category.vue"
import Field from "@/components/SideBar/Field.vue"
import Input from "@/components/Input.vue"

import { Mode } from "@/store/modules/table"
import global, { View } from "@/store/global"
import { store } from "@/shared/app/store"

export default Vue.extend({
    components: { Transition, State, Char, Section, Field, Input, Category },
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
    methods: {
        changeTapes(e) {
            let tapes: number = e.target.value
            store.model.model.tapes = Number(tapes)
            store.model.model.normalize()
            this.$store.state.diagram.graph.update()
        },
        renameBlank(value: string) {
            store.model.model.blank = value || store.model.model.blank
        },
        renameWildcard(value: string) {
            store.model.model.wildcard = value || undefined
        }
    },
    computed: {
        model() {
            return store.model.model
        },
        tapes() {
            return store.model.model.tapes
        },
        isGridView() {
            return store.view === View.Grid
        },
        currentEditor() {
            return this.$store.state.table.mode
        }
    },
})

</script>

<style lang="scss" scoped>

select {
    padding: 3px 20px;
}

.char-input {
    box-sizing: content-box;
    text-align: center;
    width: 1em;
}

</style>
