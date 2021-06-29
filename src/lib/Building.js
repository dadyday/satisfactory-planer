//import Production from './Production';
//import Receipe from './Receipe';
import PortType from './PortType';

export default class Building {

	static mList = new Map();

	static register(type, aData) {
		// type: [name, width, height, layerFlags, [ [portType, in, offset, side], ...]]
		// smelter: ['Smelter', 9, 6, [ ['belt', true, 0], ['belt', false, 0] ]]
		for (var i in aData[4]) {
			aData[4][i] = new PortType(...aData[4][i]);
		}
		const oBuilding = new Building(type, ...aData);
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

	//**********************************

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

	// *********** gojs helper

	getNodeData() {
		return {
			type: this.type,
			name: this.name,
			layer: this.aLayer[0],
			orient: 0,
		};
	}

}
