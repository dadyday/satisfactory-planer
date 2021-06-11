
export default {
	ironore:   ['Eisenerz', {ironore: 60}, {}, 'miner'],
	copperore: ['Kupfererz', {copperore: 60}, {}, 'miner'],

	ironingot:    ['Eisenbarren', {ironingot: 30}, {ironore: 30}, 'smelter'],
	copperingot:  ['Kupferbarren', {copperingot: 30}, {copperore: 30}, 'smelter'],
	copperingot2: ['Kupferbarren Legierung', {copperingot: 100}, {copperore: 50, ironore:25}, 'foundry'],

	ironplate: ['Eisenplatte', {ironplate: 20}, {ironingot: 30}, 'constructor'],
	ironrod:   ['Eisenstange', {ironrod: 15}, {ironingot: 15}, 'constructor'],
	screw:     ['Schrauben', {screw: 40}, {ironrod: 10}, 'constructor'],
	wire:      ['Draht', {wire: 30}, {copperingot: 15}, 'constructor'],
	cable:     ['Kabel', {cable: 30}, {wire: 60}, 'constructor'],

	reinforced: ['Verstärkte Eisenplatte', {reinforcedironplate:5}, {ironplate:30, screw:60}, 'constructor'],
}