<template>
    <Section title="Load" class="load-section">
        <div class="name">Load input</div>
        <div class="inputs">
            <Input v-for="(_, i) in input" :key="i"
                v-model="input[i]" class="tape-input" ref="input"
                />
        </div>
        <div class="button-holder">
            <Button class="blue" value="Load" @click="load"/>
        </div>
    </Section>
</template>

<script lang="ts">
import Vue      from 'vue'
import { mapActions } from 'vuex'
import _ from "lodash"

import Section from "@/components/SideBar/Section.vue"
import Button from "@/components/Button.vue"
import Input from "@/components/Input.vue"

import global from "@/store/global"
import run from "@/store/run"
import { text } from 'd3'

import assert from "assert"
import { Model } from '@/shared/model'

export default Vue.extend({
    data() {
        return {
            input: [],
            global,
            run,
        }
    },
    watch: {
        tapes: {
            immediate: true,
            handler(newTapes: number) {
                this.input = _.times(newTapes, i => this.input[i] || "")
            }
        }
    },
    computed: {
        tapes: () => global.model.tapes
    },
    methods: {
        load() {
            run.load(_.cloneDeep(this.input))
        }
    },
    components: { Section, Button, Input }
})
</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.inputs {
    display: grid;
    grid-auto-flow: row;
    grid-gap: 10px;
}

.name {
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #707070;
    margin-bottom: 20px;
}

.button-holder {
    text-align: right;
    margin-top: 15px;
}

.load-section {
    padding: 20px;
}

.tape-input {
    overflow: hidden;
    letter-spacing: 15px;
    resize: none;
	background: #FAFAFA;
    
	padding: 5px 10px;
    border: none;
    width: 100%;
    font: bold 16px "Roboto Mono", monospace;
    line-height: 20px;
}

</style>