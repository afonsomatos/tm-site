<template>
    <icon :icon="icon" class="icon" :class="{ clickable, disable }" @click.native="$emit('click')" />
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from "./Icon.vue"

export default Vue.extend({
    components: { Icon },
    props: {
        icon: {
            type: String,
            default: "edit"
        },
        clickable: {
            type: Boolean,
            default: true
        },
        disable: {
            type: Boolean,
            default: false
        }
    }
})
</script>

<style lang="scss" scoped>

.icon {
    &.disable {
        opacity: 0.8;
    }
    &.clickable {
        cursor: pointer;
        &.disable {
            cursor: not-allowed;
        }
    }
}

</style>