
export default class Transport {
	id = null;
	oSource;
	sourcePortId = 'out0'; // TODO!
	oTarget;
	targetPortId = 'in0'; // TODO!
	type = '';
	item = '';
	count = 0;

	constructor(oSource, item, count, oTarget) {
		this.oSource = oSource;
		this.oTarget = oTarget;
		this.type = 'belt';
		this.item = item;
		this.count = count;
		oSource.addOutput(this);
		oTarget.addInput(this);
	}

	getLinkData(id) {
		this.id = this.type+id;
		return {
			from:       this.oSource.id,
			fromPortId: this.sourcePortId,
			to:         this.oTarget.id,
			toPortId:   this.targetPortId,
		};

	}


}
