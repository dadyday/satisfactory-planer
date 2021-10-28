import Entity from './Entity';
import {
	Production,
	Port,
} from '.';


export default class Building extends Entity {

	name = '**deprecated**';
	imgName = '';
	oSize = { width: 100, height: 100 };
	oSide = { left: [], right: [], top: [], bottom: []};
	aLayer = [];

	constructor(id, aData) {
		super(id);

		const [width, height, layerFlags, aPortData, imgName] = aData;

		this.oSize = {
			width: width*10,
			height: height*10
		};
		if (layerFlags & 2) this.aLayer.push('elevated');
		if (layerFlags & 1) this.aLayer.push('ground');

		var i = 0, o = 0;
		aPortData.forEach((aData) => {
			const [type, inOut, offset, side] = aData;
			const pos = inOut ? i++ : o++;
			const oPort = new Port(type, inOut, pos, offset, side);

			for (; oPort.offset > 0; oPort.offset--) this.oSide[oPort.side].push({});
			this.oSide[oPort.side].push(oPort);
			for (; oPort.offset < 0; oPort.offset++) this.oSide[oPort.side].push({});
		});

		this.imgName = imgName ?? id.replace(/([A-Z]+)/g, '_$1').toLowerCase();
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
			type: this.id,
			name: this.getName,
			layer: this.aLayer[0],
			orient: 0,
		};
	}

	//** statics ****************************

	static entity = 'building';
	static mList = new Map();

}
