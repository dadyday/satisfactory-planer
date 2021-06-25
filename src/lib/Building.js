import Production from './Production';
import PortType from './PortType';

import go from 'gojs';
var $ = go.GraphObject.make;
var oLastPoint = new go.Point(0,0);

export default class Building {

	static mList = new Map();

	static register(type, aData) {
		// type: [name, width, height, layerFlags, [ [portType, in, offset, side], ...]]
		// smelter: ['Smelter', 9, 6, [ ['belt', true, 0], ['belt', false, 0] ]]
		for (var i in aData[4]) {
			aData[4][i] = new PortType(...aData[4][i]);
		}
		const oBuilding = new Building(type, ...aData);
		this.mList.set(type, oBuilding);
	}

	static registerAll(oBuildingData) {
		new Map(Object.entries(oBuildingData)).forEach((aData, type) => {
			this.register(type, aData);
		});
	}

	static get(type) {
		if (!this.mList.has(type)) throw `Building ${type} not found!`;
		return this.mList.get(type);
	}

	static each(func) {
		this.mList.forEach(func);
	}

	//**********************************

	type = '';
	name = '';
	imgName = '';
	oSize = { width: 100, height: 100 };
	aPort = [];
	aLayer = [];
	oProduction; // object of Production

	constructor(type, name, w, h, layer, aPort) {
		this.type = type;
		this.name = name;
		this.imgName = type.replace(/([A-Z]+)/g, '_$1').toLowerCase();
		this.oSize = { width: w*10, height: h*10 };
		this.aPort = aPort;
		if (layer & 2) this.aLayer.push('elevated');
		if (layer & 1) this.aLayer.push('ground');
	}

	createProduction(oReceipe) {
		return this.oProduction = new Production(this, oReceipe);
	}

	imageUrl() {
		return `img/building/${this.imgName}.png`;
	}

	// *********** gojs helper

	static getTemplateMap() {
		const oMap = new go.Map();
		this.each((oBuilding, type) => {
			oMap.add(type, oBuilding.makeTemplate())
		});
		return oMap;
	}

	getNodeData(id) {
		return {
			id: id,
			type: this.type,
			name: this.name,
			detail: this.oProduction?.name ?? '',
			layer: this.aLayer[0],
			orient: 0,
			production: this.oProduction,
			ports: this.oProduction?.oReceipe.getItems() ?? [],
		};
	}

	makeOrient(angle) {
		return Math.round(angle / 90);
	}

	getAngle(orientation) {
		return orientation * 90;
	}

	makePos(oPos) {
		return [ oPos.x, oPos.y ];
	}

	getPos(aPos) {
		return new go.Point(...aPos);
	}

	makeContextMenu() {
		// https://github.com/NorthwoodsSoftware/GoJS/blob/master/samples/customContextMenu.html
		return $(go.HTMLInfo, {
			show: (oNode, oDiagram, oTool) => {
				console.log([obj, oDiagram, oTool])
			},
			hide: (oDiagram, oTool) => {
				console.log([oDiagram, oTool])
			},
		});

		/*return $("ContextMenu",
			$("ContextMenuButton",
				{
					"ButtonBorder.fill": "white",
					"_buttonFillOver": "skyblue",
					//click: oProduction.createInput.bind(oProduction)
				},
				$(go.TextBlock, "generiere Eingang")
			)
		);//*/
	}

	makeTemplate() {
		const sz = Math.min(this.oSize.width-10, this.oSize.height-10);
		var oPanel = $(go.Panel, "Auto",
			{
				width: this.oSize.width,
				height: this.oSize.height,
			},
			//new go.Binding("contextMenu", "production", this.makeContextMenu),
			$(go.Shape, "RoundedRectangle", {
				fill: "#fb04", stroke: "#430", strokeWidth: 2,
			}),
			$(go.Picture, this.imageUrl(),
				{
					row: 0,
					column: 0,
					height: sz,
					width: sz,
				},
				new go.Binding("source", "type", this.imageUrl),
				new go.Binding("angle", 'drawangle', (a) => { return -a; }),
			),

			$(go.Panel, "Table",
				$(go.TextBlock, this.name, {
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
				}, new go.Binding("text", "detail")),
			),
		);

		const oSide = {left:[], right:[], top:[], bottom:[]};

		var i = 0, o = 0;
		for (var oPort of this.aPort) {
			const port = oPort.inOut ? 'in'+(i++) : 'out'+(o++);
			oSide[oPort.side].push(oPort.makePort(port));
		}

		var oNode = $(go.Node, "Spot",
			{
				locationSpot: go.Spot.Center,
				dragComputation: (oNode, oPoint, oGridPoint) => this.avoidNodeOverlap(oNode, oPoint, oGridPoint, this.aLayer),
				rotatable: true,
				isShadowed: true,
				contextMenu: this.makeContextMenu(),
			},
			new go.Binding("location", "pos", this.getPos).makeTwoWay(this.makePos),
			new go.Binding("layerName", "layer"),
			new go.Binding("angle", "orient", this.getAngle.bind(this)).makeTwoWay(this.makeOrient.bind(this)),
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

	avoidNodeOverlap(oNode, oPoint, oGridPoint, aLayer) {
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
				return oLastPoint;
			}
		}
		oLastPoint.set(oGridPoint);
		return oGridPoint;
	}



	/*
	avoidNodeOverlap(oNode, oPoint, oGridPoint) {
		if (oNode.diagram instanceof go.Palette) return oGridPoint;

		function isUnoccupied(oRect) {

			function navig(obj) {
				var part = obj.part;
				if (part === oNode) return null;
				if (part instanceof go.Link) return null;
				if (part.isMemberOf(oNode)) return null;
				if (oNode.isMemberOf(part)) return null;
				return part;
			}

			// only consider non-temporary Layers
			var lit = oNode.diagram.layers;
			while (lit.next()) {
				var lay = lit.value;
				if (lay.isTemporary) continue;
				if (lay.findObjectsIn(oRect, navig, null, true).count > 0) return false;
			}
			return true;
		}

		const oBounds = oNode.actualBounds;
		const oLoc = oNode.location;

		const oRect = new go.Rect(
			oGridPoint.x - (oLoc.x - oBounds.x),
			oGridPoint.y - (oLoc.y - oBounds.y),
			oBounds.width,
			oBounds.height
		);
		oRect.inflate(-10, -10);

		if (
				!(oNode.diagram.currentTool instanceof go.DraggingTool) &&
				(!oNode._temp || !oNode.layer.isTemporary)
			) {
			oNode._temp = true;
			while (!isUnoccupied(oRect)) {
				oRect.x += 10;  // note that this is an unimaginative search algorithm --
				oRect.y += 10;  // you can improve the search here to be more appropriate for your app
			}
			oRect.inflate(-10, -10);  // restore to actual size
			return new go.Point(
				oRect.x - (oLoc.x - oBounds.x),
				oRect.y - (oLoc.y - oBounds.y)
			);
		}
		if (isUnoccupied(oRect)) return oGridPoint;
		return oLoc;
	}



	makePort(name, inOut, side) {
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
	} //*/
}
