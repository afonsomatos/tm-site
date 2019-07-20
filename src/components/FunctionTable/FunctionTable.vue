<template>
    <div class="wrapper">
        <div class="main">
            <div class="row-label">States</div>
            <div class="col-label">Characters</div>
            <table class="table">
                <tr>
                    <td><!----></td>
                    <!-- Column title -->
                    <td class="char" v-for="(header, index) in table.colHeaders" :key="index">
                        {{ header }}
                    </td>
                    <!-- Add column -->
                    <td class="plus"><Icon class="icon" icon="add" /></td>
                </tr>

                <tr v-for="(header, i) in table.rowHeaders" :key="i">
                    <!-- Row title -->
                    <td class="state">{{ table.rowHeaders[i] }} </td>
                    <td class="val" v-for="(val, j) in table.rows[i]" :key="j" @click="cellClick(i, j)" :class="{ selected: isSelected(i, j) }">
                        {{ val }}
                    </td>
                    <td><!----></td>
                </tr>
                
                <!-- Add row -->
                <tr>
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

import { getProgramFromModel } from "turing"

interface Table {
    rowHeaders: string[],
    colHeaders: string[],
    rows: string[][]
}

let table: Table = {
    rowHeaders: ["S1", "S2", "S3"],
    colHeaders: ["A", "B", "C"],
    rows: [
        ["(S3, B, L)", "(S3, B, L)", "(S3, B, L)"],
        ["(S3, B, L)", "(S3, B, L)", "(S3, B, L)"],
        ["(S3, B, L)", "(S3, B, L)", "(S3, B, L)"]
    ]
}

export default Vue.extend({
    methods: {
        isSelected(i, j) {
            return _.isEqual([i, j], this.$store.state.editTransition)
        },
        cellClick(i: number, j: number) {
            this.$store.commit(Mutation.SET_EDITING_TRANSITION, [i, j])
        }
    },
    computed: {
        table() {
            
            let { states, charset, transitions } = this.$store.state.model
            
            let rows = transitions.map((arr, i) => {
                return arr.map((t, j) => {
                    let nextState = states[t[0]]
                    let writeChar = charset[t[1]]
                    let direction = t[2] ? 'R' : 'L'
                    return `(${nextState}, ${writeChar}, ${direction})`
                })
            })

            return {
                rowHeaders: states,
                colHeaders: charset,
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
        
        &.val, &.state, &.char, &.plus {
            cursor: pointer;
            &:hover, &.selected { background-color: rgba(0, 0, 0, 0.05);}    
        }
    }

    tr:first-child td { border-top: 0; }
    tr td:first-child { border-left: none; }
    
    tr:last-child td { border-bottom: none; }
    tr td:last-child { border-right: none; }

}

</style>