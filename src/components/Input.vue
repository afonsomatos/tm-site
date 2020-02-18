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
	background: #FAFAFA;
	padding: 5px 10px;
	font-size: 15px;
	border: none;
	width: 120px;
}

</style>