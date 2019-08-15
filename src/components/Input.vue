<template>
    <input @input="changeValue" :value="value" type="text">
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
	props: ["value"],
  	methods: {
    	changeValue(e) {
      		this.$emit("input", e.target.value);
    	}
  	}
})

</script>


<style lang="scss" scoped>

@import "src/style/Lib";

input {
	font: $font-normal;
	display: inline-block;
	padding: 10px 20px;
	border: 1px solid #D2D2D2;
	
	&.small {
		padding: 5px 10px;
		font: $font-small;
	}
}

</style>