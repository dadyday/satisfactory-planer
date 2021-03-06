import oReceipes from './receipe.json';
import merge from 'deepmerge';

export default merge(oReceipes, {
	ironOre:     {name: 'Eisenerz',    building: 'minerMk1',       out: {ironOre:     60}},
	copperOre:   {name: 'Kupfererz',   building: 'minerMk1',       out: {copperOre:   60}},
	limestone:   {name: 'Sandstein',   building: 'minerMk1',       out: {limestone:   60}},
	coal:        {name: 'Kohle',       building: 'minerMk1',       out: {coal:        60}},
	cateriumOre: {name: 'Cateriumerz', building: 'minerMk1',       out: {cateriumOre: 60}},
	rawQuartz:   {name: 'Rowquarz',    building: 'minerMk1',       out: {rawQuartz:   60}},
	sulfur:      {name: 'Schwefel',    building: 'minerMk1',       out: {sulfur:      60}},
	bauxite:     {name: 'Bauxit',      building: 'minerMk1',       out: {bauxite:     60}},
	uranium:     {name: 'Uran',        building: 'minerMk1',       out: {uranium:     60}},
	samOre:      {name: 'SAM',         building: 'minerMk1',       out: {samOre:      60}},
	water:       {name: 'Wasser',      building: 'waterExtractor', out: {water:       60}},
	crudeOil:    {name: 'Rohöl',       building: 'oilExtractor',   out: {crudeOil:    60}},
});

/*
	store: ['container', '', {}, {}],
//*
	ironOre:   ['minerMk1', 'Eisenerz', {ironOre: 60}, {} ],
	copperOre: ['minerMk1', 'Kupfererz', {copperOre: 60}, {} ],
	limestone: ['minerMk1', 'Sandstein', {limestone: 60}, {} ],
	coal:      ['minerMk1', 'Kohle', {coal: 60}, {} ],
	cateriumOre: ['minerMk1', 'Cateriumerz', {cateriumOre: 60}, {} ],
	rawQuartz:   ['minerMk1', 'Rowquarz', {rawQuartz: 60}, {} ],
	sulfur:      ['minerMk1', 'Schwefel', {sulfur: 60}, {} ],
	bauxite:     ['minerMk1', 'Bauxit', {bauxite: 60}, {} ],
	uranium:     ['minerMk1', 'Uran', {uranium: 60}, {} ],
	samOre:      ['minerMk1', 'SAM', {samOre: 60}, {} ],

	water:      ['waterExtractor', 'Wasser', {water: 60}, {} ],
	crudeOil:   ['oilExtractor', 'Rohöl', {crudeOil: 60}, {} ],

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
//	copperRotor: ['assembler', 'Kupfer Rotor', {rotor:11.25}, {copperSheet:22.5, screw:195} ],
//	steelRotor: ['assembler', 'Stahl Rotor', {rotor:5}, {steelPipe:10, wire:30} ],

	crystalOscillator: ['manufacturer', 'Kristall Oszillator', {crystalOscillator: 1}, {quartzCrystal: 18, cable: 14, reinforcedIronPlate: 2.5}, false, 120, 3300, undefined, ],
	insulatedCrystalOscillator: ['manufacturer', 'Isolierter Kristall Oszillator', {crystalOscillator: 1.875}, {quartzCrystal: 18.75, rubber: 13.125, aILimiter: 1.875}, true, 32, 1760, 5, ],

	radioControlSystem: ['manufacturer', 'Radio Control System', {radioControlUnit: 4.5}, {crystalOscillator: 1.5, circuitBoard: 15, aluminumCasing: 90, rubber: 45}, true, 40, 733.33, 7, ],
}
//*/
