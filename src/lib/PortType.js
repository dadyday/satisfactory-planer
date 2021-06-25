import go from 'gojs';
var $ = go.GraphObject.make;


export default class PortType {

	type = null;
	inOut = null;
	offset = null;
	side = null;

	constructor(type, inOut, offset = 0, side = null) {
		this.type = type;
		this.inOut = inOut;
		this.offset = offset;
		this.side = side ? side : (inOut ? 'left' : 'right');
	}

	imageUrl() {
		return '/img/item/big/battery.png';
	}

	// *********** gojs helper

	makePort(name) {
		const hor = this.side == 'top' || this.side == 'bottom';
		const swap = function (x, y) {
			return hor ? [x, y] : [y, x];
		};
		const side = this.side.charAt(0).toUpperCase() + this.side.substring(1);
		const oSpot = go.Spot[side];

		const oPort = $(go.Shape, "RoundedRectangle", {
			fill: this.inOut ? "#fc0" : "#0c0",
			stroke: "#555",
			strokeWidth: 1,
			parameter1: 2,
			desiredSize: new go.Size(...swap(20, 10)),
		});

		var oPanel = $(go.Panel, "Auto", {
				portId: name,
				cursor: "pointer",

				fromSpot: oSpot,
				fromLinkable: !this.inOut,
				fromMaxLinks: 1,

				toSpot: oSpot,
				toLinkable: this.inOut,
				toMaxLinks: 1,

				margin: new go.Margin(...swap(0, 9.5)),
				click: () => alert("port clicked ..."),
			},
			oPort,
			$(go.Picture, this.imageUrl(),
				{
					row: 0,
					column: 0,
					height: 15,
					width: 15,
				},
				new go.Binding("source", "type", this.imageUrl),
				new go.Binding("angle", 'drawangle', (a) => { return -a; }),
			),
		);

		return oPanel;
	}

}
