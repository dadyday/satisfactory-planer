
export default class Item {

	static aList = {};
	static aImage = {};

	static register(item, aData) {
		// item: [name, portType, stackSize, {imgName}]
		if (!aData[3]) aData.push(item);
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
	imgName = '';

	constructor(name, portType, stackSize, imgName) {
		this.name = name;
		this.portType = portType;
		this.stackSize = stackSize;
		this.imgName = imgName.replace(/([A-Z]+)/g, '_$1').toLowerCase();
	}

	imageUrl() {
		return `img/item/big/${this.imgName}.png`;
	}
}

