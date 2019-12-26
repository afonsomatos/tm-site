<template>
    <div class="side-bar">
        <slot />
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Section from "./Section.vue"
import Input from "../Input.vue"
import Button from "../Button.vue"

export default Vue.extend({
    components: { Button, Section, Input }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.side-bar {
    background: $side-background;
    width: 260px;
}

</style>