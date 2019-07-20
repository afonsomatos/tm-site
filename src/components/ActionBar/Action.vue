<template>
    <div class="action">
        <Icon class="icon" :class="{ selected }" :icon="icon" />
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Icon from '../Icon.vue'

export default Vue.extend({
    props: ["icon", "selected"],
    components: { Icon }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib.scss";

$side: 73px;

.action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $side;
    height: $side;

    .icon {
        transition: color 0.2s;
        &.selected { color: $color-active; }
    }

    &:hover { cursor: pointer; }
}

</style>