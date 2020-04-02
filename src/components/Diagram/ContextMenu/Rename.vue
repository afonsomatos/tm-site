<template>
    <div class="rename">
        <!-- <icon-btn class="icon" icon="left-arrow-alt" @click="goBack" :clickable="true" /> -->
        <input ref="input" class="input" :value="state.label" @input="onRename" @change="goBack" v-focus />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'


import IconBtn from "@/components/IconBtn.vue"
import { app } from '../../../shared/app'
import { store } from '../../../shared/app/store'
import { Command } from '@/shared/app/modelService'

export default Vue.extend({
    components: { IconBtn },
    computed: {
        state() {
            return store.diagram.state
        }
    },
    methods: {
        goBack() {
            app.diagramService.setContextMenu("state")
        },
        onRename(e) {
            app.modelService.execute(
                Command.changeState(this.state, { label: e.target.value })
            )
        }
    }
})
</script>

<style lang="scss" scoped>

.icon {
    padding: 10px 15px;
}

.input {
    font-family: inherit;
    font-size: 20px;
    display: inline-block;
    padding: 5px;
    width: 100px;
    text-align: center;
    border-radius: 6px;
    background: #F9F9F9;
    color: #444;
    border: none;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;

    &:focus {
        outline: 0;
    }
}

</style>