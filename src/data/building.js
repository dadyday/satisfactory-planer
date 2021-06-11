
export default {
	lift:        ['', 3, 3, 3, [
	]],
	split:       ['', 4, 4, 1, [
		['belt', true], 
		['belt', false, 0, 'top'], 
		['belt', false, 0],
		['belt', false, 0, 'bottom'],
	]],
	join:        ['', 4, 4, 1, [
		['belt', true, 0, 'top'], 
		['belt', true, 0], 
		['belt', true, 0, 'bottom'], 
		['belt', false]
	]],
	miner:       ['Mine', 14, 6, 2, [
		['belt', false, 0],
	]],
	smelter:     ['Schmelzer', 9, 6, 2, [
		['belt', true, 0], 
		['belt', false, 0]
	]],
	constructor: ['Konstrukt.', 10, 8, 2, [
		['belt', true, 0], 
		['belt', false, 0]
	]],
	foundry:     ['Giesserei', 10, 10, 2, [
		['belt', true, -2], 
		['belt', true, +2], 
		['belt', false, 0]
	]],
	manufactor:  ['Manufactor', 15, 10, 2, [
		['belt', true, 0], 
		['belt', true, 0], 
		['belt', false, 0]
	]],
/*
	extractor:   ['Wasser', 20, 20, 2, [
		['pipe', false, 0]
	]],
	coal:        ['Kohlekraftwerk', 26, 10, 2, [
		['pipe', true, -2], 
		['belt', true, 2]
	]],
*/
};