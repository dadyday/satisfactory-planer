/**
* A custom Tool for moving a label on a Link that keeps the label on the link's path.
* This is an extension and not part of the main GoJS library.
* Note that the API for this class may change with any version, even point releases.
* If you intend to use an extension in production, you should copy the code to your own source directory.
* Extensions can be found in the GoJS kit under the extensions or extensionsTS folders.
* See the Extensions intro page (https://gojs.net/latest/intro/extensions.html) for more information.
*/
import go from 'gojs';


/**
* @constructor
* @extends Tool
* @class
* This tool only works when the Link has a label marked by the "_isLinkLabel" property.
*
* @see https://github.com/NorthwoodsSoftware/GoJS/blob/master/extensions/LinkLabelOnPathDragging.html
* myDiagram.toolManager.mouseMoveTools.insertAt(0, new LinkLabelTool());
*/
function LinkLabelTool() {
  go.Tool.call(this);
  this.name = "LinkLabelOnPathDragging";

  /** @type {GraphObject} */
  this.label = null;
  /** @type {number} */
  this._originalFraction = null;
}
go.Diagram.inherit(LinkLabelTool, go.Tool);

/**
* This tool can only start if the mouse has moved enough so that it is not a click,
* and if the mouse down point is on a GraphObject "label" in a Link Panel,
* as determined by findLabel().
* @this {LinkLabelTool}
* @return {boolean}
*/
LinkLabelTool.prototype.canStart = function() {
  if (!go.Tool.prototype.canStart.call(this)) return false;
  var diagram = this.diagram;
  if (diagram === null) return false;
  // require left button & that it has moved far enough away from the mouse down point, so it isn't a click
  var e = diagram.lastInput;
  if (!e.left) return false;
  if (!this.isBeyondDragSize()) return false;

  return this.findLabel() !== null;
}

/**
* From the GraphObject at the mouse point, search up the visual tree until we get to
* an object that has the "_isLinkLabel" property set to true and that is an immediate child of a Link Panel.
* @this {LinkLabelTool}
* @return {GraphObject} This returns null if no such label is at the mouse down point.
*/
LinkLabelTool.prototype.findLabel = function() {
  var diagram = this.diagram;
  var e = diagram.lastInput;
  var elt = diagram.findObjectAt(e.documentPoint, null, null);

  if (elt === null || !(elt.part instanceof go.Link)) return null;
  while (elt.panel !== elt.part) {
    elt = elt.panel;
  }
  // If it's not marked as "_isLinkLabel", don't consider it a label:
  if (!elt._isLinkLabel) return null;
  return elt;
};

/**
* Start a transaction, call findLabel and remember it as the "label" property,
* and remember the original values for the label's segment properties.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.doActivate = function() {
  this.startTransaction("Shifted Label");
  this.label = this.findLabel();
  if (this.label !== null) {
    this._originalFraction = this.label.segmentFraction;
  }
  go.Tool.prototype.doActivate.call(this);
}

/**
* Stop any ongoing transaction.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.doDeactivate = function() {
  go.Tool.prototype.doDeactivate.call(this);
  this.stopTransaction();
}

/**
* Clear any reference to a label element.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.doStop = function() {
  this.label = null;
  go.Tool.prototype.doStop.call(this);
}

/**
* Restore the label's original value for GraphObject.segment... properties.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.doCancel = function() {
  if (this.label !== null) {
    this.label.segmentFraction = this._originalFraction;
  }
  go.Tool.prototype.doCancel.call(this);
}

/**
* During the drag, call updateSegmentOffset in order to set the segment... properties of the label.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.doMouseMove = function() {
  if (!this.isActive) return;
  this.updateSegmentOffset();
}

/**
* At the end of the drag, update the segment properties of the label and finish the tool,
* completing a transaction.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.doMouseUp = function() {
  if (!this.isActive) return;
  this.updateSegmentOffset();
  this.transactionResult = "Shifted Label";
  this.stopTool();
}

/**
* Save the label's GraphObject.segmentFraction at the closest point to the mouse.
* @this {LinkLabelTool}
*/
LinkLabelTool.prototype.updateSegmentOffset = function() {
  var lab = this.label;
  if (lab === null) return;
  var link = lab.part;
  if (!(link instanceof go.Link)) return;

  var last = this.diagram.lastInput.documentPoint;
  // find the fractional distance along the link path closest to this point
  var path = link.path;
  var localpt = path.getLocalPoint(last);
  lab.segmentFraction = path.geometry.getFractionForPoint(localpt);
}

export default LinkLabelTool;
