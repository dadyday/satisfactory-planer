import go from 'gojs';
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

const s0 = 40, s1 = 24, s2 = 20, s3 = 22, s4 = 18;
const m0 = 0, m1 = (s0-s1)/2, m2 = 0, m3 = 0, m4 = 0;
const off = 10, es = 20, sl = 3, r = 20;

const swap = (keep, x, y) => keep ? [x, y] : [y, x];
const testGeometry = go.Geometry.parse("M0,0 h100 v100 h-100 v-100 l100,100 M0,100,100,0", false);
const building = (oNode) => Building.get(oNode.building);
const receipe = (oNode) => Receipe.get(oNode.receipe);
const imgSize = (oNode) => (building(oNode).oSize.width + building(oNode).oSize.height) /2;
//const imgSize = (oNode) => Math.min(building(oNode).oSize.width, building(oNode).oSize.height);
const vert = (oPort) => oPort.side == 'top' || oPort.side == 'bottom';
const margin = (oPort, m) => swap(vert(oPort), 0, m);


export default class Template {

	static shadowColor = '#0002';
	static shadowOffset = new go.Point(5, 5);
	static buildingColor = '#E4D2AA'; //"#fb04",
	static beltColor = '#A7A7AE'; //"#6666";
	static pipeColor = '#E8AF6C'; //#fa4a";

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
		/*
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

		return $(go.Node, "Spot",
			{
				locationSpot: go.Spot.Center,
				// dragComputation: (oNode, oPoint, oGridPoint) => this.avoidNodeOverlap(oNode, oPoint, oGridPoint, oBuilding.aLayer),
				rotatable: true,
				isShadowed: true,
				shadowColor: this.shadowColor,
				shadowOffset: this.shadowOffset,
				//angle: (oNode, oGraph) => oNode.ori = this.drawingAngle = oGraph.angle,
				//shadowBlur

				contextMenu: (oNode, oPart) => this.htmlPanel(ProdCard, { node: oNode, part: oPart }, {}),
			},
			new go.Binding("location", "pos", aPos => new go.Point(...aPos)).makeTwoWay(oPos => [oPos.x, oPos.y]),
			new go.Binding("angle", "", (oNode) => this.drawingAngle = oNode.ori ?? 0).makeTwoWay((value, oNode, oModel) => oModel.setDataProperty(oNode, "ori", value)),

			$(go.Panel, "Auto",
				{
					width: (oNode) => building(oNode).oSize.width - off,
					height: (oNode) => building(oNode).oSize.height - off,
				},
				$(go.Shape, "RoundedRectangle", {
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
						font: "9pt sans-serif",
						text: (oNode) => receipe(oNode).getName(),
					}),
				),
				this.portSide('top'),
				this.portSide('left'),
				this.portSide('bottom'),
				this.portSide('right'),
			)
		);
	}

	static portSide(side) {
		const horz = side == 'top' || side == 'bottom';

		const marginX = (oNode) => (oNode.oSize.width % 40) / 2;
		const marginY = (oNode) => (oNode.oSize.height % 40) / 2;
		const oMargin = (oNode) => new go.Margin(marginX(oNode), marginY(oNode)); //marginX(oNode), marginY(oNode));

		const spotSide = side.charAt(0).toUpperCase() + side.slice(1);
		const oSpotParam = {
			left:   [0, 0.5, 4, 0],
			right:  [1, 0.5, -4, 0],
			top:    [0.5, 0, 0, 4],
			bottom: [0.5, 1, 0, -4],
		};

		const oPortTmpl = this.port();
		const oTmplMap = new go.Map();
		//oTmplMap.add('', this.dummyPort());
		oTmplMap.add('belt', oPortTmpl);
		oTmplMap.add('pipe', oPortTmpl);

		return $(go.Panel, horz ? 'Horizontal' : 'Vertical',
			{
				alignment: go.Spot[spotSide],
				alignmentFocus: new go.Spot(...oSpotParam[side]),
				itemArray: (oNode) => oNode.ports[side], //building(oNode).oSide[side], //
				itemCategoryProperty: 'type',
				itemTemplateMap: oTmplMap,
				//margin: (oNode) => oMargin(oNode),
			},
		);
	}

	/*static dummyPort() {

		return $(go.Panel, 'Spot', {
			desiredSize: new go.Size(s1, s1),
			margin: (oPort) => new go.Margin(...margin(oPort, (s0-s1)/2)),
			},
			// $(go.Shape, {
			// 	geometry: testGeometry,
			// 	stroke: 'green',
			// 	strokeWidth: 2,
			// }),
		);
	}*/

	static port() {
		// side
		const x = (oPort) => oPort.side == 'left' ? 0 : (oPort.side == 'right' ? 1 : 0.5);
		const y = (oPort) => oPort.side == 'top' ? 0 : (oPort.side == 'bottom' ? 1 : 0.5);
		const oSpot = (oPort) => new go.Spot(x(oPort), y(oPort));
		// ioOut
		const inOutColor = (oPort) => oPort.inOut ? "#fc0" : "#0c0";
		const oGeometry = (oPort) => oPort.inOut ?
			go.Geometry.parse("M35,0 v10 m0,80 v10 M50,0 v10 m0,80 v10 M65,0 v10 m0,80 v10 M100,100", false) :
			go.Geometry.parse("M30,10 l10,-10 h20 l10,10 M30,90 l10,10 h20 l10,-10 M100,100", false);
		// type
		const shape = (oPort) => oPort.type == 'belt' ? 'RoundedRectangle' : 'Ellipse';
		const shapeColor = (oPort) => oPort.type == 'belt' ? this.beltColor : this.pipeColor;


		return $(go.Panel, 'Spot', {
				portId: (oPort) => oPort.id,
				cursor: "pointer",

				fromSpot: oSpot,
				fromLinkable: (oPort) => !oPort.inOut,
				fromMaxLinks: 1,

				toSpot: oSpot,
				toLinkable: (oPort) => oPort.inOut,
				toMaxLinks: 1,

				desiredSize: new go.Size(s1, s1),
				margin: (oPort) => {
					var m = [...margin(oPort, m1), ...margin(oPort, m1)];
					if (oPort.offset > 0) m[0] += oPort.offset*40;
					if (oPort.offset < 0) m[2] -= oPort.offset*40;
					return new go.Margin(...m);
				},

				//click: (...aArg) => oPort.portClicked(...aArg),
				//contextMenu: this.htmlPanel(Foo, { foo: 'bar' }),
				contextMenu: (oPort) => this.htmlPanel(Foo, { foo: oPort }, {}),
			},
			$(go.Shape, {
				figure: shape,
				parameter1: 2,
				fill: shapeColor,
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
			}),
			$(go.Picture, {
				height: s4,
				width: s4,
				source: (oPort) => (Item.get(oPort.item)?.imageUrl() ?? null),
				angle: () => -this.drawingAngle,
			}),
		);
	}

	static link()  {
		const byType = (link, belt, pipe, def) => {
			switch (link.fromPortId[1]) {
				case 'b': return belt;
				case 'p': return pipe;
			}
			return def;
		};

		return $(go.Link,
			{
				//routing: go.Link.AvoidsNodes, // go.Link.Orthogonal,
				routing: go.Link.Orthogonal,
				//curve: go.Link.JumpOver,
				corner: r,
				//curve: go.Link.JumpOver,
				//fromEndSegmentLength: 28,
				//toEndSegmentLength: 28,
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

				strokeWidth: (link) => byType(link, 16, 14),
				stroke: "#888",
			}),
			$(go.Shape, {
				name: (link) => byType(link, 'BELT', 'PIPE', ''),
				isPanelMain: true,
				stroke: (link) => byType(link, this.beltColor, this.pipeColor),
				strokeWidth: (link) => byType(link, 14, 12),
				strokeDashArray: (link) => byType(link, [8,1], [15,2], [1,1]),
			}),
			$(go.Shape, { toArrow: "Triangle" }),
			$(go.Shape, { fromArrow: "Triangle" })
		);
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
