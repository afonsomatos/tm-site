<template>
    <div class="v-menu">
        <icon name="add" class="add" @click="add" />
        <div class="group">
            <div v-for="(t, i) in transitions" :key="i">
                {{ text(t) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from "./Icon.vue"
import Mutation from "@/store/mutation"
import Getter from "@/store/getter"
import { Transition, Direction } from "@/shared/types"

import { mapGetters } from 'vuex'

export default Vue.extend({
    components: { Icon },
    methods: {
        text(transition: Transition): string {
            return `${transition.read} → ${transition.write}, ` +
                (transition.direction === Direction.Right ? 'R' : 'L') 
        },
        add() {
            // continue here
        }
    },
    computed: {
        ...mapGetters({
            getTransition: Getter.TRANSITION
        }),
        transitions() {
            return this.$store.state.diagram.transitionGroup.map(this.getTransition)
        }
    },
})
</script>

<style lang="scss" scoped>
.v-menu {
    text-align: center;
    overflow: hidden;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 0px 40px 6px rgba(0, 0, 0, 0.3);
}

.add {
    padding: 12px 0px;
}

.group {
    > div {
        font-family: "Segoe UI semibold";
        letter-spacing: 5px;
        cursor: pointer;
        padding: 15px 20px;
        background: #eee;
    }

    > div:nth-child(2n) {
        background: #e0e0e0;
    }
}
</style>