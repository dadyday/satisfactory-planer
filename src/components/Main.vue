<template>
	<div id="main">
		<div id="diagram">
			<Palette />
			<World :scheme="oScheme" />
		</div>
		<div>
			<button @click="run">Run!</button>
			<table style="margin-left:1em;">
				<tr v-for="oQuant, item in oScheme.aQuantity" :key="item">
					<td><Item :item="item"/></td>
					<td>&nbsp;&nbsp;&nbsp;</td>
					<td><Item :item="item" :count="oQuant.need" label="Benötigt" /></td>
					<td><Item :item="item" :count="oQuant.in" label="Verarbeitet" /></td>
					<td><Item :item="item" :count="oQuant.out" label="Produziert" /></td>
				</tr>
			</table>
			<ul>
				<template v-for="aProd, item in oScheme.aProduction">
					<li v-for="oProd, i in aProd" :key="item+i">
						<Building :obj="oProd.oBuilding" /> - 
						{{ oProd.name }}: 
						{{ (oProd.productivity*100.0).toFixed(1) }}%
						(
						<template v-for="count, item, i in oProd.oReceipe.aInput">
							{{ i ? ', ' : '' }}
							<Item :item="item" :count="oProd.productivity*count" short :key="'in'+i"/>
						</template>
						&gt;
						<template v-for="count, item, i in oProd.oReceipe.aOutput">
							{{ i ? ', ' : '' }}
							<Item :item="item" :count="oProd.productivity*count" :key="'out'+i"/>
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
			const oItem = Item.get(item);
			return oItem.name;
		},
		itemUrl(item) {
			const oItem = Item.get(item);
			return oItem.imageUrl();
		},
		run() {
			this.oScheme = Scheme.create({
				//wire: 10,
				//cable: 10,
				ironPlate: 10,
				ironRod: 10,
				screw: 10,
				reinforced: 3,
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
