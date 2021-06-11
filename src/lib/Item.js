
export default class Item {

	static aList = {};

	static register(item, aData) {
		// item: [name, portType, stackSize]
		const oItem = new Item(...aData);
		this.aList[item] = oItem;
	}
	
	static registerAll(aItemData) {
		for (const [item, aData] of Object.entries(aItemData)) {
			this.register(item, aData);
		}
	}

	static get(item) {
		return this.aList[item] ?? new Item(item, '', 0);
	}

	//**********************************

	name = 'none';
	portType = null;
	stackSize = 0;

	constructor(name, portType, stackSize) {
		this.name = name;
		this.portType = portType;
		this.stackSize = stackSize;
	}
}

