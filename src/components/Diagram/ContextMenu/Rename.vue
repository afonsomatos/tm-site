<template>
    <div class="rename">
        <icon class="icon" name="arrow_back" @click="setMenu('state')" />
        <input class="input" value="State" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from "./Icon.vue"
import { mapMutations } from 'vuex'
import Mutation from "@/store/modules/diagram/mutation"

export default Vue.extend({
    components: { Icon },
    methods: {
        ...mapMutations("diagram", {
            setMenu: Mutation.SET_MENU
        })
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