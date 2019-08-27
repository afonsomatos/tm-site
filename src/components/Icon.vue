<template>
    <i class="icon" :class="`icon-${this.icon}`" />
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
    props: ["icon"],
})

</script>

<style lang="scss" scoped>

 @import "@/style/Icomoon.scss";

.icon {
    vertical-align: middle;
    color: #444;
    &::selection { background: transparent; }
}

</style>