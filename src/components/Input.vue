<template>
    <input type="text">
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
    
})

</script>


<style lang="scss" scoped>

@import "src/style/Lib";

input {
	font: $font-normal;
	display: inline-block;
	padding: 10px 20px;
	border: 1px solid #D2D2D2;
	
	&.small { font: $font-small; }
}

</style>