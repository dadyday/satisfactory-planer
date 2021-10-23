import go from 'gojs';
var $ = go.GraphObject.make;

import vueHelper from '../helper';
import  { Production, Receipe, Item } from "../entity";
import CtxMenu from "../components/PortMenu.vue";

export default class Port {

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
