
export default class Item {



	id = '';
	name = 'none';
	portType = null;
	stackSize = 0;
	imgName = '';

	constructor(id, name, portType, stackSize, imgName = null) {
		this.name = name;
		this.portType = portType;
		this.stackSize = stackSize;
		this.imgName = (imgName ?? id).replace(/([A-Z]+)/g, '_$1').toLowerCase();
	}

	imageUrl() {
		return `img/item/big/${this.imgName}.png`;
	}


	//** statics **********************************

	static mList = new Map();

	static register(id, aData) {
		const [name, portType, stackSize, imgName] = aData;
		const oItem = new Item(id, name, portType, stackSize, imgName);
		this.mList.set(id, oItem);
	}

	static registerAll(oItemData) {
		new Map(Object.entries(oItemData)).forEach((aData, item) => {
			this.register(item, aData);
		});
	}

	static get(item) {
		return this.mList.get(item) ?? new Item(null, '-- kein --', null, 0, 'none');
	}

	static getAll() {
		return this.mList;
	}

	static each(func) {
		this.mList.forEach(func);
	}
}
