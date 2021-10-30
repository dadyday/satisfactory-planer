<template>
	<div class="card" style="width: 300px">
		<b>{{ ('Produktion') }}</b>
		<hr/>
		<div>
			<select v-model="building" @change="refresh">
				<option v-for="[id, oItem] in buildingList" :value="id" :key="id">
					{{ oItem.getName() }}
				</option>
			</select>
		</div>
		<div>
			<select v-model="receipe" @change="refresh">
				<option v-for="[id, oItem] in receipeList" :value="id" :key="id">
					{{ oItem.id }}
				</option>
			</select>
		</div>
		<pre style="height: 300px; overflow:scroll">{{ node }}</pre>
		<!--div>
			<vue-select
				empty="- kein -"
				:options="receipeList" listKey="id" listValue="name"
			>
			</vue-select>
		</div-->
	</div>
</template>

<script>
import { Production, Building, Receipe } from '../entity';
import merge from 'deepmerge';

export default {
	props: {
		node: Object,
		part: Object,
	},
	data() {
		return {
			oProd: new Production(this.node.building, this.node.receipe),
		};
	},
	computed: {
		building: {
			get() { return this.oProd.oBuilding?.id ?? null; },
			set(value) { this.oProd.setBuilding(value); },
		},
		receipe: {
			get() { return this.oProd.oReceipe?.id ?? null; },
			set(value) { this.oProd.setReceipe(value); },
		},
		buildingList() {
			//return Array.from(Building.getAll().values());
			return Building.getAll();
		},
		receipeList() {
			return Receipe.getByBuilding(this.node.building);
		},
	},
	methods: {
		refresh() {
			const oData = this.oProd.getNodeData();
			this.node.building = oData.building;
			this.node.receipe = oData.receipe;
			this.node.ports = oData.ports;
			this.part.updateTargetBindings();
			//this.part.diagram.updateAllTargetBindings();
		}
	},
	created() {
	},
};

</script>

<style lang="scss">
.card {
	background: white;
	border-radius: 0.4em;
	border: solid 0.5px #ccc;
	box-shadow: 0.1em 0.1em 0.5em -0.2em #0008;
	padding: 0.5em;
	margin: 0.1em 0.2em;
	.vs__search {

		margin: 0;
	}
}


</style>
