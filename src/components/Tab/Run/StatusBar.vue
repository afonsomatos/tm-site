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
import { Status } from "@/store/modules/run"

export default Vue.extend({
    computed: {
        status() {
            let { status, info } = this.$store.state.run
            let statusLabel;

            switch (status) {
                case Status.Accepted:
                    statusLabel = "Accepted"
                    break
                case Status.Rejected:
                    statusLabel = "Rejected"
                    break
                case Status.Undefined:
                    statusLabel = "Undefined"
                    break
                case Status.Normal:
                    statusLabel = this.$store.state.playing ? "Running" : "Waiting"
                    break
            }

            return [
                ["Time", info.time],
                ["Space", info.space],
                ["State", info.state],
                ["Status", statusLabel]
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