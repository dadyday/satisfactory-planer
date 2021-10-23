import go from 'gojs';
import  { Item } from "../entity";

import vueHelper from '../helper';
import Foo from "../components/Ctrls/Foo.vue";

var $$ = go.GraphObject.make;
var $ = (type, ...args) => {
	for (var props of args) {
		if (!isObject(props)) continue;
		for (var prop in props) {
			if (isFunction(props[prop])) {
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
var swap = (horz, x, y) => horz ? [x, y] : [y, x];


export default class Template {

	static beltColor = '#A7A7AE'; //"#6666";
	static pipeColor = '#E8AF6C'; //#fa4a";

	static grid() {
		return $(go.Panel, "Grid",
			$(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
			$(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 8 }),
			$(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
			$(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 8 })
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
				routing: go.Link.AvoidsNodes, // go.Link.Orthogonal,
				corner: 20,
				//curve: go.Link.JumpOver,
				fromEndSegmentLength: 10,
				toEndSegmentLength: 10,
				//fromShortLength: -10,
				//toShortLength: -10,
				isShadowed: true,
				shadowColor: '#0002',
				shadowOffset: new go.Point(5, 5),
			},
			$(go.Shape, {
				isPanelMain: true,
				stroke: (link) => byType(link, this.beltColor, this.pipeColor),
				strokeWidth: (link) => byType(link, 16, 12),
			}),
			$(go.Shape, {
				name: (link) => byType(link, 'BELT', 'PIPE', ''),
				isPanelMain: true,
				stroke: "#8884",
				strokeWidth: (link) => byType(link, 16, 12),
				strokeDashArray: (link) => byType(link, [1,8], [2,15], [1,1]),
			}),
			$(go.Shape, { toArrow: "Triangle" }),
			$(go.Shape, { fromArrow: "Triangle" })
		);
	}

	static portSides(aPort) {
		const oSide = {left:[], right:[], top:[], bottom:[]};

		//var i = 0, o = 0;
		var p = 0;
		for (var oPort of aPort) {
			//const id = oPort.inOut ? 'in'+(i++) : 'out'+(o++);
			const id = (oPort.inOut ? 'i':'o') + (oPort.type == 'belt' ? 'b':'p') + (p++);

			for (var f1 = 0; f1 < oPort.offset; f1++) {
				oSide[oPort.side].push(this.portDummy(oPort));
			}

			oSide[oPort.side].push(this.port(id, oPort));

			for (var f2 = 0; f2 > oPort.offset; f2--) {
				oSide[oPort.side].push(this.portDummy(oPort));
			}
		}
		return oSide;
	}

	static portDummy(oPort) {
		const horz = oPort.side == 'top' || oPort.side == 'bottom';
		return $(go.Panel, "Auto", {
				margin: new go.Margin(...swap(horz, 0, 10)),
			},
			$(go.Shape, "RoundedRectangle", {
				fill: "#0000",
				strokeWidth: 0,
				desiredSize: new go.Size(...swap(horz, 20, 0)),
			}),
		);
	}

	static port(id, oPort) {
		const horz = oPort.side == 'top' || oPort.side == 'bottom';
		const side = oPort.side.charAt(0).toUpperCase() + oPort.side.substring(1);
		const oSpot = go.Spot[side];
		const byType = (oPort, belt, pipe, def) => {
			switch (oPort.type) {
				case 'belt': return belt;
				case 'pipe': return pipe;
			}
			return def;
		};
		const byInOut = (oPort, inp, out) => {
			return oPort.inOut ? inp : out;
		};
		const testGeometry = go.Geometry.parse("M0,0 h100 v100 h-100 v-100 l100,100 M0,100,100,0", false);
		const inGeometry = go.Geometry.parse("M35,0 v10 m0,80 v10 M50,0 v10 m0,80 v10 M65,0 v10 m0,80 v10 M100,100", false);
		const outGeometry = go.Geometry.parse("M30,10 l10,-10 h20 l10,10 M30,90 l10,10 h20 l10,-10 M100,100", false);
		var s0 = 40, s1 = 24, s2 = 20, s3 = 22, s4 = 18;

		var oPanel = $(go.Panel, 'Spot', {
				portId: id,
				cursor: "pointer",

				fromSpot: oSpot,
				fromLinkable: !oPort.inOut,
				fromMaxLinks: 1,

				toSpot: oSpot,
				toLinkable: oPort.inOut,
				toMaxLinks: 1,

				desiredSize: new go.Size(s1, s1),
				margin: new go.Margin(...swap(horz, 0, (s0-s1)/2)),

				//click: (...aArg) => oPort.portClicked(...aArg),
				//contextMenu: this.htmlPanel(Foo, { foo: 'bar' }),
				contextMenu: () => this.htmlPanel(Foo, { foo: 'bar' }, {}),
			},
			$(go.Shape, byType(oPort, "RoundedRectangle", "Ellipse"), {
				parameter1: 2,
				fill: byType(oPort, this.beltColor, this.pipeColor),
				strokeWidth: 2,
				desiredSize: new go.Size(s2, s2),
			}),
			$(go.Shape, {
				geometry: byInOut(oPort, inGeometry, outGeometry),
				stroke: byInOut(oPort, "#fc0", "#0c0"),
				strokeWidth: 2,
				strokeJoin: "round",
				strokeCap: "round",
				desiredSize: new go.Size(s3, s3),
			}),
			$(go.Picture, {
				height: s4,
				width: s4,
				source: (o) => Item.get(byType(oPort, 'ironOre', 'water')).imageUrl(),
				//source: (o) => Item.get(o.ports[id] ?? null)?.imageUrl() ?? null, // console.log(o, id) ||
				angle: (o) => -(o?.drawangle ?? 0),
			}),
		);
		return oPanel;
	}

	static htmlPanel(Component, oProp, oEvent) {
		let oComp;
		return $$(go.HTMLInfo, {
			show: (oNode, oDiagram, oContextMenuTool) => {
				const oPos = oDiagram.lastInput.viewPoint;
				oComp = vueHelper.createComponent(oDiagram.div, Component, oProp, oEvent);
				oComp.$el.style.position = 'absolute';
				oComp.$el.style.left = oPos.x+'px';
				oComp.$el.style.top = oPos.y+'px';
				oComp.$el.style.zIndex = 1000;
			},
			hide: () => {
				vueHelper.destroyComponent(oComp);
			}
		});
	}
};
