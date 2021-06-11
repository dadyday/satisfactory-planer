<template>
	<div id="palette">
	</div>
</template>

<script>
import BuildingType from '../lib/BuildingType';

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
			BuildingType.each((prod, oBuildingType) => {
				aModelData.push(oBuildingType.getNodeData(prod));
			});
			

			this.oPalette = $(go.Palette, "palette", {
				maxSelectionCount: 1,
				nodeTemplateMap: BuildingType.getTemplateMap(),
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