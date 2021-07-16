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
	mPort = new Map; // map of portId -> item

	constructor(type, receipe = null) {
		this.id = this.constructor.lastId++;
		this.setBuilding(type);
		this.setReceipe(receipe);
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
		this.initPorts();
	}

	initPorts() {
		// builing ioType: [portId]
		// ibelt: [in0, in1, in2], ipipe: [in3], obelt: [out0]
		const mPort = new Map
		this.oBuilding.aPort.forEach(oPort => {
			const key = (oPort.inOut ? 'i' : 'o') + oPort.type;
			mPort.getInit(key, []).push(oPort.id);
			this.mPort.setDefault(oPort.id, null);
		});

		// receipe ioType: [item]
		// ibelt: [ironRod, screw], ipipe: [water], obelt: [reinforced]
		const mItem = new Map
		if (this.oReceipe) {
			const func = (io, item) => {
				const key = io + Item.get(item).portType;
				mItem.getInit(key, []).push(item);
			};
			this.oReceipe.mInput.forEach((count, item) => func('i', item));
			this.oReceipe.mOutput.forEach((count, item) => func('o', item));
		}

		// production portId: item
		// {in0: -, in1: -, in2: screw, in3: -}
		this.mPort.forEach((item, portId) => {
			if (!item) return;
			const key = portId.charAt(0) + Item.get(item).portType;
			const p = mPort.getInit(key, []).indexOf(portId);
			const i = mItem.getInit(key, []).indexOf(item);

			//$dump(key, portId, p, item, i);
			if (p < 0) this.mPort.delete(portId)
			else {
				mPort.get(key).splice(p,1);
				if (i < 0) this.mPort.set(portId, null);
				else {
					mItem.get(key).splice(i,1);
				}
			}
		});
		//$dump('----', mPort, mItem, this.mPort);

		// result portId: item
		// {in0: ironRod, in1: -, in2: screw, in3: water}
		mItem.forEach((aItem, key) => {
			const aPort = mPort.get(key);
			aItem.forEach((item) => {
				const portId = aPort.shift();
				//$dump(key, item, portId);
				this.mPort.set(portId, item);
			});
		});
	}

	getItemPortId(inOut, item) {
		const io = (inOut ? 'i' : 'o');
		var ret = null;
		this.mPort.forEach((itm, prt) => {
			if (!ret && itm == item && prt.charAt(0) == io) {
				ret = prt;
			}
		});
		return ret;
	}

	getPortItem(portId) {
		return this.mPort.get(portId);
	}

	setPortItem(portId, item) {
		const oldId = this.getItemPortId(portId.charAt(0) == 'i', item);
		if (oldId) {
			$dump(oldId, item)
			this.mPort.set(oldId, null);
		}
		this.mPort.set(portId, item);
		this.initPorts();
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
		$_.forEach(oData.ports, (item, portId) => oProd.mPort.set(portId, item));
		return oProd;
	}

	getNodeData() {
		var oData = {
			id: this.id,
			detail: this.oReceipe?.name ?? '',
			receipe: this.oReceipe?.id ?? '',

			// ports: this.oReceipe?.getItems() ?? [],
			ports: Object.fromEntries(this.mPort),
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
