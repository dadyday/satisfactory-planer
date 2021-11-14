import go from 'gojs';
import  { Production, Building } from "../entity";

export default class MergerLinkingTool extends go.LinkingTool {

	name = "MergerLinkingTool";

	constructor() {
		super();
	}

	canStart() {
		if (!super.canStart()) return false;
		var diagram = this.diagram;
		if (diagram === null) return false;
		// require left button & that it has moved far enough away from the mouse down point, so it isn't a click
		var e = diagram.lastInput;
		if (!e.left) return false;
		if (!this.isBeyondDragSize()) return false;

		return true;
	}

	doActivate() {
		super.doActivate();
	}

	doMouseMove() {
		if (!this.isActive) return;
		super.doMouseMove();

		this.oLink = this.findLink();
		this.oLabelNode = this.delLabel(this.oLabelNode);
		if (this.oLink) {
			this.oLabelNode = this.addLabel(this.oLink);
			this.moveLabel(this.oLabelNode)
		}
	}

	doMouseUp() {
		if (!this.isActive) return;

		if (this.oLink) {

			const oProd = new Production(this.isForwards ? 'merger' : 'splitter');
			var oPt = this.oLabelNode.location.copy();
			this.snap(oPt);

			var oNode = this.createNode({
				...oProd.getNodeData(),
				pos: [oPt.x, oPt.y],
				ori: this.oLabelNode.angle,
			});

			var oLink1 = this.createLinkLike(this.oLink, {
				to: oNode.key,
				toPortId: 'ob0',
			});

			var oLink2 = this.createLinkLike(this.oLink, {
				from: oNode.key,
				fromPortId: 'ob0',
			});

			this.oLabelNode = this.delLabel(this.oLabelNode);
			this.diagram.model.removeLinkData(this.oLink.data);

			//this.stopTool();
		}
		super.doMouseUp();
	}



	findLink() {
		var e = this.diagram.lastInput;
		var oLink = this.diagram.findPartAt(e.documentPoint);

		if (oLink) {
			if (oLink.part instanceof go.Link) {
				return oLink;
			}
			else if (oLink.part instanceof go.Node && oLink.labeledLink) {
				return oLink.labeledLink;
			}
		}
		return null;
	}

	findLabelNode(oLink) {
	}

	createNode(oNodeData) {
		this.diagram.model.addNodeData(oNodeData);
		return this.diagram.findNodeForData(oNodeData);
	}

	createLink(oLinkData) {
		this.diagram.model.addLinkData(oLinkData);
		return this.diagram.findLinkForData(oLinkData);
	}

	createLinkLike(oLink, oProp) {
		// seems not to work, if path or id properties given
		let oLinkData = {
			type: this.oLink.data.type,
			from: this.oLink.data.from,
			fromPortId: this.oLink.data.fromPortId,
			to: this.oLink.data.to,
			toPortId: this.oLink.data.toPortId,
			//path: this.oLink.data.path,
			...oProp,
		};
		return this.createLink(oLinkData);
	}

	addLabel(oLink) {
		var oLabelNode = this.createNode({
			type: this.isForwards ? 'split' : 'merge',
		});
		oLabelNode.labeledLink = oLink;
		return oLabelNode;
	}

	delLabel(oLabelNode) {
		if (oLabelNode) {
			this.diagram.model.removeNodeData(oLabelNode.data);
		}
		return null;
	}

	snap(oPoint) {
		var oGridOrigin = this.diagram.grid.gridOrigin;
		var oGridSize = this.diagram.grid.gridCellSize;
		oPoint.snapToGridPoint(oGridOrigin, oGridSize);
	}

	moveLabel(oLabelNode) {
		var oLastPt = this.diagram.lastInput.documentPoint;
		this.snap(oLastPt);

		var oPath = oLabelNode.labeledLink.path;
		var oLocalPt = oPath.getLocalPoint(oLastPt);

		var frac = oPath.geometry.getFractionForPoint(oLocalPt);
		var ang = oPath.geometry.getAngleAlongPath(frac);
		var oPt = oPath.geometry.getPointAlongPath(frac);

		oLabelNode.angle = ang+180;
		oLabelNode.segmentFraction = frac;
		//oLabelNode.position = pt;
	}

}
