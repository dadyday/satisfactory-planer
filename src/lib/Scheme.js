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

	constructor(oNeed = {}) {
		_.each(oNeed, (count, item) => {
			this.addNeeded(item, count);
		});
		this.calcProduction();
	}

	getQuantity(item) {
		if (!this.mQuantity.has(item)) this.mQuantity.set(item, { need:0, in:0, out:0 });
		return this.mQuantity.get(item);
	}

	getProduction(name) {
		if (!this.mProduction.has(name)) this.mProduction.set(name, []);
		return this.mProduction.get(name);
	}

	eachProduction(handler) {
		this.mProduction.forEach((aProd) => { aProd.forEach(handler); });
	}

	addNeeded(item, count) {
		this.getQuantity(item).need += count;
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
		this.eachProduction((oProd) => {
			if (oProd.productivity < .9999
				&& oProd.oReceipe.mOutput.has(item)
			) {
				count = this.addProdCapacity(oProd, item, count, oTarget);
			}
		});

		const oReceipe = Receipe.getByOutput(item);
		while (count > 0.0001) {
			const oProd = oReceipe.createProduction();
			count = this.addProdCapacity(oProd, item, count, oTarget);
			this.getProduction(oReceipe.name).push(oProd);
		}
	}

	addProdCapacity(oProd, item, count, oTarget) {
		const self = this;

		const rest = oProd.increaseCapacity(item, count, oTarget, (inOut, itm, cnt) => {
			if (inOut) {
				this.getQuantity(itm).in += cnt;
				self.addProductionFor(itm, cnt, oProd);
			}
			else this.getQuantity(itm).out += cnt;
		});

		return rest;
	}

	recalcFrom(oProd) {
		console.log(oProd.mOutput);
	}


	// ***************** drawing

	getModel() {
		const oModel = {
			nodeDataArray: [],
			linkDataArray: [],
		};
		let n = 1;
		let l = 1;

		this.eachProduction((oProd) => {
			const oNode = oProd.getNodeData(n++);
			oModel.nodeDataArray.push(oNode);
		});

		for (const oSink of this.aSink) {
			const oNode = oSink.getNodeData(n++);
			oModel.nodeDataArray.push(oNode);
		}

		this.eachProduction((oProd) => {
			oProd.aOutput.forEach((oTransport) => {
				const oLink = oTransport.getLinkData(l++);
				oModel.linkDataArray.push(oLink);
			});
		});

		return oModel;
	}
}
