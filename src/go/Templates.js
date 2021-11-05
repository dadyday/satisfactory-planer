import go from 'gojs';
import  { MyNode, MyPort, MyLink } from "./Override";
import  { Item, Receipe, Building } from "../entity";

import vueHelper from '../helper';
import Foo from "../components/Ctrls/Foo.vue";
import ProdCard from "../components/ProdCard.vue";
import merge from 'deepmerge';

const $$ = go.GraphObject.make;
const $ = (type, ...args) => {
	for (var props of args) {
		if (!window.isObject(props)) continue;
		for (var prop in props) {
			if (window.isFunction(props[prop])) {
				args.push(
					new go.Binding(prop, '', props[prop]) //.ofObject()
				)
				delete props[prop];
			}
		}
		break;
	}
	return $$(type, ...args);
};
/* Two Way Binding
const conv = (oNode, oGraphObj) => {
	console.log('conv', oNode, oGraphObj);
	return oNode.prop; // to oGraphObj.prop
};
const backConv = (value, oNode, oModel) => {
	console.log('backConv', value, oNode, oModel);
	oModel.setDataProperty(oNode, "prop", value);
};
new go.Binding("prop", "", conv).makeTwoWay(backConv),
*/

const s0 = 40, s1 = 24, s2 = 20, s3 = 22, s4 = 18;
const m0 = 0, m1 = (s0-s1)/2, m2 = 0, m3 = 0, m4 = 0;
const off = 5, es = 16, sl = -1, r = 20;

const swap = (keep, x, y) => keep ? [x, y] : [y, x];
const building = (oNode) => Building.get(oNode.building);
const receipe = (oNode) => Receipe.get(oNode.receipe);
const imgSize = (oNode) => (building(oNode).oSize.width + building(oNode).oSize.height) /2;
//const imgSize = (oNode) => Math.min(building(oNode).oSize.width, building(oNode).oSize.height);

const vert = (side, yes = true, no = false) => side == 'top' || side == 'bottom' ? yes : no;
const margin = (oPort, m) => swap(vert(oPort.side), 0, m);

const spot = (side, from = 0, to = 1, off = 0) => {
	const mid = (to-from) /2;
	switch (side) {
		case 'left': return new go.Spot(from, mid, off, 0);
		case 'right': return new go.Spot(to, mid, -off, 0);
		case 'top': return new go.Spot(mid, from, 0, off);
		case 'bottom': return new go.Spot(mid, to, 0, -off);
	}
	return null; //new go.Spot(mid, mid);
}
const unSpot = (oSpot) => {
	const str = go.Spot.stringify(oSpot);
	switch (str) {
		case '0 0.5 0 0': return 'Left';
		case '1 0.5 0 0': return 'Right';
		case '0.5 0 0 0': return 'Top';
		case '0.5 1 0 0': return 'Bottom';
		default:
			if (str.match(/^[A-Z]/)) break;
			$dump('unknown spot', str);
	}
	return str;
}
const unPoint = (oPoint) => {
	if (!oPoint) return oPoint;
	var str = go.Point.stringify(oPoint);
	return str;
}


const testGeometry = go.Geometry.parse("M0,0 h100 v100 h-100 v-100 l100,100 M0,100,100,0", false);
const testShape = (oProps) =>	$$(go.Shape, {	geometry: testGeometry, geometryStretch: go.GraphObject.Fill,  stroke: 'red', strokeWidth: 2, ...oProps });

const itemBrush = (item, size) => {
	const oCanvas = document.createElement('canvas');
	oCanvas.width = size; oCanvas.height = size;
	const oCtx = oCanvas.getContext('2d');

	const oImg = new Image();
	oImg.src = Item.get(item)?.imageUrl();
	oImg.onload = function () {
		oCtx.drawImage(oImg, 0, 0, size, size);
	}

	const oBrush = $(go.Brush, "Pattern", { pattern: oCanvas });
	//oBrush.darken('#444', 0.9);
	return oBrush;
};


export default class Template {

	static shadowColor = '#0002';
	static shadowOffset = new go.Point(5, 5);
	static buildingColor = '#E4D2AA'; //"#fb04",
	static beltColor = '#A7A7AE'; //"#6666";
	static pipeColor = '#E8AF6C'; //#fa4a";
	static inColor = "#fc0"; //#fa4a";
	static outColor = "#0c0"; //#fa4a";

	static drawingAngle;

	static grid() {
		return $(go.Panel, "Grid",
			$(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
			$(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 8 }),
			$(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
			$(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 8 })
		);
	}

	static node() {

		return $(MyNode, "Spot",
			{
				portSpreading: go.Node.SpreadingNone, //go.Node.SpreadingPacked,
				locationSpot: go.Spot.Center,
				// dragComputation: (oNode, oPoint, oGridPoint) => this.avoidNodeOverlap(oNode, oPoint, oGridPoint, oBuilding.aLayer),
				rotatable: true,
				isShadowed: true,
				shadowColor: this.shadowColor,
				shadowOffset: this.shadowOffset,

				contextMenu: (oNode, oPart) => this.htmlPanel(ProdCard, { node: oNode, part: oPart }, {}),
			},
			new go.Binding("location", "pos", aPos => new go.Point(...aPos)).makeTwoWay(oPos => [oPos.x, oPos.y]),
			new go.Binding("angle", "", (oNode) => this.drawingAngle = oNode.ori ?? 0).makeTwoWay((value, oNode, oModel) => oModel.setDataProperty(oNode, "ori", value)),

			this.nodeLayout(),

			this.portSide('top'),
			this.portSide('left'),
			this.portSide('bottom'),
			this.portSide('right'),

			$(go.Panel, 'Spot', {
				itemArray: (oNode) => oNode.ports['middle'],
				itemTemplate: $(MyPort, 'Spot',
					{ // this.port(),/*
						portId: (oPort) => oPort.id,

						fromSpot: (oPort) => oPort.split ? go.Spot.NotRightSide : go.Spot.Left,
						//fromSpot: (oPort) => spot(oPort.side), //go.Spot.Center,
						fromLinkable: (oPort) => true,
						fromMaxLinks: (oPort) => oPort.split ? 3 : 1,

						toSpot: (oPort) => oPort.merge ? go.Spot.NotLeftSide : go.Spot.Right,
						//toSpot: (oPort) => spot(oPort.side),
						toLinkable: (oPort) => true,
						toMaxLinks: (oPort) => oPort.merge ? 3 : 1,

						desiredSize: new go.Size(s1, s1),
					},
					this.portLayoutMiddle(),
				),
			}),
		);
	}

	static nodeLayout() {
		return $(go.Panel, "Auto",
			{
				width: (oNode) => building(oNode).oSize.width - off,
				height: (oNode) => building(oNode).oSize.height - off,
			},
			$(go.Shape, "RoundedRectangle", {
				parameter1: 5,
				fill: this.buildingColor,
				strokeWidth: 2,
			}),
			$(go.Picture, '', {
				height: imgSize,
				width: imgSize,
				source: (oNode) => building(oNode).imageUrl(),
				angle: () => -this.drawingAngle,
			}),
			$(go.Panel, "Table",
				{
					angle: () => -this.drawingAngle,
				},
				$(go.TextBlock, '', {
					row: 0,
					column: 1,
					stroke: "white",
					font: "bold 10pt sans-serif",
					text: (oNode) => building(oNode).getName(),
				}),
				$(go.TextBlock, '', {
					row: 1,
					column: 1,
					stroke: "white",
					font: "7pt sans-serif",
					text: (oNode) => receipe(oNode).getName(),
				}),
			),
		);
	}

	static portSide(side) {
		return $(go.Panel, vert(side, 'Horizontal', 'Vertical'), {
			alignment: go.Spot[side.toUpperCaseFirst()],
			alignmentFocus: spot(side, 0, 1, 5),
			//alignmentFocusName: 'port',
			itemArray: (oNode) => oNode.ports[side],
			itemTemplate: this.port(),
		});
	}

	static port() {

		return $(go.Panel, 'Spot',
			{
				portId: (oPort) => oPort.id,
				cursor: "pointer",
				//name: 'port',
				//alignment: (oPort) => spot(oPort.side, 1, 0, 0),

				fromSpot: (oPort) => spot(oPort.side),
				fromLinkable: (oPort) => !oPort.inOut,
				fromMaxLinks: 1,

				toSpot: (oPort) => spot(oPort.side),
				toLinkable: (oPort) => oPort.inOut,
				toMaxLinks: 1,

				desiredSize: new go.Size(s1, s1),
				margin: (oPort) => { // calc port offset into margin
					var m = [...margin(oPort, m1), ...margin(oPort, m1)];
					if (oPort.offset > 0) m[0] += oPort.offset*40;
					if (oPort.offset < 0) m[2] -= oPort.offset*40;
					return new go.Margin(...m);
				},

				//click: (...aArg) => oPort.portClicked(...aArg),
				//contextMenu: this.htmlPanel(Foo, { foo: 'bar' }),
				contextMenu: (oPort) => this.htmlPanel(Foo, { foo: oPort }, {}),
			},
			this.portLayout(),
		);
	}

	static portLayout() {
		const shape = (oPort) => oPort.type == 'belt' ? 'RoundedRectangle' : 'Ellipse';
		const shapeColor = (oPort) => oPort.type == 'belt' ? this.beltColor : this.pipeColor;
		const oGeometry = (oPort) => oPort.inOut ?
			go.Geometry.parse("M35,0 v10 m0,80 v10 M50,0 v10 m0,80 v10 M65,0 v10 m0,80 v10 M100,100", false) :
			go.Geometry.parse("M30,10 l10,-10 h20 l10,10 M30,90 l10,10 h20 l10,-10 M100,100", false);
		const inOutColor = (oPort) => oPort.inOut ? this.inColor : this.outColor;

		return $(go.Panel, 'Spot',
			{
			},
			$(go.Shape, {
				figure: shape,
				parameter1: 2,
				fill: shapeColor,
				//fill: (oPort) => patternBrush(oPort.item, s2),
				strokeWidth: 2,
				desiredSize: new go.Size(s2, s2),
			}),
			$(go.Shape, {
				geometry: oGeometry,
				stroke: inOutColor,
				strokeWidth: 2,
				strokeJoin: "round",
				strokeCap: "round",
				desiredSize: new go.Size(s3, s3),
				angle: (oPort) => vert(oPort.side, 90, 0),
			}),
			$(go.Picture, {
				height: s4,
				width: s4,
				source: (oPort) => (Item.get(oPort.item)?.imageUrl() ?? null),
				angle: () => -this.drawingAngle,
			}),
		);
	}

	static portLayoutMiddle() {
		const shape = (oPort) => oPort.type == 'belt' ? 'RoundedRectangle' : 'Ellipse';
		const shapeColor = (oPort) => oPort.type == 'belt' ? this.beltColor : this.pipeColor;

		return $(go.Panel, 'Spot',
			{
			},
			$(go.Shape, {
				figure: shape,
				parameter1: 2,
				fill: shapeColor,
				//fill: (oPort) => patternBrush(oPort.item, s2),
				strokeWidth: 2,
				desiredSize: new go.Size(s2, s2),
			}),
			this.portSign('left'),
			this.portSign('right'),
			this.portSign('top'),
			this.portSign('bottom'),
			$(go.Picture, {
				height: s4,
				width: s4,
				source: (oPort) => (Item.get(oPort.item)?.imageUrl() ?? null),
				angle: () => -this.drawingAngle,
			}),
		);
	}

	static portSign(side) {
		const inOut = (oPort) => {
			if (side == 'left') return true;
			if (side == 'right') return false;
			return oPort.merge;
		};
		const oGeometry = (oPort) => inOut(oPort) ?
				go.Geometry.parse("M35,0 v10 M50,0 v10 M65,0 v10 M100,100", false) :
				go.Geometry.parse("M30,10 l10,-10 h20 l10,10 M100,100", false);
		const inOutColor = (oPort) => inOut(oPort) ? this.inColor : this.outColor;
		const angle = (oPort) => {
			switch (side) {
				case 'left': return 90;
				case 'right': return -90;
				case 'top': return 0;
				case 'bottom': return 180;
			}
		};

		return $(go.Shape, {
			geometry: oGeometry,
			stroke: inOutColor,
			strokeWidth: 2,
			strokeJoin: "round",
			strokeCap: "round",
			desiredSize: new go.Size(s3, s3),
			angle: angle,
		});
	}

	static link()  {
		const byType = (link, belt, pipe, def) => {
			switch (link.fromPortId[1]) {
				case 'b': return belt;
				case 'p': return pipe;
			}
			return def;
		};

		const oLink = $(MyLink,
			{
				routing: go.Link.AvoidsNodes, // go.Link.Orthogonal,
				adjusting: go.Link.End,
				corner: r,
				//curve: go.Link.JumpOver,

				fromEndSegmentLength: es,
				toEndSegmentLength: es,
				fromShortLength: sl,
				toShortLength: sl,

				isShadowed: true,
				shadowColor: '#0002',
				shadowOffset: new go.Point(5, 5),
			},
			$(go.Shape, {
				isPanelMain: true,
				strokeWidth: (link) => byType(link, 16, 14, 16),
				stroke: "#888",
			}),
			$(go.Shape, {
				name: (link) => byType(link, 'BELT', 'PIPE', ''),
				isPanelMain: true,
				stroke: (link) => byType(link, this.beltColor, this.pipeColor, this.beltColor),
				strokeWidth: (link) => byType(link, 14, 12, 14),
				strokeDashArray: (link) => byType(link, [8,1], [15,2], [8,1]),
			}),
			$(go.Shape, { toArrow: "RoundedTriangle", fill: this.inColor, }),
			$(go.Shape, { fromArrow: "RoundedTriangle", fill: this.outColor, })
		);
		return oLink;
	}

	static linkHandle(fromTo) {
		return $(go.Shape, "RoundedRectangle", {
			desiredSize: new go.Size(5,5),
			fill: fromTo ? this.outColor : this.inColor,
			segmentIndex: fromTo ? 0 : -1,
		});
	}

	static htmlPanel(Component, oProp, oEvent) {
		let oComp;
		const show = (oNode, oDiagram, oContextMenuTool) => {
			const oPos = oDiagram.lastInput.viewPoint;
			oComp = vueHelper.createComponent(oDiagram.div, Component, oProp, oEvent);
			oComp.$el.style.position = 'absolute';
			oComp.$el.style.left = oPos.x+'px';
			oComp.$el.style.top = oPos.y+'px';
			oComp.$el.style.zIndex = 1000;
			return true;
		};
		const hide = () => {
			vueHelper.destroyComponent(oComp);
		};

		return $$(go.HTMLInfo, { show, hide });
		//return $$("ContextMenu", $$("ContextMenuButton", $$(go.TextBlock, "Test", { click: () => alert(1) })));
	}
}
