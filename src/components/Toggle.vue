<template>
	<label class="switch">
		<input class="check" type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)">
		<span class="slider round"></span>
	</label>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
	model: {
    	prop: 'checked',
    	event: 'change'
  	},
	props: ["checked"],
})

</script>

<style lang="scss" scoped>

@import "src/style/Lib";

$height: 20px;
$width: 40px;
$padding: 6px;
$diameter: $height - $padding * 2;

.switch {
  position: relative;
  display: inline-block;
  width: $width;
  height: $height
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  border-radius: $height;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: $diameter;
  width: $diameter;
  border-radius: 50%;
  left: $padding;
  bottom: $padding;
  background-color: white;
  transition: .4s;
}

.check:checked + .slider {
  background-color: $color-active;
}

.check:focus + .slider {
  box-shadow: 0 0 1px $color-active;
}

.check:checked + .slider:before {
  transform: translateX($width - $diameter - $padding * 2);
}

</style>