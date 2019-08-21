<template>
    <i @click="$emit('click')" class="icon material-icons">{{ name }}</i>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        name: {
            type: String,
            default: "create"
        }
    }
})
</script>

<style lang="scss" scoped>
.icon {
    font-size: 28px;
    color: #2f2f2f;
    cursor: pointer;
}
</style>