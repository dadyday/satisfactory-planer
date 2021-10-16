
export default class Entity {

	id = '';

	constructor(id, oData = {}) {
		this.id = id;
		Object.assign(this, oData);
	}

	getName() {
		return this.constructor.translate(this.id);
	}

	//** statics **********************************

	static oI18n;
	static entity;
	static mList;


	static translate(message) {
		return this.oI18n.t(this.entity+'.'+message);
	}

	static register(id, oInst) {
		this.mList.set(id, oInst);
	}

	static registerAll(oDataList) {
		Object.entries(oDataList).forEach(([id, oData]) => {
			const oInst = new this(id, oData);
			this.register(id, oInst);
		});
	}

	static get(id) {
		return this.mList.get(id) ?? null;
	}

	static getAll() {
		return this.mList;
	}

	static each(func) {
		this.mList.forEach(func);
	}

	static getBy(oFilter) {
		return new Map([...this.mList].filter(([key, item]) => {
			for (var index in oFilter) {
				const [, prop, op] = /^(\w+)\s*(in|[<>!=]*)$/.exec(index);
				const is = item[prop];
				const should = oFilter[index];

				switch (op) {
					case '':
						if (is == should) break;
						return false;
					default:
						console.warn(`invalid compare operator '${op}'`);
				}
			}
			return true;
		}));
	}
}
