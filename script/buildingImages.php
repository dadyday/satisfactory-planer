<?php
# https://satisfactory.fandom.com/wiki/Category:Production_buildings
# https://satisfactory.fandom.com/wiki/Category:Building_icons

$aBuilding = [
	'Assembler',
	'Blender',
	'Constructor',
	'Foundry',
	'Manufacturer',
	'Miner Mk.1',
	'Miner Mk.2',
	'Miner Mk.3',
	'Oil Extractor',
	'Packager',
	'Particle Accelerator',
	'Refinery',
	'Resource Well Pressurizer',
	'Smelter',
	'Water Extractor',
	'Storage Container',
	'Conveyor Merger',
	'Conveyor Splitter',
];

foreach ($aBuilding as &$item) {
	$name = strtr($item, [' ' => '_', '.' => '']);
	$url = "https://satisfactory.fandom.com/wiki/$name";
	$content = file_get_contents($url);

	# https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/6/6d/Refinery.png/revision/latest/scale-to-width-down/120?cb=20201110180115
	if (preg_match('~<img.*src="('.$imgBase.'/\w/\w\w/'.$name.'.png/.*/scale-to-width-down/)128~', $content, $aMatch)) {
		//print_r($aMatch);
		$item = [
			$aMatch[0],
			$aMatch[1],
			$name,
		];
	};
}

return $aBuilding;

/*$aMatches = [
	[
		'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/6/61/Constructor.png/revision/latest/scale-to-width-down/',
		'Constructor'
	],
	[
		'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/a/ae/Assembler.png/revision/latest/scale-to-width-down/',
		'Assembler'
	],
	[
		'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/0/0b/Manufacturer.png/revision/latest/scale-to-width-down/',
		'Manufacturer'
	],
];
*/
