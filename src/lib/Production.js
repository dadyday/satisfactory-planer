
export default class Production {
	oBuilding;
	name = '';
	oReceipe;
	productivity = 1.0;
	
	constructor(oBuilding, oReceipe) {
		this.oBuilding = oBuilding;
		this.name = oReceipe.name;
		this.oReceipe = oReceipe;
	}

}
