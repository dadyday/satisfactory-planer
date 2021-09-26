import {
	Receipe,
	Item,
} from '.';


export default class Scheme {

	mQuantity = new Map;
	mSupply = new Map;
	mProduction = new Map;
	aDemand = [];
	canCreate = true;
	aSeries = [];

	constructor(oDemand = {}, oSupply = {}, canCreate = true) {
		this.canCreate = canCreate;

		$_.each(oSupply, (count, item) => {
			const oQuantity = this.initQuantity(item);
			oQuantity.supply += count;
			oQuantity.out -= count;

			const oStore = this.createStorage(item, count, false);
			this.mSupply.getInit(item, []).push(oStore);
		});

		$_.each(oDemand, (count, item) => {
			this.initQuantity(item).demand += count;

			const oStore = this.createStorage(item, count, true);
			this.aDemand.push(oStore);

			count = this.findProduction(item, count, oStore);
			this.createProduction(item, count, oStore);
		});
		//this.calcProduction();

		this.sortProduction();
	}

	initQuantity(item) {
		return this.mQuantity.getInit(item, { demand:0, supply: 0, in:0, out:0, rest:0 });
	}



	/**
	 * erzeugt Container für {count} {item}s /min.
	 * zum einlagern {inOut: true} oder ausgeben {inOut: false}
	 */
	createStorage(item, count, inOut = true) {
		const oInput = {}, oOutput = {};
		if (inOut) oInput[item] = count; else oOutput[item] = count;
		const oItem = Item.get(item);
		const oReceipe = new Receipe('store', oItem.isFluid ? 'buffer' : 'container', oItem.name, oOutput, oInput);
		const oProd = oReceipe.createProduction();
		return oProd;
	}

	/**
	 * sucht Productions für {count} {item}s /min.
	 * und verbindet sie mit {oTarget}
	 * und liefert den rest
	 */
	findProduction(item, count, oTarget) {
		[
			...this.mSupply.getInit(item, []),
			...this.mProduction.getInit(item, [])
		].forEach((oProd) => {
			if (oProd.productivity < .9999) {
				count = oProd.increaseCapacity(item, count, oTarget, this);
			}
		});
		return count <= .0001 ? 0 : count;
	}

	/**
	 * erzeugt genügend Productions für {count} {item}s /min.
	 * und verbindet sie mit {oTarget}
	 */
	createProduction(item, count, oTarget) {
		if (!this.canCreate) return;
		var oReceipe = Receipe.getByOutput(item);
		//if (oReceipe.isUnpack) oReceipe = Receipe.getByOutput(item, 1);

		this.aSeries.push(oReceipe);
		if (this.aSeries.length > 300) {
			console.error('too much steps', this.aSeries);
			return;
		}

		while (count > 0.0001) {
			const oProd = oReceipe.createProduction();
			count = oProd.increaseCapacity(item, count, oTarget, this);
			oReceipe.mOutput.forEach((count, item) => {
				this.mProduction.getInit(item, []).push(oProd);
			})
		}
	}

	sortProduction() {
		const aTemp = [...this.mProduction.entries()];
		aTemp.sort((aLeft, aRight) => {
			const oLeft = Item.get(aLeft[0]);
			const oRight = Item.get(aRight[0]);
			console.log(oLeft, oRight);
			if (oLeft.tier > oRight.tier) return -1;
			if (oLeft.tier < oRight.tier) return 1;
			if (oLeft.milestone > oRight.milestone) return -1;
			if (oLeft.milestone < oRight.milestone) return 1;
			return 0;
		})
	}

	/**
	 * sucht bzw. erzeugt Productions für {count} {item}s /min.
	 * und verbindet sie mit {oProd}
	 */
	addInputQuantity(item, count, oProd) {
		const oQuantity = this.initQuantity(item);
		oQuantity.in += count;

		//const tx = count.minMax(0, oQuantity.rest + oQuantity.supply);
		//oQuantity.rest -= tx;

		count = this.findProduction(item, count, oProd);
		this.createProduction(item, count, oProd);
	}

	addOutputQuantity(item, count) {
		const oQuantity = this.initQuantity(item)
		oQuantity.out += count;
		oQuantity.rest =
			oQuantity.out -
			oQuantity.in -
			oQuantity.demand +
			oQuantity.supply;
	}

/*
	calcProduction() {
		this.mQuantity.forEach((oQuant, item) => {
			if (oQuant.supply) {
				oQuant.rest += oQuant.supply;
				this.addStorageFor(item, oQuant.supply, false);
				//this.getProduction('store').push(oProd);
			}
			if (oQuant.demand) {
				oQuant.in -= oQuant.demand;
				const oTarget = this.addStorageFor(item, oQuant.demand);
				this.createNeeded(oTarget);
			}
		});
	}



	createNeeded(oProd, productivity = 1.0) {
		oProd.increaseProductivity(productivity, this);
	}

	*/


	// ***************** drawing

	getModel() {
		const oModel = {
			nodeDataArray: [],
			linkDataArray: [],
		};

		function addData(oProd) {
			const oNode = oProd.getNodeData();
			oModel.nodeDataArray.push(oNode);
			oProd.aOutput.forEach((oTransport) => {
				const oLink = oTransport.getLinkData();
				oModel.linkDataArray.push(oLink);
			});
		}

		this.aDemand.forEach(addData);
		this.mProduction.forEach((aProd) => aProd.forEach(addData));
		this.mSupply.forEach((aProd) => aProd.forEach(addData));

		return oModel;
	}
}
