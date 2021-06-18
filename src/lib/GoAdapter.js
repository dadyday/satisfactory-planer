import go from 'gojs';
var $ = go.GraphObject.make;
// alternativ? https://konvajs.org/docs/vue/index.html

import Building from './Building';

export default class GoAdapter {

	static createWorkspace(elIdDiagram, elIdPalette) {
		const oTemplateMap = Building.getTemplateMap();
		
		const aModelData = [];
		Building.each((oBuilding, type) => {
			aModelData.push(oBuilding.getNodeData(type));
		});

		return [
			GoAdapter.createDiagram(elIdDiagram, oTemplateMap),
			GoAdapter.createPalette(elIdPalette, oTemplateMap, aModelData),
		];
	}

	static createPalette(elId, oTemplateMap, aModelData) {
		const oPalette = $(go.Palette, elId, {
			"maxSelectionCount": 1,
			"nodeTemplateMap":   oTemplateMap,
			"model":             new go.GraphLinksModel(aModelData),
			"initialAutoScale":  go.Diagram.UniformToFill, 
		});
		oPalette.model.nodeCategoryProperty = "type";
		return oPalette;
	}

	static createDiagram(elId, oTemplateMap) {
		
		const oDiagram = $(go.Diagram, elId, {
			"undoManager.isEnabled":                true,                                    // enable Ctrl-Z to undo and Ctrl-Y to redo
			"draggingTool.gridSnapCellSize":        new go.Size(20, 20),
			"draggingTool.isGridSnapEnabled":       true,
			"draggingTool.gridSnapCellSpot":        new go.Spot(0,0,20,20),
			"grid":                                 $(go.Panel, "Grid",
				$(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
				$(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 8 }),
				$(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
				$(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 8 })
			),
			"draggingTool.dragsLink":               false,
			"linkingTool.isUnconnectedLinkValid":   true,
			"linkingTool.portGravity":              20,
			"relinkingTool.isUnconnectedLinkValid": true,
			"relinkingTool.portGravity":            20,
			"rotatingTool.handleAngle":             45,
			"rotatingTool.handleDistance":          -10,
			"rotatingTool.snapAngleMultiple":       90,
			"rotatingTool.snapAngleEpsilon":        90,
			"nodeTemplateMap":                      oTemplateMap,
		});

		var oFore = oDiagram.findLayer("Foreground");
		oDiagram.addLayerBefore($(go.Layer, { name: "ground" }), oFore);
		oDiagram.addLayerBefore($(go.Layer, { name: "elevated", opacity: 0.5, pickable: true }), oFore);
		//oDiagram.findLayer("elevated").opacity = 0.5;
		
		//myDiagram.linkTemplateMap = createLinkTemplateMap();
		oDiagram.linkTemplate = $(go.Link,
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

		oDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.AvoidsNodes;

		oDiagram.model = new go.GraphLinksModel([], []);
		oDiagram.model.nodeCategoryProperty = "type";
		oDiagram.model.nodeKeyProperty = "id";
		oDiagram.model.linkFromPortIdProperty = "fromPortId";
		oDiagram.model.linkToPortIdProperty = "toPortId";
		oDiagram.model.linkKeyProperty = "id";

		return oDiagram;
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
