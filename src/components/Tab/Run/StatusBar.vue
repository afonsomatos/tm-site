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
import { Status } from "@/shared/app/types"
import { store } from '@/shared/app/store'

export default Vue.extend({
    data() {
        return {
        }
    },
    computed: {
        status() {
            let status = store.run.status
            let info = store.run.info
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
                    statusLabel = store.run.playing ? "Running" : "Waiting"
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
    padding: 10px 20px;
    background: $color-gray-3;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    grid-gap: 30px;
}

span {
    font-weight: 300;
    font-size: 16px;
}

span + span {
    font-weight: normal;
    margin-left: 10px;
}

</style>