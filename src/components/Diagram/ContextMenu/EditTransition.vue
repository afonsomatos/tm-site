<template>
    <div class="v-menu">
        <div class="icons">
            <icon name="arrow_back" class="icon" />
            <div><!-- --></div>
            <icon name="delete" class="icon" />
        </div>
        <div class="read-write">
            <div>A</div>
            <div>→</div>
            <div>B</div>
        </div>
        <div class="direction">
            <div @click="$emit('direction', 0)">L</div>
            <div @click="$emit('direction', 1)">R</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from "./Icon.vue"

export default Vue.extend({
    components: { Icon }
})
</script>

<style lang="scss" scoped>
.v-menu {
    font-size: 24px;
    text-align: center;
    overflow: hidden;
    width: 160px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 0px 40px 6px rgba(0, 0, 0, 0.3);
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
    padding: 15px;
}

.direction {
    padding: 15px;
    display: grid;
    grid-gap: 30px;
    grid-auto-flow: column;
    justify-content: center;
}

.icon {
    padding: 15px;
}

</style>