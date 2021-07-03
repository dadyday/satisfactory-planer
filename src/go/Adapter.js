import go from 'gojs';
var $ = go.GraphObject.make;

import Node from './Node';

export default class GoAdapter {

	oPalette;
	oDiagram;
	commandHandler;

	constructor(elIdDiagram, elIdPalette, mBuilding) {
		const oTemplateMap = new go.Map();
		const aModelData = [];

		mBuilding.forEach((oBuilding, id) => {
			const oProduction = oBuilding.createProduction();
			oTemplateMap.add(id, Node.getTemplate(oBuilding));
			aModelData.push(oProduction.getNodeData());
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

	// demo
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
