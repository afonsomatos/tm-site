<template>
    <div class="tape-viewer">
        <div class="tape">
            <div class="cell" v-for="n in 20" :key="n">
                {{ n % 10 }}
            </div>
            <Icon class="cursor" icon="arrow_drop_up" />
        </div>
        <div class="controllers">
            <div>
                <!---->
            </div>
            <div>
                <Icon icon="replay" :clickable="true" />
                <Icon icon="pause"  :clickable="true" />
                <Icon icon="redo"   :clickable="true" />
            </div>
            <div>
                <Icon icon="repeat" :clickable="true" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Icon from "@/components/Icon.vue"

export default Vue.extend({
    components: { Icon }
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

$cell-size: 60px;

.controllers {
    display: grid;
    grid-template-columns: min-content auto min-content;
    place-items: center;
    margin-top: 20px;

    > div {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 30px;
    }
}

.cell {
    width: $cell-size;
    height: $cell-size;
    font: $tape-font-big;
    line-height: $cell-size;
    text-align: center;
    border-right: 1px solid #D2D2D2;
}

.cursor {
    position: absolute;
    width: $cell-size;
    color: $color-active;
    font-size: 50px;
    bottom: 0;
    margin-bottom: -21px;
    vertical-align: text-bottom;
    text-align: center;
}

.tape {
    position: relative;
    border: 1px solid $color-active;
    background: #F8F8F8;
    display: flex;
    flex-direction: row;
    justify-items: center;
}

.tape-viewer {
    //border: 1px solid #C4C4C4;
    border-bottom: none;
    padding: 20px;
    background: $side-background;
}

</style>