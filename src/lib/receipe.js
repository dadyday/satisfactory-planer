import Building from './Building';

export default class Receipe {

	static aOutputList = {};
	static aInputList = {};

	static register(aData) {
		// ironingot: ['Eisenbarren', {ironingot: 30}, {ironore: 30}, 'smelter'],
		const oReceipe = new Receipe(...aData);
		
		for (const item in oReceipe.aOutput) {
			if (!this.aOutputList[item]) this.aOutputList[item] = [];
			this.aOutputList[item].push(oReceipe);
		}
		
		for (const item in oReceipe.aInput) {
			if (!this.aInputList[item]) this.aInputList[item] = [];
			this.aInputList[item].push(oReceipe);
		}
	}

	static registerAll(aReceipeData) {
		for (const aData of Object.values(aReceipeData)) {
			this.register(aData);
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
	
	//**********************************

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

	createProduction() {
		const oBuilding = Building.get(this.prod);
		return oBuilding.createProduction(this);
	}

}

