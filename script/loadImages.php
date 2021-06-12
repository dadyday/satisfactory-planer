<?php
$url = 'https://satisfactory.fandom.com/wiki/Category:Item_icons';
$index = file_get_contents($url);
preg_match_all('~https:.*images/\w/\w\w/(\w+).png/.*/scale-to-width-down/~', $index, $aMatches, PREG_SET_ORDER);

foreach ($aMatches as $i => $aMatch) {
	[$url, $name] = $aMatch;
	$name = strtolower($name);
	$content = file_get_contents($url.'120');
	file_put_contents("./img/$name.png", $content);
	//if ($i > 5) break;
}


