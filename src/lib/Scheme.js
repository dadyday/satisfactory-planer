import Receipe from './Receipe';
import _ from 'underscore';

export default class Scheme {

	static create(aNeed) {
		return new Scheme(aNeed);
	}

	//*************************
	
	mQuantity = new Map;
	mProduction = new Map;
	aSink = [];
	aLink = [];

	constructor(oNeed = {}) {
		_.each(oNeed, (count, item) => {
			this.addNeeded(item, count);
		});
		this.calcProduction();
	}

	addNeeded(item, count) {
		this.initQuantity(item);
		this.mQuantity.get(item).need += count;
	}

	initQuantity(item) {
		if (!this.mQuantity.has(item)) this.mQuantity.set(item, { need:0, in:0, out:0 });
	}

	calcProduction() {
		this.mQuantity.forEach((oQuant, item) => {
			if (oQuant.need) {
				const oTarget = this.addSinkFor(item, oQuant.need);
				this.addProductionFor(item, oQuant.need, oTarget);
			}
		});
	}

	addSinkFor(item, count) {
		const oReceipe = new Receipe('', [], {item: count}, 'container');
		const oSink = oReceipe.createProduction();
		this.aSink.push(oSink);
		return oSink;
	}

	addProductionFor(item, count, oTarget) {
		this.mProduction.forEach((aProd) => {
			aProd.forEach((oProd) => {
				if (oProd.productivity < .9999
					&& oProd.oReceipe.mOutput.has(item)
				) {
					count = this.addProdCapacity(oProd, item, count, oTarget);
				}
			});
		});

		const oReceipe = Receipe.getByOutput(item);
		while (count > 0.0001) {
			const oProd = oReceipe.createProduction();
			oProd.productivity = 0.0;
			count = this.addProdCapacity(oProd, item, count, oTarget);
			if (!this.mProduction.has(oReceipe.name)) this.mProduction.set(oReceipe.name, []);
			this.mProduction.get(oReceipe.name).push(oProd);
		}
	}

	addProdCapacity(oProd, item, count, oTarget) {
		const self = this;
		const cap = 1.0 - oProd.productivity;
		const eff = Math.min(1.0 * count / oProd.oReceipe.mOutput.get(item), cap);
		
		count -= eff * oProd.oReceipe.mOutput.get(item);
		oProd.productivity += eff;
		this.aLink.push([oProd, oTarget]);
		
		oProd.oReceipe.mOutput.forEach((cnt, itm) => {
			this.initQuantity(itm);
			this.mQuantity.get(itm).out += cnt * eff;
		});
		oProd.oReceipe.mInput.forEach((cnt, itm) => {
			this.initQuantity(itm);
			this.mQuantity.get(itm).in += cnt * eff;
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

		this.mProduction.forEach((aProd) => {
			aProd.forEach((oProd) => {
				const oNode = oProd.getNodeData(n++);
				oModel.nodeDataArray.push(oNode);
			});
		});
		
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
		const mUsed = new Map;
		for (const aProd of this.aLink) {
			var key = aProd[0].id + '_' + aProd[1].id;
			const oLink = {
				from: aProd[0].id, 
				fromPortId: "out0",
				to: aProd[1].id, 
				toPortId: "in0",
			};
			if (!mUsed.has(key)) {
				mUsed.set(key, oLink)
			}
		}

		mUsed.forEach((oLink) => { oModel.linkDataArray.push(oLink); });
		return oModel;
	}
}