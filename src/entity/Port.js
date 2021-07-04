
export default class Port {

	pos;
	type = null;
	inOut = null;
	offset = null;
	side = null;

	constructor(type, inOut, pos, offset = 0, side = null) {
		this.type = type;
		this.inOut = inOut;
		this.pos = pos;
		this.offset = offset;
		this.side = side ? side : (inOut ? 'left' : 'right');
	}

}
