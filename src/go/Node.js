import go from 'gojs';
var $ = go.GraphObject.make;

import vueHelper from '../helper';
import Card from "../components/ProdCard.vue";
import Production from "../entity/Production";
import Receipe from "../entity/Receipe";



export default class Node {

	static oLastPoint = new go.Point(0,0);

	static getTemplate(oBuilding) {
		const sz = Math.min(oBuilding.oSize.width-10, oBuilding.oSize.height-10);

		var oPanel = $(go.Panel, "Auto",
			{
				width: oBuilding.oSize.width,
				height: oBuilding.oSize.height,
			},
			//new go.Binding("contextMenu", "production", oBuilding.makeContextMenu),
			$(go.Shape, "RoundedRectangle", {
				fill: "#fb04", stroke: "#430", strokeWidth: 2,
			}),
			$(go.Picture, oBuilding.imageUrl(),
				{
					row: 0,
					column: 0,
					height: sz,
					width: sz,
				},
				new go.Binding("source", "type", oBuilding.imageUrl),
				new go.Binding("angle", 'drawangle', (a) => { return -a; }),
			),

			$(go.Panel, "Table",
				$(go.TextBlock, '', {
					row: 0,
					column: 1,
					margin: 3,
					maxSize: new go.Size(80, NaN),
					stroke: "white",
					font: "bold 10pt sans-serif",
				}, new go.Binding("text", "name")),
				// $(go.Picture, icon, { row: 1, width: 16, height: 16, scale: 3.0 }),
				$(go.TextBlock, '', {
					row: 1,
					column: 1,
					margin: 3,
					editable: true,
					maxSize: new go.Size(80, 40),
					stroke: "white",
					font: "9pt sans-serif"
				}, new go.Binding("text", "receipe", this.getReceipName)),
			),
		);

		const oSide = {left:[], right:[], top:[], bottom:[]};

		var i = 0, o = 0;
		for (var oPort of oBuilding.aPort) {
			const port = oPort.inOut ? 'in'+(i++) : 'out'+(o++);
			oSide[oPort.side].push(oPort.makePort(port));
		}

		var oNode = $(go.Node, "Spot",
			{
				locationSpot: go.Spot.Center,
				dragComputation: (oNode, oPoint, oGridPoint) => this.avoidNodeOverlap(oNode, oPoint, oGridPoint, oBuilding.aLayer),
				rotatable: true,
				isShadowed: true,
				contextMenu: this.makeContextMenu(),
			},
			new go.Binding("location", "pos", this.getPos).makeTwoWay(this.makePos),
			new go.Binding("layerName", "layer"),
			new go.Binding("angle", "orient", this.getAngle).makeTwoWay(this.makeOrient),
			new go.Binding("angle", 'drawangle').makeTwoWay(),

			oPanel,
			$(go.Panel, "Vertical", {
				alignment: go.Spot.Left,
				alignmentFocus: new go.Spot(0, 0.5, 4, 0)
			}, oSide.left),
			$(go.Panel, "Vertical", {
				alignment: go.Spot.Right,
				alignmentFocus: new go.Spot(1, 0.5, -4, 0)
			}, oSide.right),
			$(go.Panel, "Horizontal", {
				alignment: go.Spot.Top,
				alignmentFocus: new go.Spot(0.5, 0, 0, 4)
			}, oSide.top),
			$(go.Panel, "Horizontal", {
				alignment: go.Spot.Bottom,
				alignmentFocus: new go.Spot(0.5, 1, 0, -4)
			}, oSide.bottom),
		);

		return oNode;
	}

	static makeContextMenu() {
		// https://github.com/NorthwoodsSoftware/GoJS/blob/master/samples/customContextMenu.html
		let oMenu = null;
		return $(go.HTMLInfo,
			{
				show: (oNode, oDiagram) => {
					const oProduction = Production.createFromNodeData(oNode.data);
					const oPos = oDiagram.lastInput.viewPoint;
					oMenu = vueHelper.createComponent(oDiagram.div, Card, {
						obj: oProduction,
						x: oPos.x,
						y: oPos.y,
					}, {
						update: (oProduction) => {
							oDiagram.model.commit((oModel) => {
								const oData = oProduction.getNodeData();
								oModel.assignAllDataProperties(oNode.data, oData);
							});
						},

					});
				},
				hide: () => {
					vueHelper.destroyComponent(oMenu);
				}
			}
		);
	}

	static avoidNodeOverlap(oNode, oPoint, oGridPoint, aLayer) {
		const oBounds = oNode.actualBounds;
		const oLoc = oNode.location;
		const oRect = new go.Rect(
			oGridPoint.x - (oLoc.x - oBounds.x),
			oGridPoint.y - (oLoc.y - oBounds.y),
			oBounds.width,
			oBounds.height
		);
		oRect.inflate(-15, -15);

		//var oLayers = oNode.diagram.layers;
		//while (oLayers.next()) {

		for (const layer of aLayer) {
			//var oLayer = oLayers.value;
			var oLayer = oNode.diagram.findLayer(layer)
			// if (!oLayer) console.error(`layer ${layer} not found!`);
			if (!oLayer || oLayer.isTemporary) continue;

			var aObj = oLayer.findObjectsIn(oRect, (oObj) => {
				var oPart = oObj.part;
				if (oPart === oNode) return null;
				if (oPart instanceof go.Link) return null;
				if (oPart.isMemberOf(oNode)) return null;
				if (oNode.isMemberOf(oPart)) return null;
				return oPart;
			}, null, true);

			if (aObj.count > 0) {
				//console.log(aObj)
				return this.oLastPoint;
			}
		}
		this.oLastPoint.set(oGridPoint);
		return oGridPoint;
	}

	static makeOrient(angle) {
		return Math.round(angle / 90);
	}

	static getAngle(orientation) {
		return orientation * 90;
	}

	static makePos(oPos) {
		return [ oPos.x, oPos.y ];
	}

	static getPos(aPos) {
		return new go.Point(...aPos);
	}

	static getReceipName(receipe) {
		return Receipe.get(receipe).name;
	}

}
