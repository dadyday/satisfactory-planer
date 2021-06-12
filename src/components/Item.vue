<template>
	<div id="item">
		<img class="icon" :src="src" :alt="item" width="24"/>
		<span class="times" v-if="hasCount">&times;{{ fixedCount }}</span>
		<span class="name" v-if="!short">{{ name }}</span>
	</div>
</template>

<script>
import Item from '../lib/Item';

export default {
	props: {
		short: Boolean,
		item: String,
		count: Number,
		label: String,
	},
	data() {
		return {
			oItem: Item.get(this.item),
		};
	},
	computed: {
		hasCount() {
			return !isNaN(this.count);
		},
		fixedCount() {
			return Math.ceil(this.count).toFixed();
		},
		name() {
			return this.label ?? this.oItem.name;
		},
		src() {
			return this.oItem.imageUrl();
		},
	},
}
</script>

<style lang="scss">
#item {
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
