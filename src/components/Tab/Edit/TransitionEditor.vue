<template>
    <Section title="Edit Transition">
        <div class="form">
            <div>Undefined</div> <Toggle :checked="isUndefined" @change="setUndefined($event)" />
            <template v-if="!isUndefined">
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
            </template>
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
import Toggle   from "@/components/Toggle.vue"
import Input    from "@/components/Input.vue"

export default Vue.extend({
    
    computed: {
        
        char() {
            return this.$store.state.edit.transition[1]
        },

        isUndefined() {
            return this.$store.state.edit.transition[3] == true  
        }

    },

    methods: {
        
        setUndefined(isUndefined) {
            Vue.set(this.$store.state.edit.transition, 3, isUndefined)
        },

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
    components: { Section, Icon, Input, Toggle }
})
</script>


<style lang="scss" scoped>

select {
    padding: 3px 20px;
}

$size: 32px;

.box {
    display: inline-grid;
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
    grid-template-columns: 100px min-content;
    grid-gap: 20px;
    align-items: center;
}

</style>