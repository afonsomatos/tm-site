<template>
    <div class="code">
        <Section title="Code Editor"></Section>
        <Section>
            <div class="bar">
                <div class="left">
                    <div class="label">
                        <Toggle />
                        Auto Save
                    </div>
                </div>
                <div class="right">
                    <Button value="Save"/>
                </div>
            </div>
        </Section>
        <CodeEditor />
    </div>
</template>

<script lang="ts">

import Vue      from 'vue'
import Section  from "@/components/SideBar/Section.vue"
import Button   from "@/components/Button.vue"
import Toggle   from "@/components/Toggle.vue"

import CodeEditor from "./CodeEditor.vue"

export default Vue.extend({
    components: { Toggle, Section, Button, CodeEditor }
})

</script>

<style lang="scss" scoped>

.code {
    height: 100%;
    display: grid;
    grid-template-rows: repeat(2, min-content) auto;
}

.label {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px;
    place-items: center;
}

.bar {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr;
}

.left {
    justify-self: start;
}

.right {
    justify-self: end;
}

</style>