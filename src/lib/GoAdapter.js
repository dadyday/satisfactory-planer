import go from 'gojs';
var $ = go.GraphObject.make;
// alternativ? https://konvajs.org/docs/vue/index.html

import Building from './Building';
import Production from './Production';
import Node from './go/Node';

export default class GoAdapter {

	oPalette;
	oDiagram;
	commandHandler;

	constructor(elIdDiagram, elIdPalette) {
		const oTemplateMap = new go.Map();
		const aModelData = [];

		var id = 1;
		Building.each((oBuilding, type) => {
			const oProduction = new Production(oBuilding.type);
			oTemplateMap.add(type, Node.getTemplate(oProduction));
			aModelData.push(oProduction.getNodeData(id++));
		});

		this.initDiagram(elIdDiagram, oTemplateMap);
		this.initPalette(elIdPalette, oTemplateMap, aModelData);
	}

	load(oData) {
		this.oDiagram.model.nodeDataArray = oData.nodeDataArray ?? [];
		this.oDiagram.model.linkDataArray = oData.linkDataArray ?? [];
	}

	save() {
		const oData = JSON.parse(this.oDiagram.model.toJson());
		return {
			nodeDataArray: oData.nodeDataArray,
			linkDataArray: oData.linkDataArray,
		};
	}

	initPalette(elId, oTemplateMap, aModelData) {
		this.oPalette = $(go.Palette, elId, {
			"maxSelectionCount": 1,
			"nodeTemplateMap":   oTemplateMap,
			"model":             new go.GraphLinksModel(aModelData),
			"initialAutoScale":  go.Diagram.UniformToFill,
		});
		this.oPalette.model.nodeCategoryProperty = "type";
	}

	initDiagram(elId, oTemplateMap) {
		this.oDiagram = $(go.Diagram, elId, {
			"initialDocumentSpot": go.Spot.Top,
			"initialViewportSpot": go.Spot.Top,
			"initialAutoScale": go.Diagram.Uniform,
			"undoManager.isEnabled":                true, // enable Ctrl-Z to undo and Ctrl-Y to redo
			"commandHandler.doKeyDown":             () => this.handleKey.call(this),
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
			"rotatingTool.handleDistance":          0,
			"rotatingTool.snapAngleMultiple":       90,
			"rotatingTool.snapAngleEpsilon":        10,
			"nodeTemplateMap":                      oTemplateMap,
		});
		this.commandHandler = new go.CommandHandler();

		this.oDiagram.addDiagramListener('PartRotated', (ev) => {
			ev.subject.angle = Math.round(ev.subject.angle / 90) * 90;
		});



		var oFore = this.oDiagram.findLayer("Foreground");
		this.oDiagram.addLayerBefore($(go.Layer, { name: "elevated", opacity: 1.0, pickable: true }), oFore);
		this.oDiagram.addLayerBefore($(go.Layer, { name: "ground", opacity: 0.6, }), oFore);
		//this.oDiagram.findLayer("elevated").opacity = 0.5;

		//myDiagram.linkTemplateMap = createLinkTemplateMap();
		this.oDiagram.linkTemplate = $(go.Link,
			{
				routing: go.Link.AvoidsNodes, // go.Link.Orthogonal,
				corner: 20,
				//curve: go.Link.JumpOver,
				fromEndSegmentLength: 10,
				toEndSegmentLength: 10,
				//fromShortLength: -10,
				//toShortLength: -10,
				isShadowed: true,
				shadowColor: '#aaa',
				shadowOffset: new go.Point(5, 5),
			},
			$(go.Shape, {
				isPanelMain: true,
				stroke: "#6666",
				strokeWidth: 16,
			}),
			$(go.Shape, {
				isPanelMain: true,
				stroke: "#888",
				strokeWidth: 16,
				strokeDashArray: [1, 10],
			}),
			$(go.Shape, { toArrow: "Triangle" }),
			$(go.Shape, { fromArrow: "Triangle" })
		);

		this.oDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.AvoidsNodes;

		this.oDiagram.model = new go.GraphLinksModel([], []);
		this.oDiagram.model.nodeCategoryProperty = "type";
		this.oDiagram.model.nodeKeyProperty = "id";
		this.oDiagram.model.linkFromPortIdProperty = "fromPortId";
		this.oDiagram.model.linkToPortIdProperty = "toPortId";
		this.oDiagram.model.linkKeyProperty = "id";

	}

	handleKey() {
		const e = this.oDiagram.lastInput;
		var key = e.key;
		if (e.alt) key = 'alt-'+key;
		if (e.control || e.meta) key = 'ctrl-'+key;
		if (e.shift) key = 'shift-'+key;

		switch (key) {
			case 'R':
				alert('R');
				break;
			default:
				this.commandHandler.doKeyDown();
		}
	}

	addNodeAndLink(e, b) {
		// take a button panel in an Adornment, get its Adornment, and then get its adorned Node
		var node = b.part.adornedPart;
		// we are modifying the model, so conduct a transaction
		var diagram = node.diagram;
		diagram.startTransaction("add node and link");
		// have the Model add the node data
		var newnode = { key: "N" };
		diagram.model.addNodeData(newnode);
		// locate the node initially where the parent node is
		diagram.findNodeForData(newnode).location = node.location;
		// and then add a link data connecting the original node with the new one
		var newlink = { from: node.data.key, to: newnode.key };
		diagram.model.addLinkData(newlink);
		// finish the transaction -- will automatically perform a layout
		diagram.commitTransaction("add node and link");
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
