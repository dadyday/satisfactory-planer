import go from 'gojs';
var $ = go.GraphObject.make;

import  { Receipe, Item } from "../entity";

export default class Port {

	static getTemplates(aPort) {
		const oSide = {left:[], right:[], top:[], bottom:[]};

		var i = 0, o = 0;
		for (var oPort of aPort) {
			const id = oPort.inOut ? 'in'+(i++) : 'out'+(o++);
			oSide[oPort.side].push(this.makePort(id, oPort));
		}

		return oSide;
	}

	static makePort(id, oPort) {
		const hor = oPort.side == 'top' || oPort.side == 'bottom';
		const swap = function (x, y) {
			return hor ? [x, y] : [y, x];
		};
		const side = oPort.side.charAt(0).toUpperCase() + oPort.side.substring(1);
		const oSpot = go.Spot[side];

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
				click: () => alert("port clicked ..."),
			},
			oShape,
			$(go.Picture, '',
				{
					row: 0,
					column: 0,
					height: 15,
					width: 15,
				},
				new go.Binding("source", "", (oNodeData) => this.getSource(oPort, oNodeData)),
				new go.Binding("angle", 'drawangle', (a) => { return -a; }),
			),
		);

		return oPanel;
	}

	static getSource(oPort, oNodeData) {
		const oReceipe = Receipe.get(oNodeData.receipe);
		const [item, ] = oReceipe.getPortItem(oPort);
		const oItem = Item.get(item);
		//$dump('src', oPort, oNodeData, aItem);
		return oItem.imageUrl();
	}
}
