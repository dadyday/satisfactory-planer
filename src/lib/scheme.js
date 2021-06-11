import Receipe from './Receipe';

export default class Scheme {

	static create(aItem) {
		const oScheme = new Scheme;
		Object.entries(aItem).forEach(([item, count]) => {
			oScheme.addNeeded(item, count);
		});
		oScheme.calcProduction();
		return oScheme;
	}

	//*************************
	
	aQuantity = {};
	aProduction = {};

	addNeeded(item, count) {
		const oQuant = this.getQuantity(item);
		oQuant.need += count;
	}

	getQuantity(item) {
		if (!this.aQuantity[item]) this.aQuantity[item] = {need:0, in:0, out:0};
		return this.aQuantity[item];
	}

	calcProduction() {
		for (const item in this.aQuantity) {
			const oQuant = this.aQuantity[item];
			if (oQuant.need) this.addProductionFor(item, oQuant.need);
		}
	}

	addProductionFor(item, count) {
		for (const name in this.aProduction) {
			for (const oProd of this.aProduction[name]) {
				if (oProd.productivity >= 1.0) continue;
				if (!oProd.oReceipe.aOutput[item]) continue;
				count = this.addProdCapacity(oProd, item, count);
			}
		}

		const oReceipe = Receipe.getByOutput(item);
		while (count > 0.0001) {
			const oProd = oReceipe.createProduction();
			oProd.productivity = 0.0;
			count = this.addProdCapacity(oProd, item, count);
			if (!this.aProduction[oReceipe.name]) this.aProduction[oReceipe.name] = [];
			this.aProduction[oReceipe.name].push(oProd);
		}
	}

	addProdCapacity(oProd, item, count) {
		const self = this;
		const cap = 1.0 - oProd.productivity;
		const eff = Math.min(1.0 * count / oProd.oReceipe.aOutput[item], cap);
		
		count -= eff * oProd.oReceipe.aOutput[item];
		oProd.productivity += eff;
		
		Object.entries(oProd.oReceipe.aOutput).forEach(([itm, cnt]) => {
			const oQuant = this.getQuantity(itm);
			oQuant.out += cnt * eff;
		});
		Object.entries(oProd.oReceipe.aInput).forEach(([itm, cnt]) => {
			const oQuant = this.getQuantity(itm);
			oQuant.in += cnt * eff;
			self.addProductionFor(itm, cnt * eff);
		});

		return count;
	}

	// ***************** drawing

	getModel() {
		const oModel = {
			class: "GraphLinksModel",
			nodeCategoryProperty: "type",
			linkFromPortIdProperty: "fromPortId",
			linkToPortIdProperty: "toPortId",
			nodeDataArray: [],
			linkDataArray: [],
		};
		oModel.nodeDataArray = [
			{text: 'Test', type: 'split', layer: 'ground'},
			//{ key: "ironore#0", type: "miner" },
			//{ key: "splitter#0", type: "splitter" },
			//{ key: "ironingot#0", type: "smelter" },
			//{ key: "ironingot#1", type: "smelter" },
			//{ key: "steelbeam#0", type: "foundry" },
		];
		oModel.linkDataArray = [
			//{ from: 'ironore#0', fromPortId: 'out', to: 'splitter#0', toPortId: 'in', },
			//{ from: 'splitter#0', fromPortId: 'out_left', to: 'ironingot#0', toPortId: 'in', },
			//{ from: 'splitter#0', fromPortId: 'out_mid', to: 'ironingot#1', toPortId: 'in', },
		];
		return oModel;
	}
}