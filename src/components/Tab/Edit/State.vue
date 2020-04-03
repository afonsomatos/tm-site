<template>
    <div>
        <Section>
            <!-- Renaming -->
            <Field name="Name">
                <Input :value="state.label" class="nameInput" @input="onRename($event)" />
            </Field>
        </Section>
        <Section>
            <!-- Type setting -->
            <Field name="Type">
                <div class="types">
                    <icon-btn
                        v-for="(icon, type) in icons"
                        :key="type"
                        :title="tooltip[type]"
                        :icon="icon"
                        :class="{[type]: true, selected: stateType === type}"
                        @click="setType(type)"
                        />
                </div>
            </Field>
        </Section>
        <Section>
            <!-- Delete -->
            <Field name="delete">
                <icon-btn title="Delete this state" icon="delete" class="delete" @click="handleDelete" />
            </Field>
        </Section>
    </div>
</template>

<script lang="ts">

import Vue from "vue"
import { mapActions, mapMutations, mapGetters } from "vuex"

import Section from "@/components/SideBar/Section.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import IconBtn from "@/components/IconBtn.vue"
import Field from "@/components/SideBar/Field.vue"

import { Action, Mutation, Getter } from "@/store/modules/table"
import { Type } from "@/shared/model"
import { store } from "../../../shared/app/store"
import { app } from "../../../shared/app"
import { Command } from "../../../shared/app/modelService"

export default Vue.extend({
    data() {
        return {
            icons: {
                [Type.Start]: "right-arrow-alt",
                [Type.Accept]: "done",
                [Type.Reject]: "clear"
            },
            tooltip: {
                [Type.Start]: "Start state",
                [Type.Accept]: "Accept state",
                [Type.Reject]: "Reject state"
            },
            label: null
        }
    },
    created() {
        this.label = this.state.label
    },
    computed: {
        stateType() {
            return store.table.type
        },
        // ...mapGetters("table", {
        //     stateType: Getter.STATE_TYPE
        // }),

        state() {
            return store.table.state
        }
    },
    methods: {

        setStateType(type: Type) {
            app.tableService.setStateType(type)
        },

        setType(type: Type) {
            if (this.stateType === type) {
                this.setStateType(Type.Normal)
            } else {
                this.setStateType(type)
            }
        },
        
        handleDelete() {
            app.tableService.deleteState()
            // this.setMode(null)
        },

        onRename(name) {
            if (name)
                app.tableService.renameState(name)
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
        opacity: 0.4;

        &.selected { opacity: 1; }
	}	
}

</style>