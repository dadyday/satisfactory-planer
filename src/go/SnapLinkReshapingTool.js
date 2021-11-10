import go from 'gojs';

export default class SnapLinkReshapingTool extends go.LinkReshapingTool {

	gridCellSize = new go.Size(NaN, NaN);
	gridOrigin = new go.Point(NaN, NaN);
	isGridSnapEnabled = true;
	avoidsNodes = true;
	_safePoint = new go.Point(NaN, NaN);

	x = 0; y = -1; same = false;

	/**
	 * @constructor
	 * @extends LinkReshapingTool
	 * @class
	 * This SnapLinkReshapingTool class supports snapping reshaping handles to go to the nearest grid point.
	 * If {@link #avoidsNodes} is true and the link is orthogonal,
	 * it also avoids reshaping the link so that any adjacent segments cross over any avoidable nodes.
	 */
	constructor() {
		super();
	}

	/**
	 * This override records information about the original point of the handle being dragged,
	 * if the {@link #adornedLink} is Orthogonal and if {@link #avoidsNodes} is true.
	 */
	doActivate() {
		this.gridOrigin = this.diagram.grid.gridOrigin;
		this.gridCellSize = this.diagram.grid.gridCellSize;

		super.doActivate();

		this.oHelperLine = this.adornedLink.findObject('HELPER');
		//this.origStroke = this.adornedLink.findMainElement().stroke;

		if (this.isActive && this.avoidsNodes && this.adornedLink.isOrthogonal) {
			// assume the Link's route starts off correctly avoiding all nodes
			this._safePoint = this.diagram.lastInput.documentPoint.copy();
		}


	}
	doDeactivate() {
		//this.adornedLink.findMainElement().stroke = this.origStroke;
		super.doDeactivate();
	}

	snap(oPoint) {
		oPoint.snapToGridPoint(this.gridOrigin, this.gridCellSize);
	}

	computeReshape(oPt) {
		if (this.isGridSnapEnabled) {
			this.snap(oPt);
		}
		if (this.avoidsNodes && this.adornedLink.isOrthogonal) {

			const aOverlap = this._checkSegmentsOverlap(oPt);
			const aDash = this.getStrokeDashes(aOverlap);
			this.oHelperLine.strokeDashArray = aDash;
			this.oHelperLine.stroke = !aDash.length ? this.origStroke : 'red';
		}
		return super.computeReshape(oPt);
	}

	// part of feature falling back to last good position ...
	_getNearestPoint(oPt) {
		function* bresenham(oFrom, oTo, oSize) {
			var dx = Math.abs(oTo.x - oFrom.x);
			var dy = Math.abs(oTo.y - oFrom.y);
			var sx = oTo.x < oFrom.x ? -oSize.width : oSize.width;
			var sy = oTo.y < oFrom.y ? -oSize.height : oSize.height;
			var err = dx - dy;

			while (true) {
				//this.snap(oFrom);
				yield oFrom.copy();

				if (Math.abs(oFrom.x-oTo.x) < 0.5 && Math.abs(oFrom.y-oTo.y) < 0.5) break;
				if (oFrom.equals(oTo)) break;

				if (2*err > -dy) {
					err -= dy;
					oFrom.x += sx;
				}
				if (2*err < dx) {
					err += dx;
					oFrom.y += sy;
				}
			}
		}

		let index = this.handle.segmentIndex; // always between 2...last-2
		let oCurr = this.adornedLink.getPoint(index);

		let gen = bresenham(oPt.copy(), oCurr, this.gridCellSize);
		let i = 100; let ok;
		while (i--) {
			oPt = gen.next().value;
			ok = this._checkSegmentsOverlap(oPt);
			if (ok) break;
		}

		return oPt;
	}

	_checkSegmentsOverlap(oPt) {
		const isNodeAvoidable = oPart => oPart instanceof go.Node && oPart.avoidable;
		const isOverlapping = (oFrom, oTo) => {
			if (!oFrom || !oTo) return false;
			var oRect = new go.Rect(oFrom, oTo);
			var oParts = this.diagram.findPartsIn(oRect, true, false);
			return oParts.any(isNodeAvoidable);
		};

		let last = this.adornedLink.pointsCount-1;
		let idx = this.handle.segmentIndex; // always between 2...last-2

		let oPrev2 = this.adornedLink.getPoint(idx <= 2 ? idx-1 : idx-2).copy();
		let oPrev = this.adornedLink.getPoint(idx-1).copy();
		let oCurr = this.adornedLink.getPoint(idx);
		let oNext = this.adornedLink.getPoint(idx+1).copy();
		let oNext2 = this.adornedLink.getPoint(idx >= last-2 ? idx+1 : idx+2).copy();

		let vert = Math.abs(oCurr.y - oPrev.y) < 0.5;
		if (vert) {
			oPrev.y = oPt.y;
			oNext.x = oPt.x;
		}
		else {
			oPrev.x = oPt.x;
			oNext.y = oPt.y;
		}

		const aOverlap = [];
		if (isOverlapping(oPrev2, oPrev)) aOverlap.push(idx-1);
		if (isOverlapping(oPrev, oPt)) aOverlap.push(idx);
		if (isOverlapping(oPt, oNext)) aOverlap.push(idx+1);
		if (isOverlapping(oNext, oNext2)) aOverlap.push(idx+2);

		//$dump(idx, aOverlap);
		return aOverlap;
	}

	getStrokeDashes(aSegNo) {
		const aSegLen = this.getSegmentLengths();
		//$dump(aSegLen);

		// make unique und filter out no < 0
		const aNo = aSegNo.reduce((aNo, no, i, arr) => {
			if (no >= 2 && arr.indexOf(no) === i) aNo.push(no-2);
			return aNo;
		}, []);
		aNo.sort(); // must be sorted
		aNo.push(Number.POSITIVE_INFINITY); // at once on entry
		//$dump(aNo);

		const aDash = [0]; // begin with hole
		var sum = 0;
		var onOff = false; // off
		var no = aNo.shift();  // init first no

		for (var i = 0; i < aSegLen.length; i+=2) { // 2 steps!
			var curve = aSegLen[i];
			var line = aSegLen[i+1];
			var n = i >> 1; // comp no with half of loop
			//$dump('loop', onOff, n, no, sum, curve, line);

			var swtch = onOff; // switch, if on, but ...
			if (n == no) { // on match ...
				swtch = !onOff; // switch if off ...
				no = aNo.shift(); // and get next no
			}

			if (swtch) {
				//$dump('sw', onOff, no, sum, curve, line);
				var halfcurve = curve * (onOff ? 0.8 : 0.2);
				aDash.push(sum + halfcurve); // all segs before with half curve
				sum = -halfcurve; // remember the half curve
				onOff = !onOff;
			}
			sum += line + curve;
		}
		aDash.push(sum);
		//$dump(aDash);
		return aDash;
	}

	getSegmentLengths() {
		const path = this.adornedLink.path;
		const geo = path.geometry;
		const figure = geo.figures.elt(0);
		const segs = figure.segments;

		var maxLen = 0;
		var x = figure.startX, y = figure.startY;
		const aSegLen = [0];
		//const aSegType = [];
		var curve = true;

		for (var i = 0; i < segs.count; i++) {
			const seg = segs.elt(i);
			var len = Math.abs(seg.endX - x) + Math.abs(seg.endY - y);
			if (seg.type !== go.PathSegment.Line) {
				// 1/4 of circle but seem to bee 3.24 instead of Pi
				len = len * 3.24 / 4;
			}
			//aSegType.push(seg.type.name);

			if (seg.type == go.PathSegment.Line && !(aSegLen.length % 2)) aSegLen.push(0);
			aSegLen.push(len);
			maxLen += len;
			x = seg.endX; y = seg.endY;
		}
		//$dump(aSegType);
		// correcting lengths
		return aSegLen.map(len => len * (maxLen ? geo.flattenedTotalLength/maxLen : 1));
	}

	new_checkSegmentsOverlap(oPt) {
		const isNodeAvoidable = oPart => oPart instanceof go.Node && oPart.avoidable;

		const isOverlapping = (oFrom, oTo) => {
			var oRect = new go.Rect(oFrom, oTo);
			//$dump(oRect);
			var oParts = this.diagram.findPartsIn(oRect, true, false);
			return oParts.any(isNodeAvoidable);
		};

		const checkPoints = (oP1, oP2) => {
			if (!oP1) return true;

			let horz = Math.abs(oP1.y - oP.y) < 0.5;

			let oQ1 = horz ? new go.Point(oP1.x, oPt.y) : new go.Point(oPt.x, oP1.y);
			if (isOverlapping(oPt, oQ1)) return false;

			if (!oP2) return true;

			let oQ2 = horz ? new go.Point(oQ1.x, oP2.y) : new go.Point(oP2.x, oQ1.y);
			if (isOverlapping(oQ1, oQ2)) return false;

			return true;
		};

		var last = this.adornedLink.pointsCount-1;
		var index = this.handle.segmentIndex; // always between 2...last-2
		var oP = this.adornedLink.getPoint(index);

		//if (index == 2) oPt.y = oP.y;
		//if (index == cnt-3) oPt.y = oP.y;

		let oP1 = this.adornedLink.getPoint(index-1);
		let oP0 = this.adornedLink.getPoint(index-2);
		let oP2 = this.adornedLink.getPoint(index+1);
		let oP3 = this.adornedLink.getPoint(index+2);

		if (!checkPoints(oP1, oP0)) return false;
		if (!checkPoints(oP2, oP3)) return false;

		return true;
	}

	origin_checkSegmentsOverlap(pt) {
		var index = this.handle.segmentIndex;

		this._prevSegHoriz = Math.abs(this.adornedLink.getPoint(index-1).y - this.adornedLink.getPoint(index).y) < 0.5;
    this._nextSegHoriz = Math.abs(this.adornedLink.getPoint(index+1).y - this.adornedLink.getPoint(index).y) < 0.5;

		if (index >= 1) {
	    var p1 = this.adornedLink.getPoint(index-1);
	    var r = new go.Rect(pt.x, pt.y, 0, 0);
	    var q1 = p1.copy();
	    if (this._prevSegHoriz) {
	      q1.y = pt.y;
	    } else {
	      q1.x = pt.x;
	    }
	    r.unionPoint(q1);
	    var overlaps = this.diagram.findPartsIn(r, true, false);
	    if (overlaps.any(function(p) { return p instanceof go.Node && p.avoidable; })) return false;

	    if (index >= 2) {
	      var p0 = this.adornedLink.getPoint(index-2);
	      var r = new go.Rect(q1.x, q1.y, 0, 0);
	      if (this._prevSegHoriz) {
	        r.unionPoint(new go.Point(q1.x, p0.y));
	      } else {
	        r.unionPoint(new go.Point(p0.x, q1.y));
	      }
	      var overlaps = this.diagram.findPartsIn(r, true, false);
	      if (overlaps.any(function(p) { return p instanceof go.Node && p.avoidable; })) return false;
	    }
	  }

	  if (index < this.adornedLink.pointsCount-1) {
	    var p2 = this.adornedLink.getPoint(index+1);
	    var r = new go.Rect(pt.x, pt.y, 0, 0);
	    var q2 = p2.copy();
	    if (this._nextSegHoriz) {
	      q2.y = pt.y;
	    } else {
	      q2.x = pt.x;
	    }
	    r.unionPoint(q2);
	    var overlaps = this.diagram.findPartsIn(r, true, false);
	    if (overlaps.any(function(p) { return p instanceof go.Node && p.avoidable; })) return false;

	    if (index < this.adornedLink.pointsCount-2) {
	      var p3 = this.adornedLink.getPoint(index+2);
	      var r = new go.Rect(q2.x, q2.y, 0, 0);
	      if (this._nextSegHoriz) {
	        r.unionPoint(new go.Point(q2.x, p3.y));
	      } else {
	        r.unionPoint(new go.Point(p3.x, q2.y));
	      }
	      var overlaps = this.diagram.findPartsIn(r, true, false);
	      if (overlaps.any(function(p) { return p instanceof go.Node && p.avoidable; })) return false;
	    }
	  }

		return true;
	}
}
