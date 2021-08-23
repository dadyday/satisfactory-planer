<?php
# https://satisfactory.fandom.com/wiki/Category:Icons
$imgBase = 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images';

#$url = 'https://satisfactory.fandom.com/wiki/Category:Item_icons';
#$url = 'https://satisfactory.fandom.com/wiki/Category:Fluid_icons';
#$size = 120;

$url = 'https://satisfactory.fandom.com/wiki/Category:Building_icons';
$size = 256;
$aFilter = [
	'assembler',
	'blender',
	'constructor',
	'foundry',
	'manufacturer',
	'miner_mk.1',
	'miner_mk.2',
	'miner_mk.3',
	'oil_extractor',
	'packager',
	'particle_accelerator',
	'refinery',
	'resource_well_pressurizer',
	'resource_well_extractor',
	'smelter',
	'water_extractor',
	'storage_container',
	'industrial_storage_container',
	'fluid_buffer',
	'industrial_fluid_buffer',
	'conveyor_merger',
	'conveyor_splitter',
];

$content = file_get_contents($url);
preg_match_all('~src="('.$imgBase.'/\w/\w\w/(.*)\.png/.*/scale-to-width-down/)~', $content, $aMatches, PREG_SET_ORDER);

foreach ($aMatches as $i => $aMatch) {

	#var_dump($aMatch); exit;
	[, $url, $name] = $aMatch;
	$name = strtolower($name);
	if (!in_array($name, $aFilter)) continue;

	$content = file_get_contents($url.$size);
	file_put_contents(__DIR__."/img/$name.png", $content);
	//if ($i > 5) break;
}
