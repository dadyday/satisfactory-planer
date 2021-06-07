import Building from './building';

export default class Receipe {
	name = 'none';
	aOutput = {};
	aInput = {};
	prod;

	constructor(name, aOutput, aInput, prod) {
		this.name = name;
		this.aOutput = aOutput;
		this.aInput = aInput;
		this.prod = prod;
	}

	createProd() {
		return Building.createProd(this);
	}

	static aOutputList = {};
	static aInputList = {};

	static register(oReceipe) {
		for (const item in oReceipe.aOutput) {
			if (!this.aOutputList[item]) this.aOutputList[item] = [];
			this.aOutputList[item].push(oReceipe);
		}
		for (const item in oReceipe.aInput) {
			if (!this.aInputList[item]) this.aInputList[item] = [];
			this.aInputList[item].push(oReceipe);
		}
	}

	static getByOutput(item, pos = 0) {
		const aReceipe = this.aOutputList[item];
		if (!aReceipe) {
			console.warn(`no receipe found for item '${item}'`);
			return null;
		}
		return aReceipe[pos];
	}
}

