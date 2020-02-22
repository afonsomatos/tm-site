<template>
    <div class="field">
        <span class="name">{{ name }}</span>
        <slot/>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Input from "../Input.vue"

export default Vue.extend({
    props: ["name"],
    components: { Input }
})

</script>

<style lang="scss" scoped>

.name {
    font-size: 13px;
    line-height: 200%;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #707070;
}

.field {
    align-items: center;
    display: grid;
    grid-template-columns: auto min-content;
    padding-top: 10px;
    padding-bottom: 10px;
    
    &:first-child {
        padding-top: 20px !important;
    }
    
    &:last-child {
        padding-bottom: 20px !important;
    }
}

</style>