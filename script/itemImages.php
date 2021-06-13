<?php
$url = 'https://satisfactory.fandom.com/wiki/Category:Item_icons';
$content = file_get_contents($url);
preg_match_all('~'.$imgBase.'/\w/\w\w/(.*)\.png/.*/scale-to-width-down/~', $content, $aMatches, PREG_SET_ORDER);

return $aMatches;