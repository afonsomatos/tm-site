<template>
    <div>
        <Section title="Run Input">
            <Input value="hello" class="tape-input" />
            <div class="button-holder">
                <Button class="run" value="Run"/>
            </div>
        </Section>
    </div>
</template>

<script lang="ts">
import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Input    from "@/components/Input.vue"
import Button   from "@/components/Button.vue"

export default Vue.extend({
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