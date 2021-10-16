import Entity from './Entity';

export default class Item extends Entity {

	static entity = 'item';

	// ingredient = false;
	// product = false;
	// tier = null;
	// milestone = null;

	constructor(id, name, oData = {}) {
		super(id, name, oData);

		this.fluid = this.type == 'pipe';
		this.imgName = (this.imgName ?? this.name).replace(/\s+/g, '_').toLowerCase();
		this.image = `img/item/big/${this.imgName}.png`
	}

	imageUrl() {
		return this.image;
	}

	static get(id) {
		return super.get(id) ?? new this(null, 'none');
	}

	static getTierGroups() {
		const mTier = new Map;
		this.each((item) => {
			if (!mTier.has(item.tier)) {
				mTier.set(item.tier, {
					tier: 'Tier '+item.tier,
					items: [],
				});
			}
			mTier.get(item.tier).items.push(item);
		});
		return mTier;
	}

	static each(func) {
		this.mList.forEach(func);
	}
}
