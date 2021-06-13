<?php
$imgBase = 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images';

//$aMatches = include(__DIR__.'/itemImages.php');
$aMatches = include(__DIR__.'/buildingImages.php');

foreach ($aMatches as $i => $aMatch) {
	[$url, $name] = $aMatch;
	$name = strtolower($name);
	$content = file_get_contents($url.'120');
	file_put_contents("./img/$name.png", $content);
	//if ($i > 5) break;
}


