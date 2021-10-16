import Entity from './Entity';

export default class Item extends Entity {

	// ingredient = false;
	// product = false;
	// tier = null;
	// milestone = null;

	constructor(id, oData = {}) {
		super(id, oData);

		this.fluid = this.type == 'pipe';
		this.imgName = (this.imgName ?? this.name ?? 'none').replace(/\s+/g, '_').toLowerCase();
		this.image = `img/item/big/${this.imgName}.png`
	}

	imageUrl() {
		return this.image;
	}

	//** statics ****************************

	static entity = 'item';
	static mList = new Map();


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

}
