<template>
    <div>
        <!-- Toggle transition undefined -->
        <Section>
            <Field name="Undefined">
                <Toggle v-model="transition.undefined" @change="setUndefined($event)" />
            </Field>
        </Section>
        <Section v-if="!transition.undefined">
            <!-- Select next state -->
            <Field name="To">
                <select @change="changeState">
                    <option
                        v-for="(state, i) in states"
                        :key="i"
                        :selected="state === transition.to">
                        {{ state.label }}
                    </option> 
                </select>
            </Field>
            <!-- What to write on the tape -->
            <Field name="Write">
                <Input
                    v-model="transition.write"
                    class="char-input"
                    maxlength="1"
                    @input="onWriteChange"
                    @focus.native="$event.target.select()" />
            </Field>
            <!-- What direction to go -->
            <Field name="Direction">
                <div class="direction">
                    <div v-for="(icon, dir) in directions"
                        :key="dir"
                        :class="{ selected: dir === transition.direction }"
                        @click="setDirection(dir)">
                        <Icon :icon="icon" />
                    </div>
                </div>
            </Field>
        </Section>
    </div>
</template>

<script lang="ts">
import Vue      from 'vue'

import Field    from "@/components/SideBar/Field.vue"
import Section  from "@/components/SideBar/Section.vue"
import Icon     from "@/components/Icon.vue"
import Toggle   from "@/components/Toggle.vue"
import Input    from "@/components/Input.vue"

import { Transition, State } from "@/shared/model"
import { Direction } from "@/shared/types"

export default Vue.extend({
    data() {
        return {
            directions: {
                [Direction.Left]: "left-arrow-alt",
                [Direction.Right]: "right-arrow-alt"
            }
        }
    },
    computed: {
        states(): State[] {
            return this.$store.state.nextModel.states
        },
        transition(): Transition {
            return this.$store.state.table.transition
        }
    },
    methods: {
        changeState(e) {
            let index = e.target.selectedIndex
            this.transition.to = this.states[index]
            this.update()
        },
        update() {
            this.$store.state.table.table.update()
        },
        onWriteChange() {
            if (this.transition.write.length === 0) {
                this.transition.write = '#'
            }
            this.update()
        },
        setDirection(dir: Direction) {
            this.transition.direction = dir
            this.update()
        },
        setUndefined(event) {
            this.update()
        }
    },
    components: { Section, Icon, Input, Toggle, Field }
})
</script>


<style lang="scss" scoped>

.char-input {
    box-sizing: content-box;
    text-align: center;
    width: 1em;
}

select {
    padding: 3px 20px;
}

.direction {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px;
    
    > div {
        display: inline-grid;
        place-content: center;
        place-items: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
        background: #CECECE;
        
        &.selected {
            border: 2px solid #7D7D7D;
        }
    }
}

</style>