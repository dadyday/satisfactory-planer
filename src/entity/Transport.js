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
	}

	getLinkData() {
		//this.id = this.type+id;
		return {
			from:       this.oSource?.id ?? '',
			fromPortId: this.oSource?.getItemPortId(false, this.item) ?? '',
			to:         this.oTarget?.id ?? '',
			toPortId:   this.oTarget?.getItemPortId(true, this.item) ?? '',
		};

	}


}
