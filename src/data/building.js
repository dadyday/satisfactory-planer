
export default {
	container: [10, 5, 3, [
		['belt', true],
		['belt', false],
	], 'storage_container'],
	buffer: [6, 6, 3, [
		['pipe', true],
		['pipe', false],
	], 'fluid_buffer'],
	splitter: [4, 4, 1, [
		['belt', true],
		['belt', false, 0, 'top'], ['belt', false, 0], ['belt', false, 0, 'bottom'],
	]],
	merger: [4, 4, 1, [
		['belt', true, 0, 'top'], ['belt', true, 0], ['belt', true, 0, 'bottom'],
		['belt', false],
	]],
	lift: [3, 3, 3, [
	]],
	minerMk1: [14, 6, 3, [
		['belt', false, 0],
	]],
	waterExtractor:   [20, 20, 2, [
		['pipe', false, 0]
	]],
	oilExtractor: [20, 12, 3, [
		['pipe', false, 0],
	]],
	smelter: [9, 6, 2, [
		['belt', true, 0],
		['belt', false, 0],
	]],
	foundry: [9, 10, 2, [
		['belt', true, 0], ['belt', true, 0],
		['belt', false, -1],
	]],
	construct: [10, 8, 2, [
		['belt', true, 0],
		['belt', false, 0],
	], 'constructor'],
	assembler: [15, 10, 2, [
		['belt', true, 0], ['belt', true, 0],
		['belt', false, 0],
	]],
	manufacturer: [19, 18, 2, [
		['belt', true, 0], ['belt', true, 0], ['belt', true, 0], ['belt', true, 0],
		['belt', false, 0],
	]],
	refinery: [20, 10, 2, [
		['belt', true, 0], ['pipe', true, 0],
		['belt', false, 0], ['pipe', false, 0],
	]],
	blender: [16, 18, 2, [
		['pipe', true, 0], ['pipe', true, 0], ['belt', true, 0], ['belt', true, 0],
		['pipe', false, 0], ['belt', false, 0],
	]],
	packager: [8, 8, 2, [
		['belt', true, 0], ['pipe', true, 0, 'above'],
		['belt', false, 0], ['pipe', false, 0, 'above'],
	]],
	particleAccelerator: [24, 38, 2, [
		['pipe', true, 6], ['belt', true, 0],
		['belt', false, 0, 'right'],
	]],
/*
	coal:        ['Kohlekraftwerk', 26, 10, 2, [
		['pipe', true, -2],
		['belt', true, 2]
	]],
*/
};
