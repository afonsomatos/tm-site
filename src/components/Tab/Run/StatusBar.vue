<template>
    <div class="status">
        <div v-for="([name, value], i) in status" :key="i">
            <span>{{ name }}</span>
            <span>{{ value }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    computed: {
        status() {
            let info = this.$store.state.run.info
            return [
                ["Time", info.time],
                ["Space", info.space],
                ["State", info.state]
            ]
        }
    },     
})
</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.status {
    padding: 5px 20px;
    background: $color-gray-3;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    grid-gap: 30px;
}

span {
    font: 18px "Segoe UI light";
}

span + span {
    font: 18px "Segoe UI regular";
    margin-left: 10px;
}

</style>