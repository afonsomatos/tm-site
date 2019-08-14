<template>
    <Section title="Run Input">
        <Input v-model="input" class="tape-input" />
        <div class="button-holder">
            <Button class="run" value="Run" @click="run"/>
        </div>
    </Section>
</template>

<script lang="ts">
import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Input    from "@/components/Input.vue"
import Button   from "@/components/Button.vue"
import Action   from "@/store/action"

export default Vue.extend({
    data() {
        return {
            input: "turing"
        }
    },
    methods: {
        run() {
            this.$store.dispatch(Action.RUN, this.input)
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
    text-align: center;
    font: $tape-font-normal;
    width: 100%;
    vertical-align: center;
}

</style>