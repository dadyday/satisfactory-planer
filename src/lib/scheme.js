import Receipe from './Receipe';

export default class Scheme {

	static create(aNeed) {
		return new Scheme(aNeed);
	}

	//*************************
	
	aQuantity = {};
	aProduction = {};
	aSink = [];
	aLink = [];

	constructor(aNeed = {}) {
		this.aQuantity = {};
		this.aProduction = {};
		for (var item in aNeed) {
			this.addNeeded(item, aNeed[item]);
		}
		this.calcProduction();
	}

	addNeeded(item, count) {
		this.initQuantity(item);
		this.aQuantity[item].need += count;
	}

	initQuantity(item) {
		if (!this.aQuantity[item]) this.aQuantity[item] = {need:0, in:0, out:0};
	}

	calcProduction() {
		for (const item in this.aQuantity) {
			const oQuant = this.aQuantity[item];
			if (oQuant.need) {
				const oTarget = this.addSinkFor(item, oQuant.need);
				this.addProductionFor(item, oQuant.need, oTarget);
			}
		}
	}

	addSinkFor(item, count) {
		const oReceipe = new Receipe('', [], {item: count}, 'sink');
		const oSink = oReceipe.createProduction();
		this.aSink.push(oSink);
		return oSink;
	}

	addProductionFor(item, count, oTarget) {
		for (const name in this.aProduction) {
			for (const oProd of this.aProduction[name]) {
				if (oProd.productivity >= 1.0) continue;
				if (!oProd.oReceipe.aOutput[item]) continue;
				count = this.addProdCapacity(oProd, item, count, oTarget);
			}
		}

		const oReceipe = Receipe.getByOutput(item);
		while (count > 0.0001) {
			const oProd = oReceipe.createProduction();
			oProd.productivity = 0.0;
			count = this.addProdCapacity(oProd, item, count, oTarget);
			if (!this.aProduction[oReceipe.name]) this.aProduction[oReceipe.name] = [];
			this.aProduction[oReceipe.name].push(oProd);
		}
	}

	addProdCapacity(oProd, item, count, oTarget) {
		const self = this;
		const cap = 1.0 - oProd.productivity;
		const eff = Math.min(1.0 * count / oProd.oReceipe.aOutput[item], cap);
		
		count -= eff * oProd.oReceipe.aOutput[item];
		oProd.productivity += eff;
		this.aLink.push([oProd, oTarget]);
		
		Object.entries(oProd.oReceipe.aOutput).forEach(([itm, cnt]) => {
			this.initQuantity(itm);
			this.aQuantity[itm].out += cnt * eff;
		});
		Object.entries(oProd.oReceipe.aInput).forEach(([itm, cnt]) => {
			this.initQuantity(itm);
			this.aQuantity[itm].in += cnt * eff;
			self.addProductionFor(itm, cnt * eff, oProd);
		});

		return count;
	}

	// ***************** drawing

	getModel() {
		const oModel = {
			nodeDataArray: [],
			linkDataArray: [],
		};
		let n = 1;
		
		for (const name in this.aProduction) {
			for (const oProd of this.aProduction[name]) {
				const oNode = oProd.getNodeData(n++);
				oModel.nodeDataArray.push(oNode);
			}
		}
		for (const oSink of this.aSink) {
			const oNode = oSink.getNodeData(n++);
			oModel.nodeDataArray.push(oNode);
		}
		
		oModel.linkDataArray = [
			//{ from: "minerMk1", to: "split", fromPortId: "out0", toPortId: "in0" },
			//{ from: "split", to: "sink", fromPortId: "out2", toPortId: "in0" },
			//{ from: 'ironore#0', fromPortId: 'out', to: 'splitter#0', toPortId: 'in', },
			//{ from: 'splitter#0', fromPortId: 'out_left', to: 'ironingot#0', toPortId: 'in', },
			//{ from: 'splitter#0', fromPortId: 'out_mid', to: 'ironingot#1', toPortId: 'in', },
		];
		for (const aProd of this.aLink) {
			const oLink = {
				from: aProd[0].id, 
				fromPortId: "out0",
				to: aProd[1].id, 
				toPortId: "in0",
			};
			console.log(oLink);
			oModel.linkDataArray.push(oLink);
		}
		return oModel;
	}
}