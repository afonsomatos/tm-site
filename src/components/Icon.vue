<template>
    <i class="icon material-icons" :class="{ clickable }" @click="click">{{ icon }}</i>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
    props: ["icon", "clickable"],
    methods: {
        click() {
            this.$emit("click")
        }
    }
})

</script>

<style lang="scss" scoped>

.icon {
    vertical-align: middle;
    font-size: 38px;
    transition: color 0.25s, font-weight 0.25s;
    color: rgba(0, 0, 0, 0.6);

    &.small { font-size: 24px; }

    &::selection { background: transparent; }
    &.clickable {
        cursor: pointer;
        &:hover { color: rgba(0, 0, 0, 0.8); }
        &:active { font-weight: bold; }
    }
}

</style>