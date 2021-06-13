<template>
	<div id="building">
		<img class="icon" :src="src" :alt="alt" width="24"/>
		<span class="name" v-if="!short">{{ name }}</span>
	</div>
</template>

<script>
import Building from '../lib/Building';

export default {
	props: {
		short: Boolean,
		type: String,
		obj: Object,
		label: String,
	},
	data() {
		return {
			oBuilding: this.obj ?? Building.get(this.type),
		};
	},
	computed: {
		name() {
			return this.label ?? this.oBuilding.name;
		},
		alt() {
			return this.oBuilding.type;
		},
		src() {
			return this.oBuilding.imageUrl();
		},
	},
}
</script>

<style lang="scss">
#building {
	display: inline;
	border: solid 0.5px #ccc;
	border-radius: 0.2em;
	box-shadow: 0.1em 0.1em 0.2em 0px #0008;
	padding: 0 0.2em;
	* {
		position: relative;
		top: -0.2em;
		vertical-align: middle;
	}
	.times {
		font-weight: bold;
		font-size: 0.8em;
	}
	.icon {
		top: -0.1em;
		width: 1.4em;
		height: 1.4em;
	};
	.name {
		margin-left: 0.2em;
	}
}
</style>
