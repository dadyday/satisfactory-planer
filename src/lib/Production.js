import Transport from './Transport';

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

	getNodeData(id) {
		this.id = this.name+id;
		return this.oBuilding.getNodeData(this.id);
	}

	getLinkDataList() {
		return []
	}


}
