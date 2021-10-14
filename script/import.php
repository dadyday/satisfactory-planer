<?php
namespace Planer;
require_once __DIR__.'/cfg.php';

use Xparse\Value;

$aParam = [
	'path' => __DIR__.'/data/',
	'buildings' => [
	//	'Water Extractor', 'Oil Extractor',
		'Construct', 'Assembler', 'Manufacturer', 'Smelter', 'Foundry',
		'Refinery', 'Blender', 'Packager', 'Particle Accelerator'
	],
	'fluids' => [
		'Water', 'Crude Oil', 'Heavy Oil Residue', 'Fuel', 'Turbofuel', 'Liquid Biofuel',
		'Alumina Solution', 'Sulfuric Acid', 'Nitrogen Gas', 'Nitric Acid',
	],
	'tiers' => range(0, 8),
	'initialTier' => [
		[
			'no' => 0,
			'name' => 'HUB',
			'time' => '00:00',
			'buildings' => [
				'Construct',
			],
			'receipes' => [
				'Iron Ingot',
				'Iron Plate',
				'Iron Rod',
			],
			'scanner' => [
				'Iron Ore',
			],
			'needs' => [
				'Iron Rod' => 20,
				'Iron Plate' => 10,
			],
		],
	],
];

$aParam['receipeScheme'] = Value::list('body/table/tbody/tr[td]', [
	'name' => Value::str('td[1]/text()[normalize-space()]'),
	'time' => Value::int('td[2]'),
	'alt' => Value::bool('td[1]/a/span'),
	'out' => Value::map('td[4]/b',
		Value::str('following-sibling::span/a[2]'),
		Value::num('.')
	),
	'in' => Value::map('td[3]/b',
		Value::str('following-sibling::span/a[2]'),
		Value::num('.')
	),
]);
$aParam['milestoneScheme'] = Value::list('body/table/tbody/tr[@class="firstRow"]', [
	'no' => Value::int('td[1]'),
	'name' => Value::str('td[2]/text()'),
	'time' => Value::str('td[4]'),
	'buildings' => Value::list('td[5]/span[preceding-sibling::b[1][text()="Buildings:"]]', 'a[2]'),
	'receipes' => Value::list('td[5]/span[preceding-sibling::b[1][text()="Recipes:"]]', 'a[2]'),
	'scanner' => Value::list('td[5]/span[preceding-sibling::b[1][text()="Scanner Update:"]]', 'a[2]'),
	'needs' => Value::map('following-sibling::tr[position() < preceding-sibling::tr[@class="firstRow"][1]/td[1]/@rowspan]/td[1]|td[3]',
		'span/a[2]',
		Value::num('text()[1]')
	),
]);

$oDb = new Database;
$oImporter = new Importer($oDb);
$oImporter->runAll($aParam);
dump($oImporter);

$oDb->export(__DIR__.'/_temp');
dump($oDb);

#$aUnAssigned = array_filter($oImporter->aItem, function($oItem) { return !isset($oItem->tier); });
#dump($aUnAssigned);
