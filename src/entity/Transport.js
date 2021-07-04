import {
	Item,
} from '.';


export default class Transport {
	id = null;
	type = '';
	item = '';
	count = 0;
	oSource;
	oTarget;

	constructor(item, count, oSource, oTarget) {
		this.type = Item.get(item).portType;
		this.item = item;
		this.count = count;
		this.oSource = oSource;
		this.oTarget = oTarget;

		oSource.addOutput(this);
		oTarget.addInput(this);
	}

	getLinkData() {
		//this.id = this.type+id;
		return {
			from:       this.oSource.id,
			fromPortId: this.oSource.getItemPort(false, this.item).id,
			to:         this.oTarget.id,
			toPortId:   this.oTarget.getItemPort(true, this.item).id,
		};

	}


}
