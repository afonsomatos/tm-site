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
import Getter from "@/store/getter"

export default Vue.extend({
    computed: {
        status() {
            let state = this.$store.getters[Getter.STATE]
            return [
                ["Time", state.time],
                ["Space", state.space],
                ["State", state.state]
            ]
        }
    },     
})
</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.status {
    padding: 10px 20px;
    background: $color-gray-3;
    display: inline-grid;
    grid-auto-flow: column;
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