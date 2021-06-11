
export default class Building {
	oBuildingType;
	name = '';
	oReceipe;
	productivity = 1.0;
	
	constructor(oBuildingType, oReceipe) {
		this.oBuildingType = oBuildingType;
		this.name = oReceipe.name;
		this.oReceipe = oReceipe;
	}

}
