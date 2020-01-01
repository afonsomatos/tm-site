<template>
    <div class="v-menu">
        <div class="icons">
            <icon-btn icon="left-arrow" class="icon" @click="goBack" :clickable="true" />
            <div><!-- --></div>
            <icon-btn icon="delete" class="icon red" @click="remove" :clickable="true" />
        </div>
        <div class="read-write">
            <input v-model="transition.read" @input="update" maxlength="1" @focus="$event.target.select()"/>
            <div>→</div>
            <input v-model="transition.write" @input="update" maxlength="1" @focus="$event.target.select()"/>
        </div>
        <div class="direction">
            <div @click="setLeft" :class="{ active: left }">L</div>
            <div @click="setRight" :class="{ active: right }">R</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import IconBtn from "@/components/IconBtn.vue"

import { Transition, Direction } from "@/shared/types"

import Action from "@/store/modules/diagram/action"
import Mutation from "@/store/modules/diagram/mutation"
import Getter from "@/store/modules/diagram/getter"

export default Vue.extend({
    components: { IconBtn },
    computed: {

        transition() {
            return this.$store.state.diagram.transition
        },

        left() {
            return this.transition.direction === Direction.Left
        },

        right() {
            return this.transition.direction === Direction.Right
        }

    },
    destroyed() {
        this.normalize()

    },
    methods: {

        ...mapActions("diagram", {
            deleteTransition: Action.DELETE_TRANSITION,
            update: Action.UPDATE,
            normalize: Action.NORMALIZE
        }),

        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU,
        }),

        goBack() {
            this.setMenu("link")
        },

        remove() {
            this.deleteTransition()
            this.goBack()
        },

        setLeft() {
            this.transition.direction = Direction.Left
            this.update()
        },

        setRight() {
            this.transition.direction = Direction.Right
            this.update()
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

input {
    text-align: center;
    font: inherit;
    display: block;
    width: 100%;
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    &:focus {
        outline: 0;
    }
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
    &.red { color: #D94444; }
}

</style>