import go from 'gojs';
var $ = go.GraphObject.make;

import  { Production, Building } from "../entity";
import Templates from './Templates';
import Foo from "../components/Ctrls/Foo.vue";

export default class GoAdapter {

	oPalette;
	oDiagram;
	commandHandler;
	animation;

	constructor(elIdDiagram, elIdPalette, mBuilding, aPortType) {
		const aModelData = [];


		mBuilding.forEach((oBuilding, id) => {
			const oProduction = oBuilding.createProduction();
			aModelData.push(oProduction.getNodeData());
		});

		this.initDiagram(elIdDiagram);
		this.initPalette(elIdPalette, aModelData);
	}

	load(oData) {
		this.oDiagram.model.nodeDataArray = oData?.nodeDataArray ?? [];
		this.oDiagram.model.linkDataArray = oData?.linkDataArray ?? [];
		this.startAnimation();
	}

	save() {
		const oData = JSON.parse(this.oDiagram.model.toJson());
		return {
			nodeDataArray: oData.nodeDataArray,
			linkDataArray: oData.linkDataArray,
		};
	}

	initPalette(elId, aModelData) {
		this.oPalette = $(go.Palette, elId, {
			"maxSelectionCount": 1,
			"nodeTemplate":      Templates.node(),
			"model":             new go.GraphLinksModel(aModelData),
			"initialAutoScale":  go.Diagram.UniformToFill,
			"contextMenuTool":   null,
			//"initialScale":      0.5
		});
		//this.oPalette.model.nodeCategoryProperty = "type";
	}

	initDiagram(elId) {
		// Animate the flow in the pipes

		this.oDiagram = $(go.Diagram, elId, {
			"InitialLayoutCompleted":								(e) => {},
			"initialDocumentSpot": 									go.Spot.Top,
			"initialViewportSpot": 									go.Spot.Top,
			"initialAutoScale": 										go.Diagram.Uniform,
			"undoManager.isEnabled":                true, // enable Ctrl-Z to undo and Ctrl-Y to redo
			"commandHandler.doKeyDown":             () => this.handleKey.call(this),
			"draggingTool.gridSnapCellSize":        new go.Size(20, 20),
			"draggingTool.isGridSnapEnabled":       true,
			//"draggingTool.gridSnapCellSpot":        new go.Spot(0,0,40,40),
			"grid":                                 Templates.grid(),
			"draggingTool.dragsLink":               false,
			"clickCreatingTool.archetypeNodeData":  (new Production('construct')).getNodeData(),

			"linkingTool.temporaryLink":						Templates.link(),
			"linkingTool.isValidLink": 							(fromNode, fromPort, toNode, toPort) => {
																								//$dump(fromNode, toNode);
																								if (fromPort.portId[1] != toPort.portId[1]) return false;
																								//if (fromPort.item && toPort.item) return fromPort.item == toPort.item
																								return true;
																							},
			"linkingTool.insertLink": 							(fromNode, fromPort, toNode, toPort) => {
																								const oLink = this.oDiagram.partManager.insertLink(fromNode, fromPort, toNode, toPort);
																								this.addAnimation(oLink);
																								return oLink;
																							},
			"linkingTool.isUnconnectedLinkValid":   false,
			"linkingTool.portGravity":              20,
			"linkingTool.archetypeLinkData":        { type: 'belt' },
//			"linkingTool.insertLink":               (fNode, fPort, tNode, tPort) => {
//																								console.log('create a transport', fNode, fPort, tNode, tPort);
//																							},

			"relinkingTool.isUnconnectedLinkValid": false,
			"relinkingTool.portGravity":            20,
			"relinkingTool.fromHandleArchetype":    Templates.linkHandle(true),
			"relinkingTool.toHandleArchetype":      Templates.linkHandle(false),
			"rotatingTool.handleAngle":             45,
			"rotatingTool.handleDistance":          0,
			"rotatingTool.snapAngleMultiple":       90,
			"rotatingTool.snapAngleEpsilon":        10,
			"nodeTemplate":													Templates.node(),
			"linkTemplate":													Templates.link(),
			//"nodeTemplateMap":                      oNodeTemplateMap,
			//"linkTemplateMap":                      oLinkTemplateMap,
		});
		this.commandHandler = new go.CommandHandler();

		this.oDiagram.addDiagramListener('PartRotated', (ev) => {
			ev.subject.angle = Math.round(ev.subject.angle / 90) * 90;
		});
		this.oDiagram.addDiagramListener("LinkDrawn", (ev) => {
			const oLinkData = ev.subject.data;
			const oFromNode = this.oDiagram.findNodeForKey(oLinkData.from);
			const oToNode = this.oDiagram.findNodeForKey(oLinkData.to);

			if (oFromNode && oToNode) {
				const oOutProd = Production.createFromNodeData(oFromNode.data);
				const oInProd = Production.createFromNodeData(oToNode.data);

				var item = null; //oOutProd.getPortItem(oLinkData.fromPortId) ?? null;
				if (item) {
					oInProd.setPortItem(oLinkData.toPortId, item);
				}
				else {
					item = null; //oInProd.getPortItem(oLinkData.toPortId);
					if (item) {
						oOutProd.setPortItem(oLinkData.fromPortId, item);
					}
				}
				//$dump(oOutProd, oInProd, item)

				this.oDiagram.model.commit((oModel) => {
					oModel.assignAllDataProperties(oFromNode.data, oOutProd.getNodeData());
					oModel.assignAllDataProperties(oToNode.data, oInProd.getNodeData());
				});
			}
		});



		var oFore = this.oDiagram.findLayer("Foreground");
		this.oDiagram.addLayerBefore($(go.Layer, { name: "elevated", opacity: 1.0, pickable: true }), oFore);
		this.oDiagram.addLayerBefore($(go.Layer, { name: "ground", opacity: 0.6, }), oFore);
		//this.oDiagram.findLayer("elevated").opacity = 0.5;

		this.oDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.AvoidsNodes;
		/*this.oDiagram.toolManager.linkingTool.copyPortProperties = (realnode, realport, tempnode, tempport, toend) => {
			console.log(go.LinkingTool.prototype.constructor.prototype);
			const oLinkData = this.oDiagram.toolManager.linkingTool.prototype.copyPortProperties.call(this.oDiagram.toolManager.linkingTool);
			console.log(realnode, realport, tempnode, tempport, toend, oLinkData);
			return oLinkData;
		},*/

		this.oDiagram.model = new go.GraphLinksModel([], []);
		this.oDiagram.model.nodeKeyProperty = "id";
		this.oDiagram.model.nodeCategoryProperty = "type";
		this.oDiagram.model.linkKeyProperty = "id";
		this.oDiagram.model.linkFromPortIdProperty = "fromPortId";
		this.oDiagram.model.linkToPortIdProperty = "toPortId";
		this.oDiagram.model.linkCategoryProperty = "type";

	}

	addAnimation(oLink) {
		var oStripes = oLink.findObject('BELT');
		if (oStripes) this.animation.add(oStripes, "strokeDashOffset", 8, 0);
		oStripes = oLink.findObject('PIPE');
		if (oStripes) this.animation.add(oStripes, "strokeDashOffset", 1, 0);
	}

	startAnimation(run = true) {
		this.animation = new go.Animation();
		this.animation.easing = go.Animation.EaseLinear;
		this.animation.runCount = Infinity;
		this.oDiagram.links.each((oLink) => this.addAnimation(oLink));
		if (run) this.animation.start();
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
