
export default class Entity {

	id = '';
	name = 'none';

	constructor(id, name, oData) {
		this.id = id;
		this.name = name;
		Object.assign(this, oData);
	}

	getName() {
		return this.constructor.translate(this.id);
	}

	//** statics **********************************

	static oI18n;
	static entity = 'entity';
	static mList = new Map();

	static translate(message) {
		return this.oI18n.t(this.entity+'.'+message);
	}

	static register(id, oData) {
		const name = oData.name;
		const oInst = new this(id, name, oData);
		this.mList.set(id, oInst);
	}

	static registerAll(oDataList) {
		Object.entries(oDataList).forEach(([id, oData]) => this.register(id, oData));
		// new Map(Object.entries(oItemData)).forEach((aData, item) => {
		// 	this.register(item, aData);
		// });
	}

	static get(id) {
		return this.mList.get(id) ?? null;
	}

	static getAll() {
		return this.mList;
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
