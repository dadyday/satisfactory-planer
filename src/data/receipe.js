
export default {
	ironOre:   ['minerMk1', 'Eisenerz', {ironOre: 60}, {} ],
	copperOre: ['minerMk1', 'Kupfererz', {copperOre: 60}, {} ],

	ironIngot:    ['smelter', 'Eisenbarren', {ironIngot: 30}, {ironOre: 30} ],
	copperIngot:  ['smelter', 'Kupferbarren', {copperIngot: 30}, {copperOre: 30} ],
	copperIngot2: ['foundry', 'Kupferbarren Legierung', {copperIngot: 100}, {copperOre: 50, ironOre:25} ],

	ironPlate: ['construct', 'Eisenplatte', {ironPlate: 20}, {ironIngot: 30} ],
	ironRod:   ['construct', 'Eisenstange', {ironRod: 15}, {ironIngot: 15} ],
	screw:     ['construct', 'Schrauben', {screw: 40}, {ironRod: 10} ],
	wire:      ['construct', 'Draht', {wire: 30}, {copperIngot: 15} ],
	cable:     ['construct', 'Kabel', {cable: 30}, {wire: 60} ],

	reinforced: ['assembler', 'Verstärkte Eisenplatte', {reinforced:5}, {ironPlate:30, screw:60} ],
}
