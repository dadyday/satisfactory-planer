import go from 'gojs';
var $ = go.GraphObject.make;

import vueHelper from '../helper';
import  { Production, Receipe, Item } from "../entity";
import CtxMenu from "../components/PortMenu.vue";

export default class Port {

	static getTemplates(aPort) {
		const oSide = {left:[], right:[], top:[], bottom:[]};

		var i = 0, o = 0;
		for (var oPort of aPort) {
			const id = oPort.inOut ? 'in'+(i++) : 'out'+(o++);
			for (var f1 = 0; f1 < oPort.offset; f1++) {
				oSide[oPort.side].push(this.makePort(id, oPort, true));
			}
			oSide[oPort.side].push(this.makePort(id, oPort));
			for (var f2 = 0; f2 > oPort.offset; f2--) {
				oSide[oPort.side].push(this.makePort(id, oPort, true));
			}
		}
		return oSide;
	}

	static makePort(id, oPort, dummy = false) {
		const hor = oPort.side == 'top' || oPort.side == 'bottom';
		const swap = function (x, y) {
			return hor ? [x, y] : [y, x];
		};
		const side = oPort.side.charAt(0).toUpperCase() + oPort.side.substring(1);
		const oSpot = go.Spot[side];

		if (dummy) {
			return $(go.Panel, "Auto", {
					margin: new go.Margin(...swap(0, 9.5)),
					click: (...aArg) => this.portClicked(...aArg),
					contextMenu: this.makeContextMenu(),
				},
				$(go.Shape, "RoundedRectangle", {
					fill: "#0000",
					strokeWidth: 0,
					desiredSize: new go.Size(...swap(21, 4))})
			);
		}

		const oShape = $(go.Shape, "RoundedRectangle", {
			fill: oPort.inOut ? "#fc0" : "#0c0",
			stroke: "#555",
			strokeWidth: 1,
			parameter1: 2,
			desiredSize: new go.Size(...swap(20, 14)),
		});

		var oPanel = $(go.Panel, "Auto", {
				portId: id,
				cursor: "pointer",

				fromSpot: oSpot,
				fromLinkable: !oPort.inOut,
				fromMaxLinks: 1,

				toSpot: oSpot,
				toLinkable: oPort.inOut,
				toMaxLinks: 1,

				margin: new go.Margin(...swap(0, 9.5)),
				click: (...aArg) => this.portClicked(...aArg),
				contextMenu: this.makeContextMenu(),
			},
			oShape,
			$(go.Picture, '',
				{
					row: 0,
					column: 0,
					height: 15,
					width: 15,
				},
				new go.Binding("source", "ports", oPort => this.getSource(oPort, id)),
				//new go.Binding("source", "", (oNodeData) => this.getSource(oPort, oNodeData)),
				new go.Binding("angle", 'drawangle', (a) => { return -a; }),
			),
		);

		return oPanel;
	}

	static portClicked(oEv, oPort) {
		console.log(oEv, oPort);
		alert(`port ${oPort.portId} clicked ...`);
	}

	static makeContextMenu() {
		let oMenu = null;
		return $(go.HTMLInfo, {
			show: (oPort, oDiagram) => {
				const oNode = oPort.part;
				const oProduction = Production.createFromNodeData(oNode.data);
				const oPos = oDiagram.lastInput.viewPoint;

				oMenu = vueHelper.createComponent(oDiagram.div, CtxMenu, {
					production: oProduction,
					portId: oPort.portId,
					x: oPos.x,
					y: oPos.y,
				}, {
					update: (oProduction) => {
						oDiagram.model.commit((oModel) => {
							const oData = oProduction.getNodeData();
							//$dump(oProduction, oData)
							oModel.assignAllDataProperties(oNode.data, oData);
						});
					},

				});
			},
			hide: () => {
				vueHelper.destroyComponent(oMenu);
			}
		});
	}

	static getSource(oPorts, id) {
		const item = oPorts[id] ?? null;
		const oItem = Item.get(item);
		return oItem.imageUrl();
	}

}
