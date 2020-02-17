<template>
    <Section title="Load" class="load-section">
        <div class="name">Load input</div>
        <Input v-model="input" class="tape-input" />
        <div class="button-holder">
            <Button class="blue" value="Load" @click="load"/>
        </div>
    </Section>
</template>

<script lang="ts">
import Vue      from 'vue'
import { mapActions } from 'vuex'

import Section from "@/components/SideBar/Section.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"

import run from "@/store/run"

export default Vue.extend({
    data() {
        return {
            input: "11111",
            run,
        }
    },
    methods: {
        load() {
            run.load(this.input)
        }
    },
    components: { Section, Input, Button }
})
</script>

<style lang="scss" scoped>

@import "src/style/Lib";

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
    letter-spacing: 15px;
    width: 100%;
    font: bold 16px "Roboto Mono", monospace;
}

</style>