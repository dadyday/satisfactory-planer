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
			oPalette: null,
			oDiagram: null,
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
		[
			this.oDiagram, 
			this.oPalette
		] = GoAdapter.createWorkspace(
			'diagram',
			'palette',
		);
	},
	methods: {
		save() {
			const data = {
				nodeDataArray: this.oDiagram.model.nodeDataArray,
				linkDataArray: this.oDiagram.model.linkDataArray,
			};
			this.$emit('save', JSON.stringify(data, null, "  "));
			this.oDiagram.isModified = false;
		},
		load() {
			const oModel = 	this.oDiagram.model.fromJson(this.model);
			this.applyModel(oModel);
		},
		draw() {
			const oModel = this.scheme.getModel();
			this.applyNodePositions(oModel);
			this.applyModel(oModel);
		},
		applyModel(oModel) {
			this.oDiagram.model.nodeDataArray = oModel.nodeDataArray;
			this.oDiagram.model.linkDataArray = oModel.linkDataArray;
		},

		applyNodePositions(oModel) {
			const aType = _.groupBy(this.oDiagram.model.nodeDataArray, (oItem) => { 
				return '_'+oItem.type;
			});
			_.map(oModel.nodeDataArray, (oNode) => {
				const aOld = _.get(aType, '_'+oNode.type);
				if (aOld) {
					const oOld = aOld.shift(); 
					if (oOld) oNode.pos = oOld.pos;
				}
			});
		},
		
	}
}

</script>
