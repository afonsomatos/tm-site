<template>
    <Section title="Edit Transition">
        <div class="form">
            <div>Next State</div>
            <select @change="setState">
                <option v-for="(state, i) in $store.state.model.states" :key="i" :selected="hasNextState(i)">{{ state }}</option> 
            </select>
            <div>Direction</div>
            <div class="direction">
                <div class="box" @click="setDirection(0)" :class="{ selected: hasDirection(0) }">
                    <Icon class="small" icon="arrow_back"/>
                </div>
                <div class="box" @click="setDirection(1)" :class="{ selected: hasDirection(1) }">
                    <Icon class="small" icon="arrow_forward" />
                </div>
            </div>
            <div>Write</div>
            <Input class="small" :value="char" @input.native="setWriteChar" maxlength="1" @focus.native="$event.target.select()"/>
        </div>
    </Section>
</template>

<script lang="ts">
import _        from "lodash"
import Mutation from "@/store/mutation"
import Action   from "@/store/action"

import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Icon     from "@/components/Icon.vue"
import Input    from "@/components/Input.vue"

export default Vue.extend({
    
    computed: {
        
        char() {
            return this.$store.state.edit.transition[1]
        }

    },

    methods: {

        setState(e) {
            let x = e.target.selectedIndex
            Vue.set(this.$store.state.edit.transition, 0, x)
        },

        setWriteChar(e) {
            Vue.set(this.$store.state.edit.transition, 1, e.target.value)
        },
        
        setDirection(x) {
            Vue.set(this.$store.state.edit.transition, 2, x)
        },

        hasNextState(x) {
            return this.$store.state.edit.transition[0] == x
        },

        hasDirection(x) {
            return this.$store.state.edit.transition[2] === x
        },

    },
    components: { Section, Icon, Input }
})
</script>


<style lang="scss" scoped>

select {
    padding: 3px 20px;
}

.direction {
    display: grid;
    grid-auto-flow: column;
}

$size: 32px;

.box {
    display: grid;
    place-content: center;
    place-items: center;
    width: $size;
    height: $size;
    cursor: pointer;
    background: #CECECE;
    
    &.selected {
        border: 2px solid #7D7D7D;
    }
}

.form {
    display: grid;
    grid-template-columns: max-content min-content;
    grid-gap: 20px;
    align-items: center;
}

</style>