<template>
    <div>
        <Section title="Edit Transition" v-if="editingTransition">
            <div class="form">
                <div>Next State</div>
                <select @change="changeState">
                    <option v-for="(state, i) in $store.state.model.states" :key="i" :selected="isState(i)">{{ state }}</option> 
                </select>
                <div>Direction</div>
                <div class="direction">
                    <div class="box" @click="setDirection(0)" :class="{ selected: isDirection(0) }">
                        <Icon class="small" icon="arrow_back"/>
                    </div>
                    <div class="box" @click="setDirection(1)" :class="{ selected: isDirection(1) }">
                        <Icon class="small" icon="arrow_forward" />
                    </div>
                </div>
                <div>Write</div>
                <select @change="changeWrite">
                    <option v-for="(char, i) in $store.state.model.charset" :key="i" :selected="isWrite(i)">{{ char }}</option> 
                </select>
            </div>
        </Section>
    </div>
</template>

<script lang="ts">

import _        from "lodash"
import Mutation from "@/store/mutation"

import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Icon     from "@/components/Icon.vue"

export default Vue.extend({
    computed: {
        editingTransition() {
            return this.$store.state.editTransition !== null
        }
    },
    methods: {
        changeState(e) {
            let x = e.target.selectedIndex 
            this.$store.getters.transition[0] = x
            this.$store.commit(Mutation.SET_MODEL, _.cloneDeep(this.$store.state.model))
        },
        changeWrite(e) {
            let x = e.target.selectedIndex 
            this.$store.getters.transition[1] = x
            this.$store.commit(Mutation.SET_MODEL, _.cloneDeep(this.$store.state.model))
        },
        isState(x) {
            return this.$store.getters.transition[0] == x
        },
        isWrite(x) {
            return this.$store.getters.transition[1] == x
        },
        isDirection(x) {
            return this.$store.getters.transition[2] === x
        },
        setDirection(x) {
            this.$store.getters.transition[2] = x
            this.$store.commit(Mutation.SET_MODEL, _.cloneDeep(this.$store.state.model))
        }
    },
    components: { Section, Icon }
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