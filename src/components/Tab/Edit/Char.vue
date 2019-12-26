<template>
    <div>
        <!-- The actual character -->
        <Section>
            <Field name="Character">
                <Input
                    class="char-input"
                    maxlength="1"
                    :value="char"
                    @input="rename($event)"
                    @focus.native="$event.target.select()" />
            </Field>
        </Section>
        <!-- Delete all transitions that come from this character -->
        <Section>
            <Field name="Delete">
                <icon-btn icon="delete" class="delete" @click="remove" />
            </Field>
        </Section>
    </div>
</template>

<script lang="ts">

import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Field    from "@/components/SideBar/Field.vue"
import IconBtn  from "@/components/IconBtn.vue"
import Input    from "@/components/Input.vue"

import { Action } from "@/store/modules/table"
import { mapActions } from 'vuex'

export default Vue.extend({
    computed: {
        char() {
            return this.$store.state.table.char
        }
    },
    methods: {
        ...mapActions("table", {
            rename: Action.RENAME_CHARACTER,
            remove: Action.DELETE_CHARACTER
        }),
    },
    components: { Section, Input, Field, IconBtn }
})

</script>

<style lang="scss" scoped>

.icon {
    font-size: 23px;
}

.char-input {
    box-sizing: content-box;
    text-align: center;
    width: 1em;
}

</style>