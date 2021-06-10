import BuildingType from './BuildingType';
import PortType from './PortType';

BuildingType.registerAll({
	lift: new BuildingType('', 3, 3, [
	], [
	], 3),
	split: new BuildingType('', 4, 4, [
		new PortType('belt', true),
	], [
		new PortType('belt', false, 0, 'top'),
		new PortType('belt', false, 0),
		new PortType('belt', false, 0, 'bottom'),
	], 1),
	join: new BuildingType('', 4, 4, [
		new PortType('belt', true, 0, 'top'),
		new PortType('belt', true, 0),
		new PortType('belt', true, 0, 'bottom'),
	], [
		new PortType('belt', false),
	], 1),
	miner: new BuildingType('Miner', 14, 6, [
	], [
		new PortType('belt', false, 0),
	]),
	smelter: new BuildingType('Smelter', 9, 6, [
		new PortType('belt', true, 0),
	], [
		new PortType('belt', false, 0),
	]),
	constructor: new BuildingType('Construct', 10, 8, [
		new PortType('belt', true, 0),
	], [
		new PortType('belt', false, 0),
	]),
	foundry: new BuildingType('Foundry', 10, 10, [
		new PortType('belt', true, -2),
		new PortType('belt', true, +2),
	], [
		new PortType('belt', false, 0),
	]),
	manufactor: new BuildingType('Manufactor', 15, 10, [
		new PortType('belt', true, 0),
		new PortType('belt', true, 0),
	], [
		new PortType('belt', false, 0),
	]),
	extractor: new BuildingType('Extractor', 20, 20, [
	], [
		new PortType('pipe', false, 0),
	]),
	coal: new BuildingType('Kohlekraftwerk', 26, 10, [
		new PortType('pipe', true, -2),
		new PortType('belt', true, 2),
	], [
	]),
});
