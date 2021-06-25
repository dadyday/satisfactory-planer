import Transport from './Transport';
import _ from 'underscore';

export default class Production {
	id = null;
	oBuilding; // Building object
	name = ''; // Receipe name
	oReceipe; // Receipe object
	productivity = 0.0;
	aInput = []; // Array of Transport objects
	aOutput = []; // Array of Transport objects

	constructor(oBuilding, oReceipe) {
		this.oBuilding = oBuilding;
		this.name = oReceipe.name;
		this.oReceipe = oReceipe;
	}

	addOutput(oTransport) {
		this.aOutput.push(oTransport);
	}

	findOutput(item, oTarget) {
		for (var oTransp of this.aOutput) {
			if (item && oTransp.item !== item) continue;
			if (oTarget && oTransp.oTarget !== oTarget) continue;
			return oTransp
		}
		return null;
	}

	addInput(oTransport) {
		this.aInput.push(oTransport);
	}

	/* p     d=0.5  d=-0.5
		----- ------ ------
		1.0   0      -0.5
		0.66  0.33   -0.5
		0.5   0.5    -0.5
		0.33  0.5    -0.33
		0     0.5    0
	*/
	setDelta(delta, aIgnore = []) {
		if (this.name == 'storage') return delta;
		if (_.contains(aIgnore, this)) return delta;
		aIgnore.push(this);

		delta = Math.min(delta, 1.0 - this.productivity);
		delta = Math.max(delta, 0.0 - this.productivity);

		this.aInput.forEach((oTransport) => {
			delta = oTransport.oSource?.setDelta(delta, aIgnore) ?? 0;
		});

		this.aOutput.forEach((oTransport) => {
			delta = oTransport.oTarget?.setDelta(delta, aIgnore) ?? 0;
		});

		console.log(this.name, delta)
		this.productivity += delta;
		return delta;
	}

	changeProductivity(newValue, oScheme) {
		//this.setDelta(newValue - this.productivity);
		oScheme.createNeeded(this, newValue - this.productivity);
		this.productivity = newValue;
	}

	increaseCapacity(item, count, oTarget, oScheme) {
		const delta = Math.min(
			1.0 - this.productivity,
			1.0 * count / this.oReceipe.mOutput.get(item)
		);
		var cnt = delta * this.oReceipe.mOutput.get(item);
		const rest = count - cnt;

		const oTransp = this.findOutput(item, oTarget);
		if (oTransp) {
			oTransp.count += cnt;
		}
		else {
			new Transport(this, item, cnt, oTarget);
		}

		this.increaseProductivity(delta, oScheme)
		return rest;
	}

	increaseProductivity(delta, oScheme) {
		this.productivity += delta;

		this.oReceipe.mInput.forEach((cnt, itm) => {
			oScheme.addInQuantity(itm, cnt * delta, this);
			const rest = oScheme.addProduction(itm, cnt * delta, this);
			oScheme.createProduction(itm, rest, this);
		});
		this.oReceipe.mOutput.forEach((cnt, itm) => {
			oScheme.addOutQuantity(itm, cnt * delta, this);
		});
	}

	getNodeData(id) {
		this.id = this.name+id;
		const oData = this.oBuilding.getNodeData(this.id);
		return oData;
	}

	getLinkDataList() {
		return []
	}


}
