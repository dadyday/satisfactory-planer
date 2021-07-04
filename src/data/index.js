console.log('data!');
import {
	Building,
	Receipe,
	Item,
} from '../entity';

import aBuildingData from './building';
import aReceipeData from './receipe';
import aItemData from './item';

export default () => {
	Building.registerAll(aBuildingData);
	Receipe.registerAll(aReceipeData);
	Item.registerAll(aItemData);
};
