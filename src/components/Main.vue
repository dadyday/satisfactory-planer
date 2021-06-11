<template>
	<div id="main">
		<div id="diagram">
			<Palette />
			<World :scheme="oScheme" />
		</div>
		
		<div>
			<button @click="run">Run!</button>
			<ul>
				<li v-for="oQuant, item in oScheme.aQuantity" :key="item">
					{{ getItem(item) }}: {{ oQuant }}
				</li>
			</ul>
			<ul>
				<template v-for="aProd, item in oScheme.aProduction">
					<li v-for="oProd, i in aProd" :key="item+i">
						{{ oProd.oBuilding.name }} - 
						{{ oProd.name }}: 
						{{ (oProd.productivity*100.0).toFixed(1) }}%
						(
						<template v-for="count, item, i in oProd.oReceipe.aInput">
							{{ i ? ', ' : '' }}
							{{ (oProd.productivity*count).toFixed(0) }} {{ getItem(item) }}
						</template>
						&gt;
						<template v-for="count, item, i in oProd.oReceipe.aOutput">
							{{ i ? ', ' : '' }}
							{{ (oProd.productivity*count).toFixed(0) }} {{ getItem(item) }}
						</template>
						)
					</li>
				</template>
			</ul>
		</div>
	</div>
</template>

<script>
import Scheme from '../lib/Scheme';

import Building from '../lib/Building';
import aBuildingData from '../data/building';
Building.registerAll(aBuildingData);

import Receipe from '../lib/Receipe';
import aReceipeData from '../data/receipe';
Receipe.registerAll(aReceipeData);

import Item from '../lib/Item';
import aItemData from '../data/item';
Item.registerAll(aItemData);


export default {
	data() {
		return {
			oScheme: new Scheme,
		};
	},
	methods: {
		getItem(item) {
			return Item.get(item).name;
		},
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
