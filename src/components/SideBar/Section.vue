<template>
    <div class="section">
        <slot/>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Input from "../Input.vue"

export default Vue.extend({
    components: { Input }
})

</script>

<style lang="scss" scoped>

.section {
    border-bottom: 1px solid #D9D9D9;

    &:nth-last-child() {
        border-bottom-width: 0px;
    }
}

</style>