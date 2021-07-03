
import Building from './entity/Building';
import aBuildingData from './data/building';
Building.registerAll(aBuildingData);

import Receipe from './entity/Receipe';
import aReceipeData from './data/receipe';
Receipe.registerAll(aReceipeData);

import Item from './entity/Item';
import aItemData from './data/item';
Item.registerAll(aItemData);

import Scheme from './entity/Scheme';
import Production from './entity/Production';

export {
	Building,
	Receipe,
	Item,
	Scheme,
	Production,
};
