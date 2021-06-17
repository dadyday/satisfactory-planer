
export default class Item {

	static mList = new Map();

	static register(item, aData) {
		// item: [name, portType, stackSize, {imgName}]
		if (!aData[3]) aData.push(item);
		const oItem = new Item(...aData);
		this.mList.set(item, oItem);
	}
	
	static registerAll(oItemData) {
		new Map(Object.entries(oItemData)).forEach((aData, item) => {
			this.register(item, aData);
		});
	}

	static get(item) {
		return this.mList.get(item) ?? new Item('-- kein --', null, 0, 'none');
	}

	static getAll() {
		return this.mList;
	}

	static each(func) {
		this.mList.forEach(func);
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

