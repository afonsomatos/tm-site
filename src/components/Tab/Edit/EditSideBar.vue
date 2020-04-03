<template>
    <div>
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

import Section from "@/components/SideBar/Section.vue"
import Category from "@/components/SideBar/Category.vue"
import Field from "@/components/SideBar/Field.vue"
import Input from "@/components/Input.vue"

import { Mode } from "@/store/modules/table"
import global, { View } from "@/store/global"
import { store } from "@/shared/app/store"
import { app } from "../../../shared/app"
import { Command } from "@/shared/app/modelService"

export default Vue.extend({
    components: { Section, Field, Input, Category },
    methods: {
        changeTapes(e) {
            let tapes = Number(e.target.value)
            app.modelService.execute(Command.changeTapes(tapes))
        },
        renameBlank(value: string) {
            app.modelService.execute(
                Command.changeModel({ blank: value })
            )
        },
        renameWildcard(value: string) {
            app.modelService.execute(
                Command.changeModel({ wildcard: value || undefined })
            )
        }
    },
    computed: {
        model() {
            return store.model.model
        },
        tapes() {
            return store.model.model.tapes
        },
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
