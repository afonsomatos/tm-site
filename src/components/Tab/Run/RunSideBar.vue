<template>
    <Section title="Load">
        <Input v-model="input" class="tape-input" />
        <div class="button-holder">
            <Button class="green" value="Load" @click="load"/>
        </div>
    </Section>
</template>

<script lang="ts">
import Vue      from 'vue'
import { mapActions } from 'vuex'

import Section from "@/components/SideBar/Section.vue"
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import { Action } from "@/store/modules/run"

export default Vue.extend({
    data() {
        return {
            input: "example"
        }
    },
    methods: {
        ...mapActions("run", {
            loadTape: Action.LOAD
        }),
        load() {
            this.loadTape(this.input)
        }
    },
    components: { Section, Input, Button }
})
</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.button-holder {
    text-align: right;
    margin-top: 15px;
}

.tape-input {
    letter-spacing: 15px;
    font: $tape-font-small;
}

</style>