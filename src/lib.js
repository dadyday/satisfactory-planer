import Receipe from './lib/receipe';
import Scheme from './lib/scheme';
// import { dump } from 'dumper.js';
// import { Constructor, Smelter } from './lib/building';


Receipe.register(new Receipe('Eisenerz', {ironore: 60}, {}, 'Miner'));
Receipe.register(new Receipe('Kupfererz', {copperore: 60}, {}, 'Miner'));

Receipe.register(new Receipe('Eisenbarren', {ironingot: 30}, {ironore: 30}, 'Smelter'));
Receipe.register(new Receipe('Kupferbarren', {copperingot: 30}, {copperore: 30}, 'Smelter'));
Receipe.register(new Receipe('Kupferbarren Legierung', {copperingot: 100}, {copperore: 50, ironore:25}, 'Foundry'));

Receipe.register(new Receipe('Eisenplatte', {ironplate: 20}, {ironingot: 30}, 'Constructor'));
Receipe.register(new Receipe('Eisenstange', {ironrod: 15}, {ironingot: 15}, 'Constructor'));
Receipe.register(new Receipe('Schrauben', {screw: 40}, {ironrod: 10}, 'Constructor'));
Receipe.register(new Receipe('Draht', {wire: 30}, {copperingot: 15}, 'Constructor'));
Receipe.register(new Receipe('Kabel', {cable: 30}, {wire: 60}, 'Constructor'));

Receipe.register(new Receipe('Verstärkte Eisenplatte', {reinforcedironplate:5}, {ironplate:30, screw:60}, 'Constructor'));



export default function run(aItem) {
	const oScheme = new Scheme;
	Object.entries(aItem).forEach(([item, count]) => {
		oScheme.addNeeded(item, count);
	});
	oScheme.calcProduction();
	return oScheme;
}

