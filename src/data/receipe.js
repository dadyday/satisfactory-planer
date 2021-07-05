
export default {
	store: ['container', '', {}, {}],

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

	coatedCable: ['refinery', 'Coated Cable', {cable: 67.5}, {wire: 37.5, heavyOilResidue: 15} ],
	insulatedCable: ['assembler', 'Insulated Cable', {cable: 100}, {wire: 45, rubber: 30} ],
	quickwireCable: ['assembler', 'Quickwire Cable', {cable: 27.5}, {quickwire: 7.5, rubber: 5} ],

	reinforced: ['assembler', 'Verstärkte Eisenplatte', {reinforced:5}, {ironPlate:30, screw:60} ],
	boltedReinforced: ['assembler', 'Verschraubte Eisenplatte', {reinforced:15}, {ironPlate:90, screw:250} ],
	stichedReinforced: ['assembler', 'Gesteppte Eisenplatte', {reinforced:5.625}, {ironPlate:18.75, wire:37.5} ],
	adheredReinforced: ['assembler', 'Verklebte Eisenplatte', {reinforced:3.75}, {ironPlate:11.25, rubber:3.75} ],

	rotor: ['assembler', 'Rotor', {rotor:4}, {ironRod:20, screw:100} ],
	copperRotor: ['assembler', 'Kupfer Rotor', {rotor:11.25}, {copperSheet:22.5, screw:195} ],
	steelRotor: ['assembler', 'Stahl Rotor', {rotor:5}, {steelPipe:10, wire:30} ],

	crystalOscillator: ['manufacturer', 'Kristall Oszillator', {crystalOscillator: 1}, {quartzCrystal: 18, cable: 14, reinforcedIronPlate: 2.5}, false, 120, 3300, undefined, ],
	insulatedCrystalOscillator: ['manufacturer', 'Isolierter Kristall Oszillator', {crystalOscillator: 1.875}, {quartzCrystal: 18.75, rubber: 13.125, aILimiter: 1.875}, true, 32, 1760, 5, ],

	radioControlSystem: ['manufacturer', 'Radio Control System', {radioControlUnit: 4.5}, {crystalOscillator: 1.5, circuitBoard: 15, aluminumCasing: 90, rubber: 45}, true, 40, 733.33, 7, ],
}
