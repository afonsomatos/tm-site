<template>
    <div class="category">
        {{ name }}
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

.category {
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 10px;
    text-transform: uppercase;
    background: #dcdcdc;
    letter-spacing: 1px;
    color: #444;
}

</style>