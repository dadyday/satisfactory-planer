<template>
	<div id="main">
		<World :scheme="oScheme" v-model="model" />
		<div>
			<ul>
				<li v-for="need, item in aNeed" :key="item+rdm">
					<Item 
						:item="item" 
						:count="need" 
						@update:count="setNeed(item, $event)" 
						@delete="delNeed(item)" 
						editable
						deletable
					/>
					<!--input type="number" :value="need" style="width:4em; text-align:right;" />
					<button @click="del">&times;</button-->
				</li>
				<hr/>
				<li>
					<Item item="" :count="0" 
						editable
						selectable
						addable 
						@add="addNeed(...$event)"
					/></li>
			</ul>
			<button @click="run">Run!</button>
			<table style="margin-left:1em;">
				<tr v-for="oQuant, item, i in oScheme.aQuantity" :key="i+rdm">
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
			aNeed: {
				ironPlate: 15,
				ironRod: 5,
				screw: 0,
				reinforced: 0,
			},
			oScheme: new Scheme,
			rdm: 0,
			model: '',
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
		setNeed(item, need) {
			this.aNeed[item] = need;
			this.run();
		},
		addNeed(item, count) {
			if (this.aNeed[item]) {
				count += this.aNeed[item];
			}
			this.setNeed(item, count);
		},
		delNeed(item) {
			delete this.aNeed[item];
			this.run();
		},
		run() {
			this.oScheme = Scheme.create(this.aNeed);
			console.log(this.oScheme);
			this.rdm = Math.random() * 10000;
		},
	},
}
</script>

<style>
</style>
