<template>
	<Rows id="world" >
		<Cols id="menu">
			<button @click="empty">New</button>
			<button @click="load">Load</button>
			<button @click="save">Save</button>
			<Dropdown label="Data">
				<textarea v-model="model" rows="8" style="width:30em" />
			</Dropdown>
			<Dropdown label="Rezept konvertieren">
				<ParseReceipe />
			</Dropdown>
		</Cols>
		<Split vertical>
			<Pane id="palette" size="15em" oncontextmenu="return false" />
			<Pane id="diagram" oncontextmenu="return false" />
		</Split>
	</Rows>
</template>

<style lang="scss">
#world {
	height: 100%;
	#menu {
	}
	#palette, #diagram {
		width:160px;
		background-color: #dadae8;
		border: solid 1px #889;
	}
	#diagram {
		width:1200px;
	}
}
</style>

<script>
import { Building, Port } from '../entity';
import GoAdapter from '../go/Adapter';
import Store from 'store';

export default {
	model: {
		prop: 'model',
		event: 'save',
	},
	props: {
		model: String,
		scheme: Object,
	},
	data() {
		return {
			go: null,
		};
	},
	computed: {
	},
	watch: {
		scheme() {
			this.draw();
		}
	},
	mounted() {
		this.go = new GoAdapter('diagram', 'palette', Building.getAll(), Port.getTypes());
		this.go.oDiagram.addModelChangedListener((ev) => {
			if (ev.isTransactionFinished) this.pushModel();
		});
		this.popModel();
	},
	methods: {
		pushModel() {
			const oModel = this.go.save();
			Store.set('blueprint', oModel);
			// const aStore = Store.get('model', []);
			// aStore.push(this.go.save());
			// Store.set('model', aStore.slice(-20));
		},
		popModel() {
			const oModel = Store.get('blueprint');
			this.applyModel(oModel);
			// const aStore = Store.get('model', []);
			// this.applyModel(aStore.pop() ?? {});
			// Store.set('model', aStore.slice(-20));
		},
		empty() {
			this.applyModel({});
			this.pushModel();
		},
		save() {
			const oData = this.go.save();
			const data = JSON.stringify(oData, null, "  ");
			this.$emit('save', data);
			this.go.oDiagram.isModified = false;
		},
		load() {
			const oModel = JSON.parse(this.model);
			this.applyModel(oModel);
		},
		draw() {
			const oModel = this.scheme.getModel();
			this.applyNodePositions(oModel);
			this.applyModel(oModel);
		},
		applyModel(oModel) {
			this.go.load(oModel);
		},

		applyNodePositions(oModel) {
			const aType = $_.groupBy(this.go.oDiagram.model.nodeDataArray, (oItem) => {
				return '_'+oItem.type;
			});
			$_.map(oModel.nodeDataArray, (oNode) => {
				const aOld = $_.get(aType, '_'+oNode.type);
				if (aOld) {
					const oOld = aOld?.shift() ?? null;
					if (oOld) {
						oNode.pos = oOld.pos;
						oNode.orient = oOld.orient;
					}
				}
			});
		},

	}
}

</script>
