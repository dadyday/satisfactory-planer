<template>
	<div id="main">
		<Split horizontal class="default-theme">
			<Pane>
				<World :palette="modeNodes" :scheme="oScheme" v-model="model" />
			</Pane>
			<Pane>
				<div>
					<div class="indent">
						<b style="display:inline-block; width:6em">Verfügbar:</b>
						<Item v-for="count, item in oSupply" :key="'spl'+item+rdm"
							:item="item" :count="count"
							editable @update:count="setSupply(item, $event)"
							deletable @delete="delSupply(item)"
						/>
						<Item item="" :count="0" editable selectable addable @add="addSupply(...$event)"/>
					</div>

					<hr/>

					<div class="indent">
						<b style="display:inline-block; width:6em">Benötigt:</b>
						<Item v-for="count, item in oDemand" :key="'dmn'+item+rdm"
							:item="item" :count="count"
							editable @update:count="setDemand(item, $event)"
							deletable @delete="delDemand(item)"
						/>
						<Item item="" :count="0" editable selectable addable @add="addDemand(...$event)"/>
					</div>

					<hr/>

					<button @click="run">Run!</button>
					<Checkbox v-model="createProd" label="fehlende Produktion erzeugen" />
					<table v-if="oScheme" class="indent">
						<tr v-for="[item, oQuant], i in oScheme.mQuantity" :key="i+rdm">
							<td><Item :item="item"/></td>
							<td class="spacer"></td>
							<td><Item :item="item" :count="oQuant.demand" label="Benötigt" /></td>
							<td><Item :item="item" :count="oQuant.rest" label="Überschuss" /></td>
							<td><Item :item="item" :count="oQuant.in" label="Verarbeitet" /></td>
							<td><Item :item="item" :count="oQuant.out" label="Produziert" /></td>
							<td><Item :item="item" :count="oQuant.supply" label="Verfügbar" /></td>
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
			</Pane>
		</Split>
	</div>
</template>

<script>
import { Building, Scheme } from '../entity';

export default {
	data() {
		return {
			oSupply: {
				ironPlate: 20,
				screw: 50,
			},
			oDemand: {
			//	ironPlate: 10,
			//	ironRod: 10,
			//	screw: 20,
				reinforced: 5,
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
		setDemand(item, count) {
			this.oDemand[item] = count;
			this.run();
		},
		addDemand(item, count) {
			if (this.oDemand[item]) {
				count += this.oDemand[item];
			}
			this.setDemand(item, count);
		},
		delDemand(item) {
			delete this.oDemand[item];
			this.run();
		},

		setSupply(item, count) {
			this.oSupply[item] = count;
			this.run();
		},
		addSupply(item, count) {
			if (this.oSupply[item]) {
				count += this.oSupply[item];
			}
			this.setSupply(item, count);
		},
		delSupply(item) {
			delete this.oSupply[item];
			this.run();
		},



		run() {
			this.oScheme = new Scheme(this.oDemand, this.oSupply, this.createProd);
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
#main {
	height: 100%;
}
.indent {
	margin-left:1em;
}
.inline {
	display: inline-block;
}
.spacer {
	content: "   "
}
</style>
