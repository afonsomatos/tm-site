<template>
    <div>
        <!-- The actual character -->
        <Section>
            <Field name="Character">
                <Input
                    class="char-input"
                    :class="{ invalid }"
                    maxlength="1"
                    @input="rename($event)"
                    :value="char"
                    v-select
                    v-focus />
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

import { Action, Getter } from "@/store/modules/table"
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
    data() {
        return {
            invalid: false
        }
    },
    watch: {
        char(newChar: string) {
            this.invalid = false
        }
    },
    computed: {
        ...mapGetters("table", {
            available: Getter.AVAILABLE_CHAR
        }),
        char() {
            return this.$store.state.table.char
        }
    },
    methods: {
        ...mapActions("table", {
            renameChar: Action.RENAME_CHARACTER,
            remove: Action.DELETE_CHARACTER,
        }),
        rename(newChar: string) {
            if (this.char === newChar) {
                return
            }

            this.invalid = !this.available(newChar)
            if (!this.invalid)  {
                this.renameChar(newChar)
            }
        }
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

.invalid {
    color:#D94444;
}

</style>