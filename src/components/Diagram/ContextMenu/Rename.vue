<template>
    <div class="rename">
        <icon-btn class="icon" icon="left-arrow-alt" @click="goBack" :clickable="true" />
        <input class="input" v-model="state.label" @input="onRename" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { mapMutations, mapGetters } from 'vuex'
import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"

import IconBtn from "@/components/IconBtn.vue"

export default Vue.extend({
    components: { IconBtn },
    computed: {
        state() {
            return this.$store.state.diagram.state
        }
    },
    methods: {
        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        }),
        goBack() {
            this.setMenu("state")
        },
        onRename(e) {
            this.$store.state.diagram.graph.update()
        }
    }
})
</script>

<style lang="scss" scoped>

.icon {
    padding: 10px 15px;
}

.input {
    font-family: 'Segoe UI';
    font-size: 20px;
    display: inline-block;
    padding: 5px;
    width: 100px;
    text-align: center;
    background: #eee;
    color: #444;
    border: none;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}

.rename {
    border-radius: 6px;
    background: white;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.3);
    display: grid;
    grid-template-columns: min-content min-content;
}

</style>