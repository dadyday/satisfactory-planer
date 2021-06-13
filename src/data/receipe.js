
export default {
	ironOre:   ['Eisenerz', {ironOre: 60}, {}, 'minerMk1'],
	copperOre: ['Kupfererz', {copperOre: 60}, {}, 'minerMk1'],

	ironIngot:    ['Eisenbarren', {ironIngot: 30}, {ironOre: 30}, 'smelter'],
	copperIngot:  ['Kupferbarren', {copperIngot: 30}, {copperOre: 30}, 'smelter'],
	copperIngot2: ['Kupferbarren Legierung', {copperIngot: 100}, {copperOre: 50, ironOre:25}, 'foundry'],

	ironPlate: ['Eisenplatte', {ironPlate: 20}, {ironIngot: 30}, 'constructor'],
	ironRod:   ['Eisenstange', {ironRod: 15}, {ironIngot: 15}, 'constructor'],
	screw:     ['Schrauben', {screw: 40}, {ironRod: 10}, 'constructor'],
	wire:      ['Draht', {wire: 30}, {copperIngot: 15}, 'constructor'],
	cable:     ['Kabel', {cable: 30}, {wire: 60}, 'constructor'],

	reinforced: ['Verstärkte Eisenplatte', {reinforced:5}, {ironPlate:30, screw:60}, 'assembler'],
}