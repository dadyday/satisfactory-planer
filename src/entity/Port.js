

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
		this.side = side ? side : (inOut ? 'left' : 'right');
	}

}
