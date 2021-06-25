import Building from './Building';

export default class Receipe {

	static mOutputList = new Map;
	static mInputList = new Map;

	static register(aData) {
		// ironingot: ['smelter', 'Eisenbarren', {ironingot: 30}, {ironore: 30}],
		const oReceipe = new Receipe(...aData);

		oReceipe.mOutput.forEach((count, item) => {
			if (!this.mOutputList.has(item)) this.mOutputList.set(item, []);
			this.mOutputList.get(item).push(oReceipe);
		});

		oReceipe.mInput.forEach((count, item) => {
			if (!this.mInputList.has(item)) this.mInputList.set(item, []);
			this.mInputList.get(item).push(oReceipe);
		});
	}

	static registerAll(oReceipeData) {
		new Map(Object.entries(oReceipeData)).forEach((aData) => {
			this.register(aData);
		});
	}

	static getByOutput(item, pos = 0) {
		const aReceipe = this.mOutputList.get(item);
		if (!aReceipe) {
			console.warn(`no receipe found for item '${item}'`);
			return null;
		}
		return aReceipe[pos];
	}

	//**********************************

	name = 'none';
	mOutput = new Map; // Map of item: count
	mInput = new Map; // Map of item: count
	type; // id of Building

	constructor(type, name = null, oOutput = [], oInput = []) {
		this.type = type;
		this.name = name ?? 'none';
		this.mOutput = new Map(Object.entries(oOutput));
		this.mInput = new Map(Object.entries(oInput));
	}

	createProduction() {
		const oBuilding = Building.get(this.type);
		return oBuilding.createProduction(this);
	}

	getItems() {
		const aRet =
			Object.entries(this.mInput) +
			Object.entries(this.mOutput);
		return aRet;
	}

}
