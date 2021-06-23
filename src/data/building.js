
export default {
	lift:        ['', 3, 3, 3, [
	]],
	container:        ['Container', 10, 5, 3, [
		['belt', true],
		['belt', false],
	]],
	splitter:       ['', 4, 4, 1, [
		['belt', true],
		['belt', false, 0, 'top'],
		['belt', false, 0],
		['belt', false, 0, 'bottom'],
	]],
	merger:        ['', 4, 4, 1, [
		['belt', true, 0, 'top'],
		['belt', true, 0],
		['belt', true, 0, 'bottom'],
		['belt', false]
	]],
	minerMk1:       ['Miner MK.1', 14, 6, 2, [
		['belt', false, 0],
	]],
	smelter:     ['Schmelzer', 9, 6, 2, [
		['belt', true, 0],
		['belt', false, 0]
	]],
	constructor: ['Konstruktor', 10, 8, 2, [
		['belt', true, 0],
		['belt', false, 0]
	]],
	foundry:     ['Giesserei', 9, 10, 2, [
		['belt', true, 0],
		['belt', true, 0],
		['belt', false, -4]
	]],
	assembler:  ['Assembler', 15, 10, 2, [
		['belt', true, 0],
		['belt', true, 0],
		['belt', false, 0]
	]],
	manufacturer:  ['Manufacturer', 19, 18, 2, [
		['belt', true, 0],
		['belt', true, 0],
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
