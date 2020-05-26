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

import { text } from 'd3'

import assert from "assert"
import { Model } from '@/shared/model'
import { app } from '@/shared/app'
import { store } from '@/shared/app/store'

export default Vue.extend({
    data() {
        return {
            input: []
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
        tapes: () => store.model.model.tapes
    },
    methods: {
        load() {
            app.runService.load(_.cloneDeep(this.input))
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