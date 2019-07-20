<template>
    <div class="section">
        <div v-if="title" class="title">{{ title }}</div>
        <slot/>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Input from "../Input.vue"

export default Vue.extend({
    props: ["title"],
    components: { Input }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.title {
    font: $font-big;
    margin-bottom: 24px;
	color: #474747;
}

.section {
    padding: 20px;
    border-bottom: 1px solid #CFCFCF;
}

</style>