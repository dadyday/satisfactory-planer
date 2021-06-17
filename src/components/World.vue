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
import Building from '../lib/Building';
import _ from 'underscore';

import go from 'gojs';
var $ = go.GraphObject.make;
// alternativ? https://konvajs.org/docs/vue/index.html

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
		this.initPalette();
		this.initDiagram();
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
			const oModel = go.Model.fromJson(this.model);
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
		
		initPalette() {
			const aModelData = [];
			Building.each((oBuilding, type) => {
				aModelData.push(oBuilding.getNodeData(type));
			});
			
			this.oPalette = $(go.Palette, "palette", {
				maxSelectionCount: 1,
				nodeTemplateMap: Building.getTemplateMap(),
				model: new go.GraphLinksModel(aModelData),
				initialAutoScale: go.Diagram.UniformToFill, 
				
			});
			this.oPalette.model.nodeCategoryProperty = "type";
		},
		initDiagram() {
			this.oDiagram = $(go.Diagram, "diagram", {
				"undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
				"draggingTool.gridSnapCellSize": new go.Size(20, 20),
				"draggingTool.isGridSnapEnabled": true,
				"draggingTool.gridSnapCellSpot": new go.Spot(0,0,20,20),
				grid: $(go.Panel, "Grid",
					$(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
					$(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 8 }),
					$(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
					$(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 8 })
				),
				"draggingTool.dragsLink": false,
				"linkingTool.isUnconnectedLinkValid": true,
				"linkingTool.portGravity": 20,
				"relinkingTool.isUnconnectedLinkValid": true,
				"relinkingTool.portGravity": 20,
				"rotatingTool.handleAngle": 45,
				"rotatingTool.handleDistance": -10,
				"rotatingTool.snapAngleMultiple": 90,
				"rotatingTool.snapAngleEpsilon": 90,
				"nodeTemplateMap": Building.getTemplateMap(),
			});

			var oFore = this.oDiagram.findLayer("Foreground");
			this.oDiagram.addLayerBefore($(go.Layer, { name: "ground" }), oFore);
			this.oDiagram.addLayerBefore($(go.Layer, { name: "elevated", opacity: 0.5, pickable: true }), oFore);
			//this.oDiagram.findLayer("elevated").opacity = 0.5;
			
			//myDiagram.linkTemplateMap = createLinkTemplateMap();
			this.oDiagram.linkTemplate = $(go.Link,
				{ 
					routing: go.Link.Orthogonal, 
					//routing: go.Link.AvoidsNodes,
					corner: 20,
					curve: go.Link.JumpOver,
					fromEndSegmentLength: 20, 
					fromShortLength: -10,  
					toEndSegmentLength: 20,
					toShortLength: -10,  
				},
				$(go.Shape, // the link's path shape
					{ strokeWidth: 16, stroke: "#555" }
				)
			);

			this.oDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.AvoidsNodes;

			this.oDiagram.model = new go.GraphLinksModel([], []);
			this.oDiagram.model.nodeCategoryProperty = "type";
			this.oDiagram.model.nodeKeyProperty = "id";
			this.oDiagram.model.linkFromPortIdProperty = "fromPortId";
			this.oDiagram.model.linkToPortIdProperty = "toPortId";
			this.oDiagram.model.linkKeyProperty = "id";
		},
	}
}

/*
"relinkingTool.fromHandleArchetype":
	$(go.Shape, "Diamond", { 
		segmentIndex: 0, 
		cursor: "pointer", 
		desiredSize: new go.Size(8, 8), 
		fill: "tomato", 
		stroke: "darkred" 
	}),
"relinkingTool.toHandleArchetype":
	$(go.Shape, "Diamond", { 
		segmentIndex: -1, 
		cursor: "pointer", 
		desiredSize: new go.Size(8, 8), 
		fill: "darkred", 
		stroke: "tomato" 
	}),
"linkReshapingTool.handleArchetype":
	$(go.Shape, "Diamond", { 
		desiredSize: new go.Size(14, 14), 
		fill: "#eee", 
		stroke: "deepskyblue" 
	}),


	var myDiagram = $(
		go.Diagram, 
		"myDiagramDiv",  // create a Diagram for the DIV HTML element
		{
			initialAutoScale: go.Diagram.Uniform,  // scale to show all of the contents
		//  "ChangedSelection": onSelectionChanged, // view additional information
			
			
			"ModelChanged": function(e) {     // just for demonstration purposes,
				if (e.isTransactionFinished) {  // show the model data in the page's TextArea
					//document.getElementById("mySavedModel").textContent = e.model.toJson();
				}
			}
		}
	);
	myDiagram.nodeTemplate = $(
		go.Node, 
		"Spot",
		{
			locationObjectName: "PORT",
			locationSpot: go.Spot.Top,  // location point is the middle top of the PORT
			//linkConnected: updatePortHeight,
			//linkDisconnected: updatePortHeight,
			toolTip:
				$("ToolTip",
					$(go.TextBlock, { margin: 4, width: 140 },
						new go.Binding("text", "", function(data) { return data.text + ":\n\n" + data.description; }))
				)
		},
		new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
			// The main element of the Spot panel is a vertical panel housing an optional icon,
			// plus a rectangle that acts as the port
		$(
			go.Panel, 
			"Vertical", 
			$(
				go.Shape, 
				{
					width: 40, height: 0,
					stroke: null, strokeWidth: 0, fill: "gray"
				},
				new go.Binding("height", "icon", function() { return 40; }),
				new go.Binding("fill", "color", colorFunc),
				new go.Binding("geometry", "icon", geoFunc)),
				$(
					go.Shape, 
					{
						name: "PORT",
						width: 40, height: 24, margin: new go.Margin(-1, 0, 0, 0),
						stroke: null, strokeWidth: 0, fill: "gray",
						portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true
					},
					new go.Binding("fill", "color", colorFunc)
				),
				$(
					go.TextBlock,
					{
						font: "Bold 14px Lato, sans-serif",
						textAlign: "center",
						margin: 3,
						maxSize: new go.Size(100, NaN),
						alignment: go.Spot.Top,
						alignmentFocus: go.Spot.Bottom,
						editable: true
					},
					new go.Binding("text").makeTwoWay()
				)
			)
		);
	*/
</script>
