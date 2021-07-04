import Production from './Production';
import Port from './Port';
import $_ from 'underscore';

export default class Building {

	type = '';
	name = '';
	imgName = '';
	oSize = { width: 100, height: 100 };
	aPort = [];
	aLayer = [];

	constructor(type, name, w, h, layer, aPort) {
		this.type = type;
		this.name = name;
		this.imgName = type.replace(/([A-Z]+)/g, '_$1').toLowerCase();
		this.oSize = { width: w*10, height: h*10 };
		this.aPort = aPort;
		if (layer & 2) this.aLayer.push('elevated');
		if (layer & 1) this.aLayer.push('ground');
	}

	imageUrl() {
		return `img/building/${this.imgName}.png`;
	}

	createProduction() {
		return new Production(this);
	}

	//** godata ***********

	getNodeData() {
		return {
			type: this.type,
			name: this.name,
			layer: this.aLayer[0],
			orient: 0,
		};
	}

	//** statics ****************************

	static mList = new Map();

	static register(type, aData) {
		// smelter: ['Smelter', 9, 6, 3, [ ['belt', true, 0, top], ['belt', false, 0] ]]
		const [name, width, height, layerFlags, aPortData] = aData;

		const aPort = []; var i = 0, o = 0;
		$_.each(aPortData, (aData) => {
			const [type, inOut, offset, side] = aData;
			const pos = inOut ? i++ : o++;
			aPort.push(new Port(type, inOut, pos, offset, side));
		});

		const oBuilding = new Building(type, name, width, height, layerFlags, aPort);
		this.mList.set(type, oBuilding);
	}

	static registerAll(oBuildingData) {
		new Map(Object.entries(oBuildingData)).forEach((aData, type) => {
			this.register(type, aData);
		});
	}

	static get(type) {
		if (type && !this.mList.has(type)) console.warn(`Building ${type} not found!`, this.mList);
		return this.mList.get(type) ?? null;
	}

	static getAll() {
		return this.mList;
	}

	static each(func) {
		this.mList.forEach(func);
	}
}
