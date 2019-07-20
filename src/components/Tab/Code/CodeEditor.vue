<template>
    <div class="editor">
        <div class="side-bar"></div>
        <div class="content"></div>
        <div class="style-bar"></div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
        
})

</script>

<style lang="scss" scoped>

.editor {
    position: relative;
    display: grid;
    width: 100%;
    background: red;
    grid-template-columns: min-content auto;
}

.side-bar {
    width: 20px;
    background-color: #6D6D6D;
}

.content {
    background-color: #848484;
}

.style-bar {
    position: absolute;
    height: 6px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.18);
}

</style>