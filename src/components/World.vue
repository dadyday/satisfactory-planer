<template>
	<Rows id="world" >
		<Cols>
			<div id="palette" />
			<div id="diagram" />
		</Cols>
		<Cols id="menu">
			<button @click="load">Load</button>
			<button @click="save">Save</button>
			<Dropdown label="Data">
				<textarea v-model="model" rows="8" style="width:30em" />
			</Dropdown>
		</Cols>
	</Rows>
</template>

<style lang="scss">
#menu {
}
#palette, #diagram {
	width:160px;
	height:400px;
	background-color: #dadae8;
	border: solid 1px #889;
}
#diagram {
	width:1200px;
}
</style>

<script>
import GoAdapter from '../lib/GoAdapter';
import _ from 'underscore';

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
		this.go = new GoAdapter('diagram', 'palette');
	},
	methods: {
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
			const aType = _.groupBy(this.go.oDiagram.model.nodeDataArray, (oItem) => {
				return '_'+oItem.type;
			});
			_.map(oModel.nodeDataArray, (oNode) => {
				const aOld = _.get(aType, '_'+oNode.type);
				if (aOld) {
					const oOld = aOld.shift();
					if (oOld) {
						oNode.pos = oOld.pos;
						oNode.orient = oOld.orient;
						oNode.drawangle = oOld.drawangle;
					}
				}
			});
		},

	}
}

</script>
