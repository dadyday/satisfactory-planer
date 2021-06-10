<template>
	<div id="main">
		<button @click="run">Run!</button>
		<Palette />
		<World />
		
		<!--div>
		</div>
		<ul>
			<li v-for="oQuant, item in aQuantity" v-bind:key="item">
				{{ item }}: {{ oQuant }}
			</li>
		</ul-->
	</div>
</template>

<script>
import '../lib/World';
import runner from '../lib';

export default {
	data() {
		return {
			oScheme: null,
		};
	},
	computed: {
		aQuantity() {
			return this.oScheme ? this.oScheme.aQuantity : [];
		},
	},
	methods: {
		run() {
			this.oScheme = runner({
				//wire: 10,
				//cable: 10,
				ironplate: 10,
				ironrod: 10,
				screw: 10,
				reinforcedironplate: 3,
			});
		},
	},
}
</script>

<style>
#main {
	display: flex;
	flex-direction: row;
	align-items: stretch;
}
#main > * {
	margin: 5px;
	border: solid 1px #889;
}
</style>
