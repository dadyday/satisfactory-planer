import go from 'gojs';
var $ = go.GraphObject.make;

export default class Building {
	name = '';
	oReceipe;
	productivity = 1.0;
	static aInput = [];
	static aOutput = [];
	
	constructor(oReceipe) {
		this.name = oReceipe.name;
		this.oReceipe = oReceipe;
	}

	static makePort(name, inOut, side) {
		var port = $(go.Shape, "RoundedRectangle", {
			fill: inOut ? "#fc0" : "#0c0", 
			stroke: null,
			desiredSize: new go.Size(20, 20),
			portId: name,  // declare this object to be a "port"
			toMaxLinks: 1,  // don't allow more than one link into a port
			cursor: "pointer",  // show a different cursor to indicate potential link point
			toSpot: go.Spot[side],
			toLinkable: true,
		});

		var panel = $(go.Panel, "Horizontal", { 
			margin: new go.Margin(2, 0),
			alignment: go.Spot['Top'+side],
		}, port);
		
		return panel;
	}

	static makeTemplate() {
		var panel = $(go.Panel, "Auto",
			{ width: this.width * 10, height: this.height * 10 },
			$(go.Shape, "RoundedRectangle", {
				fill: "#fc04", stroke: null, strokeWidth: 0,
				spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
			}),
			$(go.Panel, "Table",
				$(go.TextBlock, this.name, {
					row: 0,
					margin: 3,
					maxSize: new go.Size(80, NaN),
					stroke: "white",
					font: "bold 11pt sans-serif"
				}),
				// $(go.Picture, icon, { row: 1, width: 16, height: 16, scale: 3.0 }),
				$(go.TextBlock, 
					{
						row: 2,
						margin: 3,
						editable: true,
						maxSize: new go.Size(80, 40),
						stroke: "white",
						font: "bold 9pt sans-serif"
					}
				//  new go.Binding("text", "name").makeTwoWay()
				)
			)
		);

		const aIn = [];
		for (var i = 0; i < this.aInput.length; i++) {
			aIn.push(this.makePort("in"+i, true, 'Left'));
		}

		const aOut = [];
		for (var o = 0; o < this.aOutput.length; o++) {
			aOut.push(this.makePort("out"+o, false, 'Right'));
		}

		var node = $(go.Node, "Spot", 
		panel,
		$(go.Panel, "Vertical", {
			alignment: go.Spot.Left,
			alignmentFocus: new go.Spot(0, 0.5, 8, 0)
		}, aIn),
		$(go.Panel, "Vertical", {
			alignment: go.Spot.Right,
			alignmentFocus: new go.Spot(1, 0.5, -8, 0)
		}, aOut)
		);


		return node;
	}



	static createProd(oReceipe) {
		const oBuildingClass = this.get(oReceipe.prod);
		return new oBuildingClass(oReceipe);
	}

	static aList = {};

	static register(prod, oBuildingClass) {
		this.aList[prod] = oBuildingClass;
	}

	static get(prod) {
		return this.aList[prod];
	}

	static getTemplateMap() {
		const aMap = new go.Map();
		for (var prod in this.aList) {
			var oProd = this.aList[prod];
			aMap.add(prod, oProd.makeTemplate());
		}
		return aMap;
	}
}

class Miner extends Building {
	aOutput = ['units'];
}

class Constructor extends Building {
	aInput = ['units'];
	aOutput = ['units'];
}

class Smelter extends Building {
	aInput = ['units'];
	aOutput = ['units'];
}

class Foundry extends Building {
	aInput = ['units', 'units'];
	aOutput = ['units'];
}

Building.register('miner', Miner);
Building.register('constructor', Constructor);
Building.register('smelter', Smelter);
Building.register('foundry', Foundry);
