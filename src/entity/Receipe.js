import Entity from './Entity';
import {
	Item,
	Production,
} from '.';


export default class Receipe extends Entity {

	id;
	name = 'none';
	building; // id of Building
	milestone = 0;
	isMined = false;
	isUnpack = false;
	isAlt = false;
	mOutput = new Map; // Map of item: count
	mInput = new Map; // Map of item: count

	constructor(id, aData) {
		super(id);
		const [building, name, oOutput, oInput, alt] = aData;

		this.name = name ?? 'none';
		this.building = building;
		this.isMined = !!this.building.match(/(extractor|miner)/i);
		this.isUnpack = !!this.name.match(/^unpackage/i);
		this.isAlt = alt ?? false;
		if (this.isAlt) this.name = 'alt: ' + this.name;
		this.mOutput = new Map(Object.entries(oOutput));
		this.mInput = new Map(Object.entries(oInput));

		this.milestone = [...this.mOutput.keys(), ...this.mInput.keys()].reduce((item, max) => {
			const oItem = Item.get(item);
			return Math.max(oItem.milestone ?? 0, max);
		}, 0);
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
		//this.mList = this.mList.sortBy(['!isMined', 'isUnpack', 'milestone', 'isAlt']);
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
