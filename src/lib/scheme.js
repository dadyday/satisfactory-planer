import Receipe from './receipe';
//import { dump } from 'dumper.js';

export default class Scheme {
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
			const oProd = oReceipe.createProd();
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
}

