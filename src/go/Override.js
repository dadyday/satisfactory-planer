import go from 'gojs';

const spot = (side, from = 0, to = 1, off = 0) => {
	const mid = (to-from) /2;
	switch (side) {
		case 'left': return new go.Spot(from, mid, off, 0);
		case 'right': return new go.Spot(to, mid, -off, 0);
		case 'top': return new go.Spot(mid, from, 0, off);
		case 'bottom': return new go.Spot(mid, to, 0, -off);
	}
	return null; //new go.Spot(mid, mid);
}
const unSpot = (oSpot) => {
	const str = go.Spot.stringify(oSpot);
	switch (str) {
		case '0 0.5 0 0': return 'Left';
		case '1 0.5 0 0': return 'Right';
		case '0.5 0 0 0': return 'Top';
		case '0.5 1 0 0': return 'Bottom';
		default:
			if (str.match(/^[A-Z]/)) break;
			$dump('unknown spot', str);
	}
	return str;
}
const unPoint = (oPoint) => {
	if (!oPoint) return oPoint;
	var str = go.Point.stringify(oPoint);
	return str;
}


export class MyNode extends go.Node {

	constructor() {
		super();
	}
}


export class MyPort extends go.Panel {

	linkSpots = {};

	constructor() {
		super();
	}

	calculateRealSpots(oNode) {
		$dump('calculate real spots');
		this.linkSpots = {};
		let oLinks = oNode.findLinksOutOf(this.portId);
		let aSide = ['top', 'bottom', 'left'];

		oLinks.each(oLink => {
			let side = aSide.pop();
			this.linkSpots[oLink.key] = spot(side);
		})
	}

	getRealSpot(oLink) {
		if (!this.linkSpots[oLink.key]) {
			this.calculateRealSpots(oLink.fromNode);
		}

		return this.linkSpots[oLink.key] ?? null;
	}
}

export class MyLink extends go.Link {
	constructor() {
		super();
	}

	xx_computeSpot(...aArg) {
		var ret = super.computeSpot(...aArg);
		$dump(aArg, ret);
		return ret;
	}

	x_computeSpot(isFrom, oPort = null) {
		var oSpot = super.computeSpot(isFrom, oPort);
		//if (isFrom) $dump(this.key, 'computeSpot', oPort.portId, unSpot(oSpot));

		if (oPort && oSpot.isSide()) {
			oPort.calculateRealSpots(this.fromNode);
			oSpot = oPort.getRealSpot(this) ?? oSpot;
		}

		return oSpot;
	}

	x_computeOtherPoint(oOtherNode, oOtherPort) {
		var oRet = super.computeOtherPoint(oOtherNode, oOtherPort);
		$dump(this.key, 'computeOtherPoint', oOtherNode.key, oOtherPort.portId, unPoint(oRet));
		return oRet;
	}

	x_getLinkPointFromPoint(oNode, oPort, oFocus, oGeneral, isFrom, oResult) {
		if (isFrom) $dump(this.key, 'getLinkPointFromPoint...');
		var oPoint = super.getLinkPointFromPoint(oNode, oPort, oFocus, oGeneral, isFrom, oResult);
		if (isFrom) $dump(this.key, 'getLinkPointFromPoint', oNode.key, oPort.portId, unPoint(oFocus), unPoint(oGeneral), unPoint(oResult), unPoint(oPoint));
		return oPoint;
	}

	x_getLinkPoint(oNode, oPort, oSpot, isFrom, isOrtho, oOtherNode, oOtherPort, oRetPoint) {
		if (isFrom) $dump(this.key, 'getLinkPoint...');

		if (oPort && oSpot.isSide()) {
			//oPort.calculateRealSpots(oNode);
			//oSpot = oPort.getRealSpot(this.key) ?? oSpot;
		}

		var oPoint = super.getLinkPoint(oNode, oPort, oSpot, isFrom, isOrtho, oOtherNode, oOtherPort, oRetPoint);
		if (isFrom) $dump(this.key, 'getLinkPoint', oNode.key, oPort.portId, unSpot(oSpot), oOtherNode.key, oOtherPort.portId, unPoint(oRetPoint), unPoint(oPoint));

		return oPoint;
	}

	x_getLinkDirection(oNode, oPort, oLinkPoint, oSpot, isFrom, isOrtho, oOtherNode, oOtherPort) {
		if (isFrom) $dump(this.key, 'getLinkDirection...');
		var angle = super.getLinkDirection(oNode, oPort, oLinkPoint, oSpot, isFrom, isOrtho, oOtherNode, oOtherPort);
		if (isFrom) $dump(this.key, 'getLinkDirection', oNode.key, oPort.portId, unPoint(oLinkPoint), unSpot(oSpot), oOtherNode.key, oOtherPort.portId, angle);

		// if (oSpot.isSide()) {
		// 	//oSpot = oPort.getSpot(this);
		// 	oSpot = go.Spot.Top;
		// 	return new go.Point(0, 0);
		// }
		return angle;
	}


	x_renderPortDir(oPort, origDir) {
		/*
		const oLinks = oPort.data.links = oPort.data.links ?? { left: null, top: null, bottom: null };
		if (!oLinks[origDir]) {
			oLinks[origDir] = oLink.id;
			return origDir;
		}
		var ret = 'left';
		for (var dir in oLinks) {
			var id = oLinks[dir];
			if (id) {
				if (id == oLink.id) {
					ret = dir;
					break;
				}
			}
			else {
				oLinks[dir] = oLink.id;
				ret = dir;
				break;
			}
		}*/
	}
	x_computeEndSegmentLength(oNode, oPort, oSpot, isFrom) {
		var len = super.computeEndSegmentLength(oNode, oPort, oSpot, isFrom);
		if (isFrom) $dump(this.key, 'computeEndSegmentLength', oNode.key, oPort.portId, unSpot(oSpot), len);
		return len;
	}
	x_computeThickness() {
		var ret = super.computeThickness();
		$dump(this.key, 'computeThickness', ret);
		return 40;
	}
	x_computeSpacing() {
		var ret = super.computeSpacing();
		$dump(this.key, 'computeSpacing', ret);
		return ret;
	}
}
