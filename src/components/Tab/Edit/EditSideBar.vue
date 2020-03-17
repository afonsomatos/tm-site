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
            global.model.tapes = Number(tapes)
            global.model.normalize()
            this.$store.state.diagram.graph.update()
        },
        renameBlank(value: string) {
            global.model.blank = value || global.model.blank
        },
        renameWildcard(value: string) {
            global.model.wildcard = value || undefined
        }
    },
    computed: {
        model() {
            return global.model
        },
        tapes() {
            return global.model.tapes
        },
        isGridView() {
            return global.view === View.Grid
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
