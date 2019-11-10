<template>
    <div>
        <Section>
            <!-- Renaming -->
            <Field name="Name">
                <Input v-model="state.label" class="nameInput" />
            </Field>
        </Section>
        <Section>
            <!-- Type setting -->
            <Field name="Type">
                <div class="types">
                    <icon-btn icon="right-arrow-alt" class="start" />
                    <icon-btn icon="done" class="accept" />
                    <icon-btn icon="clear" class="reject" />
                </div>
            </Field>
        </Section>
        <Section>
            <!-- Delete -->
            <Field name="delete">
                <icon-btn icon="delete" class="delete" @click="handleDelete" />
            </Field>
        </Section>
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import { mapActions, mapMutations } from "vuex"

import Section from "@/components/SideBar/Section.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import IconBtn from "@/components/IconBtn.vue"
import Field from "@/components/SideBar/Field.vue"

import { Action, Mutation } from "@/store/modules/table"

export default Vue.extend({
    computed: {
        state() {
            return this.$store.state.table.state
        }
    },
    methods: {

        ...mapMutations("table", {
            setMode: Mutation.SET_MODE
        }),

        ...mapActions("table", {
            delete: Action.DELETE_STATE
        }),
        
        handleDelete() {
            this.delete()
            this.setMode(null)
        }
    },
    components: { Section, Input, Button, Field, IconBtn }
})

</script>


<style lang="scss" scoped>

$colors: ("start": #5471E6, "accept": #54E671, "reject": #E65454);

.nameInput {
    width: 120px;
}

.types {
    display: grid;
    grid-gap: 20px;
    grid-auto-flow: column;
}

.icon {
    font-size: 23px;
}

@each $type, $color in $colors {
	.#{$type} {
		color: $color;
	}	
}

</style>