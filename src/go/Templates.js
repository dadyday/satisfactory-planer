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
const off = 10, es = 16, sl = -1, r = 20;

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
						font: "7pt sans-serif",
						text: (oNode) => receipe(oNode).getName(),
					}),
				),
				this.portSide('top'),
				this.portSide('left'),
				this.portSide('bottom'),
				this.portSide('right'),
			//	this.portSide('middle'),
			)
		);
	}

	static portSide(side) {
		/*
		const oPortTmpl = this.port();
		const oTmplMap = new go.Map();
		//oTmplMap.add('', this.dummyPort());
		oTmplMap.add('belt', oPortTmpl);
		oTmplMap.add('pipe', oPortTmpl);
		//oTmplMap.add('middle', this.middelPort());
		*/

		const oDef = {
			itemArray: (oNode) => oNode.ports[side], //building(oNode).oSide[side], //
			itemTemplate: this.port(),
			//itemCategoryProperty: 'type',
			//itemTemplateMap: oTmplMap,
		};

		switch (side) {
			case 'left':
				return $(go.Panel, 'Vertical', { alignment: go.Spot.Left, alignmentFocus: new go.Spot(0, 0.5, 4, 0), ...oDef});
			case 'right':
				return $(go.Panel, 'Vertical', { alignment: go.Spot.Right, alignmentFocus: new go.Spot(1, 0.5, -4, 0), ...oDef});
			case 'top':
				return $(go.Panel, 'Horizontal', { alignment: go.Spot.Top, alignmentFocus: new go.Spot(0.5, 0, 0, 4), ...oDef});
			case 'bottom':
				return $(go.Panel, 'Horizontal', { alignment: go.Spot.Bottom, alignmentFocus: new go.Spot(0.5, 1, 0, -4), ...oDef});
		//	case 'middle':
		//		return $(go.Panel, "Auto", { alignment: go.Spot.Center, alignmentFocus: new go.Spot(0.5, 0.5, 0, 0), ...oDef});
				/*
					$(go.Shape, {
						geometry: testGeometry,
						stroke: 'red',
						strokeWidth: 2,
						strokeJoin: "round",
						strokeCap: "round",
						desiredSize: new go.Size(s3, s3),
					}),
					$(go.Panel, 'Spot',
						{
							portId: 'ib0',
							toSpot: go.Spot.Right,
							toLinkable: true,
							fromLinkable: false,
							toMaxLinks: 1,
							desiredSize: new go.Size(s3, s3),
						},
					),
					$(go.Panel, 'Spot',
						{
							portId: 'ob0',
							fromSpot: go.Spot.NotRightSide,
							fromLinkable: true,
							toLinkable: false,
							fromMaxLinks: 3,
							desiredSize: new go.Size(s3, s3),
						},
					),
				);
				*/
		}
	}

	static port() {
		// side
		const x = (oPort) => oPort.side == 'left' ? 0 : (oPort.side == 'right' ? 1 : 0.5);
		const y = (oPort) => oPort.side == 'top' ? 0 : (oPort.side == 'bottom' ? 1 : 0.5);
		const oSpot = (oPort) => new go.Spot(x(oPort), y(oPort));
		// ioOut
		const inOutColor = (oPort) => oPort.inOut ? this.inColor : this.outColor;
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
				routing: go.Link.AvoidsNodes,
				adjusting: go.Link.End,
				//routing: go.Link.Orthogonal,
				//curve: go.Link.JumpOver,
				corner: r,
				//curve: go.Link.JumpOver,
				//fromEndSegmentLength: 28,
				//toEndSegmentLength: 28,
				fromSpot: (oLink, oPart) => $dump(oLink, oPart.fromSpot) || oPart.fromSpot, //go.Spot.Left,
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
