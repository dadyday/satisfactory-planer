import Production from './Production';
//import Building from './Building';

export default class Receipe {

	id;
	type; // id of Building
	name = 'none';
	mOutput = new Map; // Map of item: count
	mInput = new Map; // Map of item: count

	constructor(id, type, name = null, oOutput = [], oInput = []) {
		this.id = id;
		this.type = type;
		this.name = name ?? 'none';
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

	static register(id, aData) {
		const [type, name, oOutput, oInput] = aData;
		const oReceipe = new Receipe(id, type, name, oOutput, oInput);
		this.mList.set(id, oReceipe);

		oReceipe.mOutput.forEach((count, item) => {
			this.mOutputList.getInit(item, []).push(oReceipe);
		});

		oReceipe.mInput.forEach((count, item) => {
			this.mInputList.getInit(item, []).push(oReceipe);
		});

		this.mBuildingList.getInit(oReceipe.type, []).push(oReceipe);
	}

	static registerAll(oReceipeData) {
		new Map(Object.entries(oReceipeData)).forEach((aData, id) => {
			this.register(id, aData);
		});
	}

	static get(id) {
		if (id && !this.mList.has(id)) console.warn(`Receipe ${id} not found!`, this.mList);
		return this.mList.get(id) ?? null;
	}

	static getByBuilding(type) {
		return this.mBuildingList.get(type);
	}

	static getByOutput(item, pos = 0) {
		const aReceipe = this.mOutputList.get(item);
		if (!aReceipe) {
			console.warn(`no receipe found for item '${item}'`);
			return null;
		}
		return aReceipe[pos];
	}

}
