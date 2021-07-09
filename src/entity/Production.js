import {
	Building,
	Transport,
	Receipe,
	Item,
} from '.';


export default class Production {
	id = null;
	type; // Building id
	name = ''; // Receipe name
	oReceipe; // Receipe object
	productivity = 0.0;
	aInput = []; // Array of Transport objects
	aOutput = []; // Array of Transport objects
	//mFreePort = new Map({true: new Map, false: new Map}); // map of inOut -> portType -> Port
	//mPort = new Map({true: new Map, false: new Map}); // map of inOut -> item -> Port
	mFreePort = new Map;
	mPort = new Map;

	constructor(type, receipe = null) {
		this.id = this.constructor.lastId++;
		this.setBuilding(type);
		this.setReceipe(receipe);
		this.initPorts();
	}

	setBuilding(type = null) {
		this.oBuilding = type instanceof Building ? type : Building.get(type);
		this.type = this.oBuilding.type;
		if (this.type != this.oReceipe?.type ?? null) {
			this.setReceipe(null);
		}
	}

	setReceipe(receipe = null) {
		this.oReceipe = receipe instanceof Receipe ? receipe : Receipe.get(receipe);
		this.name = this.oReceipe?.name ?? 'none';
		if (this.oReceipe) {
			this.setBuilding(this.oReceipe.type);
		}
	}

	initPorts() {
		$_.each(this.oBuilding.aPort, (oPort) => {
			const key = oPort.inOut + oPort.type;
			this.mFreePort.getInit(key, []).push(oPort);
		});
	}

	getItemPort(inOut, item) {
		const key = inOut + item;
		var oPort = this.mPort.get(key) ?? null;
		if (!oPort) {
			const free = inOut + Item.get(item).portType;
			oPort = this.mFreePort.get(free)?.shift() ?? null;
			if (oPort) this.mPort.set(key, oPort);
		}
		return oPort;
	}

	createTransport(item, count, oTarget) {
		var oTransp = this.findOutput(item, oTarget);
		if (oTransp) {
			oTransp.count += count;
		}
		else {
			oTransp = new Transport(item, count, this, oTarget);
			this.aOutput.push(oTransp);
			oTarget.aInput.push(oTransp);
		}
	}

	findOutput(item, oTarget) {
		for (var oTransp of this.aOutput) {
			if (item && oTransp.item !== item) continue;
			if (oTarget && oTransp.oTarget !== oTarget) continue;
			return oTransp
		}
		return null;
	}


	/* p     d=0.5  d=-0.5
		----- ------ ------
		1.0   0      -0.5
		0.66  0.33   -0.5
		0.5   0.5    -0.5
		0.33  0.5    -0.33
		0     0.5    0
	*/
	setDelta(delta, aIgnore = []) {
		if (this.name == 'storage') return delta;
		if ($_.contains(aIgnore, this)) return delta;
		aIgnore.push(this);

		delta = Math.min(delta, 1.0 - this.productivity);
		delta = Math.max(delta, 0.0 - this.productivity);

		this.aInput.forEach((oTransport) => {
			delta = oTransport.oSource?.setDelta(delta, aIgnore) ?? 0;
		});

		this.aOutput.forEach((oTransport) => {
			delta = oTransport.oTarget?.setDelta(delta, aIgnore) ?? 0;
		});

		console.log(this.name, delta)
		this.productivity += delta;
		return delta;
	}

	changeProductivity(newValue, oScheme) {
		//this.setDelta(newValue - this.productivity);
		oScheme.createNeeded(this, newValue - this.productivity);
		this.productivity = newValue;
	}

	increaseCapacity(item, count, oTarget, oScheme) {
		const delta = Math.min(
			1.0 - this.productivity,
			1.0 * count / this.oReceipe.mOutput.get(item)
		);
		var cnt = delta * this.oReceipe.mOutput.get(item);
		const rest = count - cnt;

		this.createTransport(item, cnt, oTarget);
		this.increaseProductivity(delta, oScheme)
		return rest;
	}

	increaseProductivity(delta, oScheme) {
		this.productivity += delta;

		this.oReceipe.mInput.forEach((cnt, itm) => {
			oScheme.addInputQuantity(itm, cnt * delta, this);
		});
		this.oReceipe.mOutput.forEach((cnt, itm) => {
			oScheme.addOutputQuantity(itm, cnt * delta, this);
		});
	}

	//** godata ***********

	static createFromNodeData(oData) {
		const oProd = new Production(oData.type, oData.receipe);
		oProd.id = oData.id;
		oProd.productivity = oData.productivity;
		return oProd;
	}

	getNodeData() {
		var oData = {
			id: this.id,
			detail: this.oReceipe?.name ?? '',
			receipe: this.oReceipe?.id ?? '',
			ports: this.oReceipe?.getItems() ?? [],
		};
		Object.assign(oData, this.oBuilding.getNodeData());
		return oData;
	}

	getLinkDataList() {
		return []
	}


	//** static **********************

	static lastId = 1;
}
