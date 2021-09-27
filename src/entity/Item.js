

export default class Item {

	id = '';
	name = 'none';
	portType = null;
	isFluid = false;
	stackSize = 0;
	imgName = '';

	ingredient = false;
	product = false;
	tier = null;
	milestone = null;

	constructor(id, name, portType, stackSize, imgName = null) {
		this.name = name;
		this.portType = portType;
		this.isFluid = portType == 'pipe';
		this.stackSize = stackSize;
		this.imgName = (imgName ?? id).replace(/([A-Z]+)/g, '_$1').toLowerCase();
	}

	imageUrl() {
		return `img/item/big/${this.imgName}.png`;
	}


	//** statics **********************************

	static mList = new Map();

	static register(id, oData) {
		const oInst = new Item(id, oData.name, oData.type);
		Object.assign(oInst, oData);
		//Object.setPrototypeOf(oData, Item.prototype);
		this.mList.set(id, oInst);
	}

	/*
	static register(id, aData) {
		const [name, portType, stackSize, imgName] = aData;
		const oItem = new Item(id, name, portType, stackSize, imgName);
		this.mList.set(id, oItem);
	}	//*/

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

	static getTierGroups() {
		const mTier = new Map;
		this.each((item) => {
			if (!mTier.has(item.tier)) {
				mTier.set(item.tier, {
					tier: 'Tier '+item.tier,
					items: [],
				});
			}
			mTier.get(item.tier).items.push(item);
		});
		return mTier;
	}

	static each(func) {
		this.mList.forEach(func);
	}
}
