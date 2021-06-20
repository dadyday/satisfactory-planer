import Transport from './Transport';
import _ from 'underscore';

export default class Production {
	id = null;
	oBuilding;
	name = '';
	oReceipe;
	productivity = 0.0;
	aInput = [];
	aOutput = [];

	constructor(oBuilding, oReceipe) {
		this.oBuilding = oBuilding;
		this.name = oReceipe.name;
		this.oReceipe = oReceipe;
	}

	addOutput(oTransport) {
		this.aOutput.push(oTransport);
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
			delta = oTransport.oSource.setDelta(delta, aIgnore);
		});

		this.aOutput.forEach((oTransport) => {
			delta = oTransport.oTarget.setDelta(delta, aIgnore);
		});

		console.log(this.name, delta)
		this.productivity += delta;
		return delta;
	}

	changeProductivity(newValue) {
		this.setDelta(newValue - this.productivity);
	}

	increaseCapacity(item, count, oTarget, itemHandler) {
		const capacity = Math.min(
			1.0 - this.productivity,
			1.0 * count / this.oReceipe.mOutput.get(item)
		);
		const rest = count - (capacity * this.oReceipe.mOutput.get(item));
		this.productivity += capacity;

		new Transport(this, item, count-rest, oTarget);

		this.oReceipe.mInput.forEach((cnt, itm) => {
			itemHandler(true, itm, cnt * capacity);
		});
		this.oReceipe.mOutput.forEach((cnt, itm) => {
			itemHandler(false, itm, cnt * capacity);
		});

		return rest;
	}

	createInput() {
		console.log(this);
	}

	getNodeData(id) {
		this.id = this.name+id;
		const oData = this.oBuilding.getNodeData(this.id);
		oData.detail = this.name;
		oData.production = this;
		return oData;
	}

	getLinkDataList() {
		return []
	}


}
