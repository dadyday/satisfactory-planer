import {
	Receipe,
	Item,
} from '.';


export default class Scheme {

	mDemand = new Map;
	mSupply = new Map;
	mQuantity = new Map;
	mReceipe = new Map;
	mProduction = new Map;

	canCreate = true;
	canAdjust = false;
	//aSeries = [];

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
			const oQuantity = this.initQuantity(item);
			oQuantity.demand += count;

			const oStore = this.createStorage(item, count, true);
			this.mDemand.getInit(item, []).push(oStore);

			this.findReceipe(item, count ? count : undefined);

			// REFACTOR count = this.findProduction(item, count, oStore);
			// REFACTOR this.createProduction(item, count, oStore);
		});
		this.adjustRate();
		//this.calcProduction();

		//this.createProduction();

		//this.calcProductivity();
		//this.mProduction = new Map(Array.from(this.mProduction.entries()).reverse());
	}

	/** erzeugt quantity stats für item	 */
	initQuantity(item) {
		return this.mQuantity.getInit(item, { demand:0, supply: 0, in:0, out:0, rest:0 });
	}
	takeQuantity(item, count) {
		const oQnt = this.initQuantity(item);
		var max = oQnt.supply + oQnt.out - oQnt.in;
		oQnt.in += count;
		oQnt.rest = oQnt.out - oQnt.in - oQnt.demand + oQnt.supply;
		return max >= count ? 0 : count - max;
	}
	inQuantity(item, count) {
		const oQnt = this.initQuantity(item);
		oQnt.in += count;
		oQnt.rest = oQnt.out - oQnt.in - oQnt.demand + oQnt.supply;
		//if (oQnt.rest < 0.00001) oQnt.rest = 0;
	}
	outQuantity(item, count) {
		const oQnt = this.initQuantity(item);
		oQnt.out += count;
		oQnt.rest = oQnt.out - oQnt.in - oQnt.demand + oQnt.supply;
		//if (oQnt.rest < 0.00001) oQnt.rest = 0;
	}
	calcQuantity() {
		this.mQuantity.forEach((oQnt, item) => {
			oQnt.in = oQnt.out = oQnt.rest = oQnt.demand = 0;
		});
		this.mProduction.forEach((aProd) => {
			aProd.forEach((oProd) => {
				oProd.oReceipe.mInput.forEach((count, item) => {
					this.inQuantity(item, count * oProd.productivity);
				});
				oProd.oReceipe.mOutput.forEach((count, item) => {
					this.outQuantity(item, count * oProd.productivity);
				});
			});
		});
	}

	/**
	 * erzeugt Container für {count} {item}s /min.
	 * zum einlagern {inOut: true} oder ausgeben {inOut: false}
	 */
	createStorage(item, count, inOut = true) {
		const oInput = {}, oOutput = {};
		if (inOut) oInput[item] = count; else oOutput[item] = count;
		const oItem = Item.get(item);
		const oReceipe = new Receipe('store', oItem.fluid ? 'buffer' : 'container', oItem.name, oOutput, oInput);
		const oProd = oReceipe.createProduction();
		return oProd;
	}

	findReceipe(item, count = 1.0) {
		//if (this.mReceipe.has(item)) return;

		const aReceipe = Receipe.getByOutput(item) ?? [];
		const oReceipe = aReceipe.find((o) => !o.unpack && !o.alt);
		if (!oReceipe) return;

		const cnt = this.takeQuantity(item, count); // nimm items aus lager
		if (!cnt) return;

		var rate = cnt / oReceipe.mOutput.get(item);
		const oProd = this.mProduction.getInit(oReceipe.id, [oReceipe.createProduction()]) [0];
		oProd.productivity += rate;

		oReceipe.mOutput.forEach((count, item) => {
			this.mReceipe.getInit(item, []).push(oReceipe);
			this.outQuantity(item, count * rate);
		});
		oReceipe.mInput.forEach((count, item) => {
			this.findReceipe(item, count * rate);
		});
	}

	adjustRate() {
		var max = 0.0;
		const mTemp = new Map;

		this.mProduction.forEach((aProd, id) => {
			const sum = aProd.reduce((sum, oProd) => sum + oProd.productivity, 0.0);
			const cnt = aProd.reduce((cnt, oProd) => cnt + (oProd.booster ?? 1), 0.0);
			mTemp.set(id, [sum, cnt]);
			max = Math.max(max, sum / cnt);
		});
		if (max < 0.0001) return;

		this.mQuantity = new Map;
		this.mProduction.forEach((aProd, id) => {
			var [sum, cnt] = mTemp.get(id);
			sum = sum / max;
			const full = Math.abs(sum - cnt) < 0.0001;

			aProd.forEach((oProd) => {
				oProd.full = full;
				oProd.productivity = Math.min(sum, (oProd.booster ?? 1.0));
				sum -= oProd.productivity;
				oProd.oReceipe.mOutput.forEach((count, item) => {
					this.outQuantity(item, count * oProd.productivity);
				});
				oProd.oReceipe.mInput.forEach((count, item) => {
					this.inQuantity(item, count * oProd.productivity);
				});
			});
		});
		this.calcQuantity();
	}

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

		this.mProduction.forEach((aProd) => aProd.forEach((oProd) => {
			const oNode = oProd.getNodeData();
			oModel.nodeDataArray.push(oNode);

			//console.log(oProd.aOutput);
			oProd.aOutput.forEach((oTransport) => {
				const oLink = oTransport.getLinkData();
				oModel.linkDataArray.push(oLink);
			});
		}));

		//console.log(this.mDemand);
		//this.mDemand.forEach(addData);
		//this.mProduction.forEach((aProd) => aProd.forEach(addData));
		//this.mSupply.forEach((aProd) => aProd.forEach(addData));

		return oModel;
	}
/*
	createProduction() {
		var aReceipes = {};
		this.mReceipe.forEach((aReceipe, item) => {
			aReceipe.forEach((oReceipe) => {
				aReceipes[oReceipe.id] = oReceipe;
			});
		});

		aReceipes = Object.values(aReceipes)
			.reverse()
			.sortBy(['!mined', 'milestone'])
		;

		aReceipes.forEach((oReceipe) => {
			const oProd = oReceipe.createProduction();
			oProd.productivity = 1.0;
			this.mProduction.getInit(oReceipe.id, []).push(oProd);
		});
	}

	calcProductivity() {
		var max = 10;
		while(this.setProductivity(1.0)) {
			if (!--max) break;
		}
	}
	setProductivity(rate) {
		var cnt = 0;
		this.mQuantity.forEach((oQuantity, item) => {
			if (!oQuantity.rest) return;
			if (!oQuantity.in) return;
			if (!oQuantity.out) return;
			cnt++;

			const aReceipe = this.mReceipe.get(item);
			// aReceipe.forEach((oReceipe) => {
			// 	oReceipe.mOutput.get(item)
			// });
			aReceipe.forEach((oReceipe) => {
				const aProd = this.mProduction.get(oReceipe.id);
				const delta = oQuantity.rest / oReceipe.mOutput.get(item);

				aProd.forEach((oProd) => {
					//console.log(item, oProd.productivity, delta);
					oProd.productivity -= delta;
					this.calcQuantity();
				});
			});
		});
		return cnt;
	}
*/
	/**
	 * sucht Productions für {count} {item}s /min.
	 * und verbindet sie mit {oTarget}
	 * und liefert den rest
	 */
	/* REFACTOR findProduction(item, count, oTarget) {
		[
			...this.mSupply.getInit(item, []),
			...this.mProduction.getInit(item, [])
		].forEach((oProd) => {
			if (oProd.productivity < .9999) {
				count = oProd.increaseCapacity(item, count, oTarget, this);
			}
		});
		return count <= .001 ? 0 : count;
	} //*/

	/**
	 * erzeugt genügend Productions für {count} {item}s /min.
	 * und verbindet sie mit {oTarget}
	 */
	/* REFACTOR createProduction(item, count, oTarget) {
		if (!this.canCreate) return;
		var oReceipe = Receipe.getByOutput(item);
		//if (oReceipe.unpack) oReceipe = Receipe.getByOutput(item, 1);

		for (var oEntry of this.aSeries) {
			if (oEntry.id == oReceipe.id) {
				//throw [`receipe '${oReceipe.id}' already in list`, this.aSeries];
			}
		}
		this.aSeries.push(oReceipe);
		if (this.aSeries.length > 100) {
			throw ['too much steps', this.aSeries];
		}

		while (count > 0.001) {
			const oProd = oReceipe.createProduction();
			count = oProd.increaseCapacity(item, count, oTarget, this);
			oReceipe.mOutput.forEach((count, item) => {
				this.mProduction.getInit(item, []).push(oProd);
			})
		}
	} //*/

	/**
	 * sucht bzw. erzeugt Productions für {count} {item}s /min.
	 * und verbindet sie mit {oProd}
	 */
	/* REFACTOR addInputQuantity(item, count, oProd) {
		const oQuantity = this.initQuantity(item);
		oQuantity.in += count;

		//const tx = count.minMax(0, oQuantity.rest + oQuantity.supply);
		//oQuantity.rest -= tx;

		count = this.findProduction(item, count, oProd);
		this.createProduction(item, count, oProd);
	} //*/

	/* REFACTOR addOutputQuantity(item, count) {
		const oQuantity = this.initQuantity(item)
		oQuantity.out += count;
		oQuantity.rest =
			oQuantity.out -
			oQuantity.in -
			oQuantity.demand +
			oQuantity.supply;
	} //*/

	/* REFACTOR sortProduction() {
		const aTemp = [...this.mProduction.entries()];
		aTemp.sort((aLeft, aRight) => {
			const oLeft = Item.get(aLeft[0]);
			const oRight = Item.get(aRight[0]);
			if (oLeft.tier > oRight.tier) return -1;
			if (oLeft.tier < oRight.tier) return 1;
			if (oLeft.milestone > oRight.milestone) return -1;
			if (oLeft.milestone < oRight.milestone) return 1;
			return 0;
		})
	} //*/

}
