<template>
    <div>
        <StatusBar />
        <TapeViewer />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TapeViewer from "./TapeViewer.vue"
import StatusBar from "./StatusBar.vue"

export default Vue.extend({
    components: { TapeViewer, StatusBar }          
})
</script>

<style lang="scss" scoped>

@import "src/style/Lib";

</style>