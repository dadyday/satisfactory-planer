

export default class Port {

	id = 'in0';
	type = 'belt'; // or pipe
	inOut = true;
	pos = 0;
	offset = 0;
	side = 'left';

	constructor(type, inOut, pos, offset = 0, side = null) {
		this.id = (inOut ? 'in' : 'out') + pos;
		this.type = type;
		this.inOut = inOut;
		this.pos = pos;
		this.offset = offset;
		switch (side) {
			case 'top':
			case 'bottom':
			case 'left':
			case 'right':
				this.side = side;
				break;
			case 'above':
			case null:
				this.side = !inOut ? 'left' : 'right';
				break;
		}
	}

	static aType = ['belt', 'pipe'];

	static getTypes() {
		return this.aType;
	}

}
