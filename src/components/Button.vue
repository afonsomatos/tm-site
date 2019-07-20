<template>
    <div class="button">
        {{ value }}
    </div>
</template>

<script lang="ts">

import Vue from "vue"

export default Vue.extend({
    props: ["value"]
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

.button {
    display: inline-block;
	font: $font-small-semibold;
	color: $color-light;
	background-color: $color-normal;
	border: none;
	padding: 6px 50px;

	&.danger { background-color: $color-negative; }
    &.run { background-color: $color-positive; }
    
    &:hover { cursor: pointer; }
}

</style>