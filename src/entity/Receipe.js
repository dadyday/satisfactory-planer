import {
//	Building,
	Production,
} from '.';


export default class Receipe {

	id;
	type; // id of Building
	name = 'none';
	isMined = false;
	isUnpack = false;
	isAlt = false;
	mOutput = new Map; // Map of item: count
	mInput = new Map; // Map of item: count

	constructor(id, type, name = null, oOutput = [], oInput = [], alt = null) {
		this.id = id;
		this.type = type;
		this.name = name ?? 'none';
		this.isMined = !!this.type.match(/(extractor|miner)/i);
		this.isUnpack = !!this.name.match(/^unpackage/i);
		this.isAlt = alt ?? false;
		if (this.isAlt) this.name = 'alt: ' + this.name;
		this.mOutput = new Map(Object.entries(oOutput));
		this.mInput = new Map(Object.entries(oInput));
	}

	createProduction() {
		return new Production(this.type, this);
	}

	getPortItem(oPort) {
		const mPort = oPort.inOut ? this.mInput : this.mOutput;
		const aKey = [...mPort.keys()];
		const key = aKey[oPort.pos];
		return [key, mPort.get(key)];
	}

	getItems() {
		const aRet =
			Object.entries(this.mInput) +
			Object.entries(this.mOutput);
		return aRet;
	}

	//** statics ****************************

	static mList = new Map;
	static mOutputList = new Map;
	static mInputList = new Map;
	static mBuildingList = new Map;

	static create(id, aData) {
		const [type, name, oOutput, oInput, alt] = aData;
		return new Receipe(id, type, name, oOutput, oInput, alt);
	}

	static register(oReceipe) {
		this.mList.set(oReceipe.id, oReceipe);

		oReceipe.mOutput.forEach((count, item) => {
			this.mOutputList.getInit(item, []).push(oReceipe);
		});

		oReceipe.mInput.forEach((count, item) => {
			this.mInputList.getInit(item, []).push(oReceipe);
		});

		this.mBuildingList.getInit(oReceipe.type, []).push(oReceipe);
	}

	static compare(oItem1, oItem2) {
		if (oItem1.isMined != oItem2.isMined) return oItem1.isMined ? -1 : 1;
		if (oItem1.isUnpack != oItem2.isUnpack) return oItem1.isUnpack ? 1 : -1;
		if (oItem1.isAlt != oItem2.isAlt) return oItem1.isAlt ? 1 : -1;
		return 0;
	}

	static registerAll(oReceipeData) {
		const aReceipe = [];
		new Map(Object.entries(oReceipeData)).forEach((aData, id) => {
			aReceipe.push(this.create(id, aData));
		});
		aReceipe.sort(this.compare);
		aReceipe.forEach((item) => this.register(item));
	}

	static get(id) {
		if (id && !this.mList.has(id)) console.warn(`Receipe ${id} not found!`, this.mList);
		return this.mList.get(id) ?? null;
	}

	static getByBuilding(type) {
		return this.mBuildingList.get(type);
	}

	static getByOutput(item) {
		return this.mOutputList.get(item);
	}

}
