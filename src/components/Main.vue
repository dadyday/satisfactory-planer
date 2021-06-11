<template>
	<div id="main">
		<div id="diagram">
			<Palette />
			<World :scheme="oScheme" />
		</div>
		
		<div>
			<button @click="run">Run!</button>
			<ul>
				<li v-for="oQuant, item in aQuantity" v-bind:key="item">
					{{ item }}: {{ oQuant }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import Scheme from '../lib/Scheme';

import BuildingType from '../lib/BuildingType';
import aBuildingData from '../data/building';
BuildingType.registerAll(aBuildingData);

import Receipe from '../lib/Receipe';
import aReceipeData from '../data/receipe';
Receipe.registerAll(aReceipeData);


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
			this.oScheme = Scheme.create({
				//wire: 10,
				//cable: 10,
				ironplate: 10,
				ironrod: 10,
				screw: 10,
				reinforcedironplate: 3,
			});
			console.log(this.oScheme);
		},
	},
}
</script>

<style>
#diagram {
	display: flex;
	flex-direction: row;
	align-items: stretch;
}
#diagram > * {
	margin: 5px;
	border: solid 1px #889;
}
</style>
