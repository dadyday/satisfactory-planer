<template>
	<div id="palette">
	</div>
</template>

<script>
import Building from '../lib/Building';

import go from 'gojs';
var $ = go.GraphObject.make;

export default {
	props: {
		objects: Array,
	},
	data() {
		return {
			oPalette: null,
		};
	},
	computed: {
	},
	watch: {
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			const aModelData = [];
			Building.each((type, oBuilding) => {
				aModelData.push(oBuilding.getNodeData(type));
			});
			

			this.oPalette = $(go.Palette, "palette", {
				maxSelectionCount: 1,
				nodeTemplateMap: Building.getTemplateMap(),
				model: new go.GraphLinksModel(aModelData),
				initialAutoScale: go.Diagram.UniformToFill, 
				
			});
			this.oPalette.model.nodeCategoryProperty = "type";
		}
	}
}
</script>

<style>
#palette {
	width:160px;
	height:400px;
	background-color: #dadae8;
}
</style>