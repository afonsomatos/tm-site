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
import Section  from "@/components/SideBar/Section.vue"
import Input    from "@/components/Input.vue"
import Button   from "@/components/Button.vue"
import Action   from "@/store/action"

export default Vue.extend({
    data() {
        return {
            input: "11101"
        }
    },
    methods: {
        load() {
            this.$store.dispatch(Action.LOAD, this.input)
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