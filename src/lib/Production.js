
export default class Production {
	id = null;
	oBuilding;
	name = '';
	oReceipe;
	productivity = 1.0;
	
	constructor(oBuilding, oReceipe) {
		this.oBuilding = oBuilding;
		this.name = oReceipe.name;
		this.oReceipe = oReceipe;
	}

	getNodeData(id) {
		this.id = this.name+id;
		return this.oBuilding.getNodeData(this.id);
	}

}
