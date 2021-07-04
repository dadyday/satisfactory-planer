<template>
	<div id="main">
		<World :palette="modeNodes" :scheme="oScheme" v-model="model" />
		<div>
			<ul>
				<li v-for="need, item in oNeed" :key="item+rdm">
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
			<Checkbox v-model="createProd" label="fehlende Produktion erzeugen" />
			<table v-if="oScheme" class="indent">
				<tr v-for="[item, oQuant], i in oScheme.mQuantity" :key="i+rdm">
					<td><Item :item="item"/></td>
					<td class="spacer"></td>
					<td><Item :item="item" :count="oQuant.need" label="Benötigt" /></td>
					<td><Item :item="item" :count="oQuant.in" label="Verarbeitet" /></td>
					<td><Item :item="item" :count="oQuant.out" label="Produziert" /></td>
					<td><Item :item="item" :count="oQuant.rest" label="Überschuss" /></td>
				</tr>
			</table>
			<hr />
			<table v-if="oScheme" class="indent">
				<template v-for="[item, aProd] in oScheme.mProduction">
					<tr v-for="oProd, i in aProd" :key="item+i+rdm">
						<td>
							<Production
								:obj="oProd"
								editable
								@update:productivity="updateProd(oProd, $event)"
							/>
						</td>
						<td class="spacer"></td>
					</tr>
				</template>
			</table>
		</div>
	</div>
</template>

<script>
import {Item, Building, Scheme} from '../entity';

export default {
	data() {
		return {
			oNeed: {
			//	ironPlate: 10,
			//	ironRod: 10,
				screw: 20,
			//	reinforced: 5,
			},
			oScheme: null,
			createProd: true,
			rdm: 0,
			model: '',
		};
	},
	computed: {
		modeNodes() {
			return Building.getAll();
		}
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
			this.oNeed[item] = need;
			this.run();
		},
		addNeed(item, count) {
			if (this.oNeed[item]) {
				count += this.oNeed[item];
			}
			this.setNeed(item, count);
		},
		delNeed(item) {
			delete this.oNeed[item];
			this.run();
		},
		run() {
			this.oScheme = new Scheme(this.oNeed, this.createProd);
			this.refresh();
		},
		updateProd(oProd, productivity) {
			oProd.changeProductivity(productivity, this.oScheme);
			this.refresh();
		},
		refresh() {
			this.rdm = Math.random() * 10000;
		}
	},
}
</script>

<style>
.indent {
	margin-left:1em;
}
.spacer {
	content: "   "
}
</style>
