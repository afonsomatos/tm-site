<template>
    <div class="wrapper">
        <div class="main">
            <div class="row-label">States</div>
            <div class="col-label">Characters</div>
            <table class="table">
                <tr>
                    <td><!----></td>
                    <!-- Column title -->
                    <td class="char" v-for="(header, index) in table.colHeaders" :key="index" @click="selectReadChar(index)">
                        {{ header }}
                    </td>
                    <!-- Add column -->
                    <td class="plus" @click="addReadChar()">
                        <Icon class="icon" icon="add" />
                    </td>
                </tr>

                <tr v-for="(header, i) in table.rowHeaders" :key="i">
                    <!-- Row title -->
                    <td class="state" :class="{ accept: i === $store.state.model.accept }" @click="selectState(i)">
                        {{ table.rowHeaders[i] }}
                    </td>
                    <td class="val" v-for="(val, j) in table.rows[i]" :key="j" @click="selectTransition(i, j)" :class="{ selected: isTransitionSelected(i, j) }">
                        {{ val }}
                    </td>
                    <td><!----></td>
                </tr>
                
                <!-- Add row -->
                <tr @click="addState()">
                    <td class="plus"><Icon class="icon" icon="add" /></td>
                    <td v-for="j in table.colHeaders.length + 1" :key="j"></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import _ from "lodash"
import Icon from "@/components/Icon.vue"
import Mutation from "@/store/mutation"
import Action from "@/store/action"

interface Table {
    rowHeaders: string[],
    colHeaders: string[],
    rows: string[][]
}

export default Vue.extend({
    
    methods: {

        addReadChar() {
            this.$store.commit(Mutation.ADD_READ_CHAR)
        },

        addState() {
            this.$store.commit(Mutation.ADD_STATE)
        },

        selectState(index: number) {
            let stateId = this.$store.state.model.stateList[index]
            this.$store.commit(Mutation.SET_EDITING_STATE, index)
        },

        selectReadChar(index: number) {
            let readCharId = this.$store.state.model.readCharList[index]
            this.$store.commit(Mutation.SET_EDITING_CHAR, readCharId)
        },

        isTransitionSelected(stateIndex: number, readCharIndex: number) {
            let stateId = this.$store.state.model.stateList[stateIndex]
            let readCharId = this.$store.state.model.readCharList[readCharIndex]
            return this.$store.getters.isTransitionSelected(stateId, readCharId)
        },

        selectTransition(stateIndex: number, readCharIndex: number) {
            let stateId = this.$store.state.model.stateList[stateIndex]
            let readCharId = this.$store.state.model.readCharList[readCharIndex]
            this.$store.dispatch(Action.SET_EDITING_TRANSITION, { stateId, readCharId })
        }

    },

    computed: {
        
        table() {
            
            let model = this.$store.state.model

            let rowHeaders = model.stateList.map(id => model.states[id])
            let colHeaders = model.readCharList.map(id => model.readChars[id])

            let rows = model.stateList.map(stateId => {
                return model.readCharList.map(charId => {
                    let transition = model.stateTransitions[stateId][charId]
                    if (transition === undefined)
                        return "none"

                    let nextState = model.states[ transition[0] ]
                    let writeChar = transition[1]
                    let direction = transition[2] ? 'R' : 'L'
                    return `(${nextState}, ${writeChar}, ${direction})`
                })
            })

            return {
                rowHeaders,
                colHeaders,
                rows
            }
        }
    },
    components: { Icon }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    place-items: center;
    place-content: center;
}

.main {
    display: grid;
    padding-bottom: 200px;
    grid-template-areas: "empty      col-label"
                         "row-label  table";
    grid-template-rows: min-content min-content;
    grid-template-columns: min-content auto;
    grid-column-gap: 50px;
    grid-row-gap: 40px;
}

.icon {
    font-size: 24px;
}

.row-label, .col-label {
    display: flex;
    place-items: center;
    font: $font-small-semibold;
    color: #474747;
    place-content: center;
}

.row-label { grid-area: row-label; }
.col-label { grid-area: col-label; }

.table {
    grid-area: table;
    text-align: center;
    font-size: 20px;
    
    td {
        vertical-align: middle;
        padding: 20px;
        border: 1px solid #858585;
        transition: background-color 0.5s;
        &.val { font-style: italic; }
        
        &.state, &.char, &.val, &.plus {
            cursor: pointer;
        }

        &.val {
            &:hover, &.selected { background-color: rgba(0, 0, 0, 0.05);}    
        }
    }

    tr:first-child td { border-top: 0; }
    tr td:first-child { border-left: none; }
    
    tr:last-child td { border-bottom: none; }
    tr td:last-child { border-right: none; }

}

.state {
    background-color: #f0f0d9;
    &:hover { background-color: #e8e8bc; }
    &.accept { background-color: #c4f3cc; }
}

.char {
    background-color: #d9ddf0;
    &.selected, &:hover { background-color: #c0c8ec; }
}

</style>