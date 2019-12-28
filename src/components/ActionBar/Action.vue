<template>
    <div class="action">
        <IconBtn class="icon" :class="{ selected }" :icon="icon" />
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import IconBtn from '@/components/IconBtn.vue'

export default Vue.extend({
    props: ["icon", "selected"],
    components: { IconBtn }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib.scss";

$side: 60px;

.action {
    font-size: 32px;
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