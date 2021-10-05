<template>
	<div id="main" :style="{height: bodyHeight + 'px'}">
		<Split horizontal class="default-theme" first-splitter>
			<Pane style="overflow-y: hidden">
				<World :palette="modeNodes" :scheme="oDrawedScheme" v-model="model" />
			</Pane>
			<Pane style="overflow-y: scroll">
				<Rows>
					<Cols>
						<button @click="run">Run!</button>
						<Checkbox v-model="createProd" label="fehlende Produktion erzeugen" />
						<button @click="draw">Draw!</button>
					</Cols>

					<Cols>
						<div class="indent">
							<b class="inline">Verfügbar:</b>
							<Item v-for="count, item in oSupply" :key="'spl'+item+rdm"
								:item="item" :count="count"
								editable @update:count="setSupply(item, $event)"
								deletable @delete="delSupply(item)"
							/>
							<Item item="" :filters="{'ingredient': true}" selectable addable @add="addSupply(...$event)"/>
						</div>
					</Cols>

					<Cols>
						<div class="indent">
							<b class="inline">Benötigt:</b>
							<Item v-for="count, item in oDemand" :key="'dmn'+item+rdm"
								:item="item" :count="count"
								editable @update:count="setDemand(item, $event)"
								deletable @delete="delDemand(item)"
							/>
							<Item item="" :filters="{'product': true}" selectable addable @add="addDemand(...$event)"/>
						</div>
					</Cols>

				</Rows>
				<Rows>
					<Cols>
						<div>
							<b class="inline">Gegenstände:</b>
							<table v-if="oScheme" class="indent">
								<tr v-for="[item, oQuant], i in oScheme.mQuantity" :key="i+rdm">
									<td><Item :item="item"/></td>
									<td class="spacer"></td>
									<td><Item :item="item" :count="oQuant.demand" v-if="oQuant.demand" label="Benötigt" /></td>
									<td><Item :item="item" :count="oQuant.rest" v-if="oQuant.rest" label="Überschuss" /></td>
									<td><Item :item="item" :count="oQuant.in" v-if="oQuant.in" label="Verarbeitet" /></td>
									<td><Item :item="item" :count="oQuant.out" v-if="oQuant.out" label="Produziert" /></td>
									<td><Item :item="item" :count="oQuant.supply" v-if="oQuant.supply" label="Verfügbar" /></td>
								</tr>
							</table>
						</div>

						<div>
							<b class="inline">Produktion:</b>
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
					</Cols>
				</Rows>

			</Pane>
		</Split>
	</div>
</template>

<style lang="scss">
#main {
}
.indent {
	margin-left: 0.5em;
}
.inline {
	display: inline-block;
	width: 6em;
	height: 2em;
}
.spacer {
	content: "   "
}
.frame {
	border: solid 1px;
	padding:0.5em 0;
}
.splitpanes--horizontal > .splitpanes__splitter {
	height: 10px !important;
}
.splitpanes--vertical > .splitpanes__splitter {
	width: 10px !important;
}
</style>

<script>
import { Building, Scheme } from '../entity';
import Store from 'store';

export default {
	data() {
		return {
			bodyHeight: 600,
			oSupply: {},
			oDemand: {},
			oScheme: null,
			createProd: true,
			rdm: 0,
			model: '',
			oDrawedScheme: null,
		};
	},
	computed: {
		modeNodes() {
			return Building.getAll();
		}
	},
	mounted() {
		// create an Observer instance
		const self = this;
		const resizeObserver = new ResizeObserver(entries => {
			const height = entries[0].target.clientHeight;
			self.bodyHeight = height - 20;
		});
		resizeObserver.observe(document.documentElement);
		this.load();
	},
	methods: {
		setDemand(item, count) {
			this.oDemand[item] = count;
			this.run();
		},
		addDemand(item, count) {
			count = this.oDemand[item] ?? 0;
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
			count = this.oSupply[item] ?? 0;
			this.setSupply(item, count);
		},
		delSupply(item) {
			delete this.oSupply[item];
			this.run();
		},



		run() {
			this.refresh();
		},
		draw() {
			this.oDrawedScheme = this.oScheme;
		},
		updateProd(oProd, productivity) {
			oProd.changeProductivity(productivity, this.oScheme);
			this.refresh();
		},
		refresh() {
			this.save();
			this.oScheme = new Scheme(this.oDemand, this.oSupply, this.createProd);
			this.rdm = Math.random() * 10000;
		},
		load() {
			const aSetting = Store.get('setting');
			this.oDemand = aSetting[0] ?? this.oDemand;
			this.oSupply = aSetting[1] ?? this.oSupply;
			this.createProd = aSetting[2] ?? this.createProd;
		},
		save() {
			Store.set('setting', [
				this.oDemand,
				this.oSupply,
				this.createProd,
			]);
		},
	},
}
</script>
