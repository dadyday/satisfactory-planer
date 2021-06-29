import Receipe from './Receipe';
import Item from './Item';
import _ from 'underscore';

export default class Scheme {

	mQuantity = new Map;
	mProduction = new Map;
	aSink = [];
	canCreate = true;

	constructor(oNeed = {}, canCreate = true) {
		_.each(oNeed, (count, item) => {
			this.addNeeded(item, count);
		});
		this.canCreate = canCreate;
		this.calcProduction();
	}

	getQuantity(item) {
		if (!this.mQuantity.has(item)) this.mQuantity.set(item, { need:0, in:0, out:0, rest:0 });
		return this.mQuantity.get(item);
	}

	addInQuantity(item, count) {
		this.getQuantity(item).in += count;
	}

	addOutQuantity(item, count) {
		const oQ = this.getQuantity(item);
		oQ.out += count;
		oQ.rest = oQ.out - oQ.in - oQ.need;
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
				oQuant.in -= oQuant.need;
				const oTarget = this.addStorageFor(item, oQuant.need);
				this.createNeeded(oTarget);
			}
		});
	}

	addStorageFor(item, count) {
		const oInput = {}; oInput[item] = count;
		const oReceipe = new Receipe('store', 'container', Item.get(item).name, {}, oInput);
		const oSink = oReceipe.createProduction();
		this.aSink.push(oSink);
		return oSink;
	}

	createNeeded(oProd, productivity = 1.0) {
		oProd.increaseProductivity(productivity, this);
	}

	addProduction(item, count, oTarget) {
		this.eachProduction((oProd) => {
			if (!oProd.oReceipe.mOutput.has(item)) return true;
			if (oProd.productivity >= .9999) return true;

			count = oProd.increaseCapacity(item, count, oTarget, this);
			return count >= .0001;
		});
		return count;
	}

	createProduction(item, count, oTarget) {
		if (!this.canCreate) return;
		const oReceipe = Receipe.getByOutput(item);
		while (count > 0.0001) {
			const oProd = oReceipe.createProduction();
			count = oProd.increaseCapacity(item, count, oTarget, this);
			this.getProduction(oReceipe.name).push(oProd);
		}
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
