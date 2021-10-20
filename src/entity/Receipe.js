import Entity from './Entity';
import {
	Item,
	Production,
} from '.';


export default class Receipe extends Entity {

	constructor(id, oData) {
		super(id, {
			name: 'none',
			building: 'unknown',
			mined: false,
			unpack: false,
			alt: false,
			tier: 'unknown',
			milestone: null,
			...oData
		});

		this.name = this.name ?? 'none';
		if (this.alt) this.name = 'alt: ' + this.name;

		this.mined = !!this.building.match(/(extractor|miner)/i);
		this.unpack = !!this.name.match(/^unpackage/i);

		this.mOutput = new Map(Object.entries(oData.out ?? {}));
		this.mInput = new Map(Object.entries(oData.in ?? {}));

		if (this.milestone < 0) {
			/*
			this.milestone = [...this.mOutput.keys(), ...this.mInput.keys()].reduce((item, max) => {
				const oItem = Item.get(item);
				return Math.max(oItem.milestone ?? 0, max);
			}, 0); //*/
		}
	}

	createProduction() {
		return new Production(this.building, this);
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

	static entity = 'receipe';
	static mList = new Map();

	static mOutputList = new Map;
	static mInputList = new Map;
	static mBuildingList = new Map;


	static register(id, oReceipe) {
		super.register(id, oReceipe);

		oReceipe.mOutput.forEach((count, item) => {
			this.mOutputList.getInit(item, []).push(oReceipe);
		});

		oReceipe.mInput.forEach((count, item) => {
			this.mInputList.getInit(item, []).push(oReceipe);
		});

		this.mBuildingList.getInit(oReceipe.building, []).push(oReceipe);
	}

	static registerAll(oDataList) {
		super.registerAll(oDataList);

		//console.log(this.mList);
		//this.mList = this.mList.sortBy(['!mMined', 'unpack', 'milestone', 'alt']);
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
