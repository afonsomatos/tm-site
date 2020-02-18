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
    padding-left: 20px;
    padding-right: 20px;
    border-bottom: 1px solid #D9D9D9;
}

</style>