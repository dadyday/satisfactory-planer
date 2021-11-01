

export default class Port {

	id = 'in0';
	type = 'belt'; // or pipe
	inOut = true;
	pos = 0;
	offset = 0;
	side = 'left';
	category = 'ibl'; // template selector

	constructor(type, inOut, pos, offset = 0, side = null) {
		//const id = (oPort.inOut ? 'i':'o') + (oPort.type == 'belt' ? 'b':'p') + (p++);
		this.id = (inOut ? 'i' : 'o') + type.charAt(0) + pos;
		this.type = type;
		this.inOut = inOut;
		this.pos = pos;
		this.offset = offset;
		switch (side) {
			case 'top': case 'bottom': case 'left': case 'right':
				this.side = side;
				break;
			case 'above':
			case null:
				this.side = !this.inOut ? 'left' : 'right';
				break;
		}
		this.category = this.side.charAt(0) + this.type.charAt(0) + (inOut ? 'i' : 'o');
	}

	static aType = ['belt', 'pipe'];

	static getTypes() {
		return this.aType;
	}

}
