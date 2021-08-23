import Items from './item.json';
export default {
	...Items,
// iron tier 0
	ironOre:     ['Eisenerz', 'belt', 100],
	copperOre:   ['Kupfererz', 'belt', 100],
	ironIngot:   ['Eisenbarren', 'belt', 100],
	copperIngot: ['Kupferbarren', 'belt', 100],
	ironPlate:   ['Eisenplatte', 'belt', 100],
	ironRod:     ['Eisenstange', 'belt', 100],
	screw:       ['Schrauben', 'belt', 100],

// copper tier 0
	wire:        ['Draht', 'belt', 100],
	cable:       ['Kabel', 'belt', 100],
	reinforced:  ['Verstärkte Eisenplatte', 'belt', 100, 'reinforcedIronPlate'],


	crystalOscillator: ['Crystal Oszillator', 'belt', 100],
	circuitBoard:      ['Schaltkreis', 'belt', 100],
	aluminumCasing:    ['Aluminium Gehäuse', 'belt', 100],
	rubber:            ['Gummi', 'belt', 100],

	radioControlUnit:  ['Radioeinheit', 'belt', 100],
}
