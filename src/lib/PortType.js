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



	// *********** gojs helper

	makePort(name) {
		const hor = this.side == 'top' || this.side == 'bottom';
		const swap = function (x, y) {
			return hor ? [x, y] : [y, x];
		};
		const side = this.side.charAt(0).toUpperCase() + this.side.substring(1);
		const oSpot = go.Spot[side];
		
		const port = $(go.Shape, "RoundedRectangle", {
			fill: this.inOut ? "#fc0" : "#0c0", 
			stroke: "#555", 
			strokeWidth: 0.5,
			desiredSize: new go.Size(...swap(20, 10)),
			//margin: new go.Margin(...swap(0, 5)),
			portId: name,
			cursor: "pointer",
			
			fromSpot: oSpot,
			fromLinkable: !this.inOut,
			fromMaxLinks: 1,
			
			toSpot: oSpot,
			toLinkable: this.inOut,
			toMaxLinks: 1,
			//margin: new go.Margin(10, 0),
			//alignment: go.Spot.Left,
		});

		return port;
		/*
		var panel = $(go.Panel, "Horizontal", { 
			margin: new go.Margin(2, 0),
			alignment: go.Spot['TopLeft'],
		}, port);
		
		return panel; //*/
	}

}
