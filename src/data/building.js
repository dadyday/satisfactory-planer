
export default {
	container: ['Container', 10, 5, 3, [
		['belt', true],
		['belt', false],
	], 'storage_container'],
	buffer: ['Füssigspeicher', 6, 6, 3, [
		['pipe', true],
		['pipe', false],
	], 'fluid_buffer'],
	splitter: ['', 4, 4, 1, [
		['belt', true],
		['belt', false, 0, 'top'], ['belt', false, 0], ['belt', false, 0, 'bottom'],
	]],
	merger: ['', 4, 4, 1, [
		['belt', true, 0, 'top'], ['belt', true, 0], ['belt', true, 0, 'bottom'],
		['belt', false],
	]],
	lift: ['', 3, 3, 3, [
	]],
	minerMk1: ['Miner MK.1', 14, 6, 3, [
		['belt', false, 0],
	]],
	waterExtractor:   ['Wasser', 20, 20, 2, [
		['pipe', false, 0]
	]],
	oilExtractor: ['Öl Förderer', 20, 12, 3, [
		['pipe', false, 0],
	]],
	smelter: ['Schmelzer', 9, 6, 2, [
		['belt', true, 0],
		['belt', false, 0],
	]],
	foundry: ['Giesserei', 9, 10, 2, [
		['belt', true, 0], ['belt', true, 0],
		['belt', false, -1],
	]],
	construct: ['Konstruktor', 10, 8, 2, [
		['belt', true, 0],
		['belt', false, 0],
	], 'constructor'],
	assembler: ['Assembler', 15, 10, 2, [
		['belt', true, 0], ['belt', true, 0],
		['belt', false, 0],
	]],
	manufacturer: ['Manufacturer', 19, 18, 2, [
		['belt', true, 0], ['belt', true, 0], ['belt', true, 0], ['belt', true, 0],
		['belt', false, 0],
	]],
	refinery: ['Raffinerie', 20, 10, 2, [
		['belt', true, 0], ['pipe', true, 0],
		['belt', false, 0], ['pipe', false, 0],
	]],
	blender: ['Blender', 16, 18, 2, [
		['pipe', true, 0], ['pipe', true, 0], ['belt', true, 0], ['belt', true, 0],
		['pipe', false, 0], ['belt', false, 0],
	]],
	packager: ['Packager', 8, 8, 2, [
		['belt', true, 0], ['pipe', true, 0, 'above'],
		['belt', false, 0], ['pipe', false, 0, 'above'],
	]],
	particleAccelerator: ['Particle Accelerator', 24, 38, 2, [
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
