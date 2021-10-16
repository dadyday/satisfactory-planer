console.log('data!');
import {
	Entity,
	Building,
	Receipe,
	Item,
} from '../entity';

import aBuildingData from './building';
import aReceipeData from './receipe';
import aItemData from './item';

export default (i18n) => {
	Building.registerAll(aBuildingData);
	Receipe.registerAll(aReceipeData);

	Item.oI18n = i18n;
	Item.registerAll(aItemData);
};
