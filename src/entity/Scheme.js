import {
	Receipe,
	Item,
} from '.';


export default class Scheme {

	mQuantity = new Map;
	mProduction = new Map;
	aDemand = [];
	aSupply = [];
	canCreate = true;

	constructor(oDemand = {}, oSupply = {}, canCreate = true) {
		$_.each(oSupply, (count, item) => {
			this.getQuantity(item).supply += count;
		});
		$_.each(oDemand, (count, item) => {
			this.getQuantity(item).demand += count;
		});
		this.canCreate = canCreate;
		this.calcProduction();
	}

	getQuantity(item) {
		return this.mQuantity.getInit(item, { demand:0, supply: 0, in:0, out:0, rest:0 });
	}

	addInQuantity(item, count, oProd) {
		this.getQuantity(item).in += count;

		if (this.getQuantity(item).rest) {
			if (this.getQuantity(item).rest >= count) {
				this.getQuantity(item).rest -= count;
				count = 0;
			}
			else {
				count -= this.getQuantity(item).rest;
				this.getQuantity(item).rest = 0;
			}
		}

		count = this.addProduction(item, count, oProd);
		this.createProduction(item, count, oProd);
	}

	addOutQuantity(item, count) {
		const oQ = this.getQuantity(item);
		oQ.out += count;
		oQ.rest = oQ.out - oQ.in - oQ.demand + oQ.supply;
	}

	getProduction(name) {
		return this.mProduction.getInit(name, []);
	}

	eachProduction(handler) {
		this.mProduction.forEach((aProd) => { aProd.forEach(handler); });
	}

	calcProduction() {
		this.mQuantity.forEach((oQuant, item) => {
			if (oQuant.supply) {
				oQuant.rest += oQuant.supply;
				this.addStorageFor(item, oQuant.supply);
			}
			if (oQuant.demand) {
				oQuant.in -= oQuant.demand;
				const oTarget = this.addStorageFor(item, oQuant.demand);
				this.createNeeded(oTarget);
			}
		});
	}

	addStorageFor(item, count, inOut = true) {
		const oInput = {}, oOutput = {};
		if (inOut) oInput[item] = count;
		else oOutput[item] = count;
		const oReceipe = new Receipe('store', 'container', Item.get(item).name, oOutput, oInput);
		const oProd = oReceipe.createProduction();
		if (inOut) this.aDemand.push(oProd);
		else this.aSupply.push(oProd);
		return oProd;
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

		for (const oProd of this.aSupply) {
			const oNode = oProd.getNodeData();
			oModel.nodeDataArray.push(oNode);
		}

		this.eachProduction((oProd) => {
			const oNode = oProd.getNodeData();
			oModel.nodeDataArray.push(oNode);
		});

		for (const oProd of this.aDemand) {
			const oNode = oProd.getNodeData();
			oModel.nodeDataArray.push(oNode);
		}



		this.eachProduction((oProd) => {
			oProd.aOutput.forEach((oTransport) => {
				const oLink = oTransport.getLinkData();
				oModel.linkDataArray.push(oLink);
			});
		});

		return oModel;
	}
}
