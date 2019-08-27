<template>
    <div class="v-menu">
        <div class="icons">
            <icon name="arrow_back" class="icon" @click="goBack" />
            <div><!-- --></div>
            <icon name="delete" class="icon red" @click="remove" />
        </div>
        <div class="read-write">
            <div>{{ transition.read }}</div>
            <div>→</div>
            <div>{{ transition.write }}</div>
        </div>
        <div class="direction">
            <div @click="setLeft" :class="{ active: left }">L</div>
            <div @click="setRight" :class="{ active: right }">R</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from "./Icon.vue"

import { Transition, Direction } from "@/shared/types"

import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"
import { mapMutations, mapGetters } from 'vuex'

export default Vue.extend({
    components: { Icon },
    computed: {
        ...mapGetters("diagram", {
            transition: Getter.CURRENT_TRANSITION,
        }),
        left() {
            return this.transition.direction === Direction.Left
        },
        right() {
            return this.transition.direction === Direction.Right
        }
    },
    methods: {
        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU,
            editTransition: Mutation.EDIT_TRANSITION,
            deleteTransition: Mutation.DELETE_TRANSITION,
        }),
        goBack() {
            this.setMenu("transition")
        },
        remove() {
            this.deleteTransition()
            this.goBack()
        },
        setDirection(direction: Direction) {
            this.editTransition({ ...this.transition, direction })
        },
        setLeft() {
            this.setDirection(Direction.Left)
        },
        setRight() {
            this.setDirection(Direction.Right)
        }
    }
})
</script>

<style lang="scss" scoped>

@import "@/style/Lib.scss";

.v-menu {
    text-align: center;
    overflow: hidden;

    width: 120px;
}

.icons {
    width: 100%;
    display: grid;
    grid-template-columns: min-content auto min-content;
}

.read-write {
    display: grid;
    grid-auto-flow: column;
    background: #eee;
    padding: 5px;
}

.direction {
    padding: 10px;
    display: grid;
    grid-gap: 30px;
    grid-auto-flow: column;
    justify-content: center;

    > div {
        cursor: pointer;
        &.active { color: $color-active; }
    }
}

.icon {
    padding: 10px;
    &.red { color: red }
}

</style>