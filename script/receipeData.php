<?php
require_once __DIR__.'/../vendor/autoload.php';

use Nette\Utils\Strings;
use Nette\Utils\Json;

class Convert extends Jawira\CaseConverter\Convert {
	static function __callStatic($func, $aArg) {
		$func = 'to'.ucfirst($func);
		$oInst = new static($aArg[0]);
		return $oInst->$func();
	}
}

function array_reduce_assoc(array $array, callable $callback, $initial = null) {
	foreach ($array as $key => $value) {
		$initial = $callback($initial, $key, $value);
	}
	return $initial;
}

Tracy\Debugger::enable();
Tracy\Debugger::$maxDepth = 5;


$oParser = new ReceipeParser;
$oParser->runAll([
	'Construct',
	'Assembler',
	'Manufacturer',
	'Smelter',
	'Foundry',
	'Refinery',
	'Blender',
	'Packager',
	'Particle Accelerator',
]);
#dump($oParser);
$oParser->export(__dir__.'/_temp');


class ReceipeParser {

	var $aReceipe = [];
	var $aItem = [];
	var $aFluid = [
		'Water', 'Crude Oil', 'Heavy Oil Residue', 'Fuel', 'Turbofuel', 'Liquid Biofuel',
		'Alumina Solution', 'Sulfuric Acid', 'Nitrogen Gas', 'Nitric Acid',
	];

	function export($path) {
		if (!is_dir($path)) mkdir($path, 0777, true);
		file_put_contents($path.'/receipe.json', Json::encode($this->aReceipe, Json::PRETTY));
		file_put_contents($path.'/item.json', Json::encode($this->aItem, Json::PRETTY));
	}

	function runAll($aBuilding) {
		foreach ($aBuilding as $building) {
			$this->run($building);
		}
	}

	function run($building) {
		$key = Convert::camel($building);
		$file = Convert::snake($building);
		$html = file_get_contents(__DIR__."/receipe/$file.html");
		$aParsed = $this->parse($html);
		$this->process($key, $aParsed);
	}

	function process($building, $aParsed) {
		$time = 0;
		$addItem = function($aIn, $name, $count) use (&$time) {
			$key = Convert::camel($name);
			if (!isset($this->aItem[$key])) {
				$type = in_array($name, $this->aFluid) ? 'pipe' : 'belt';
				$this->aItem[$key] = [$name, $type, null];
			}
			$aIn[$key] = $count * $time;
			return $aIn;
		};

		foreach($aParsed as $aProp) {
			$time = $aProp['time'];

			$aIn = array_reduce_assoc($aProp['in'], $addItem, []);
			$aOut = array_reduce_assoc($aProp['out'], $addItem, []);

			$name = $aProp['name'];
			$key = Convert::camel($name);
			$this->aReceipe[$key] = [$building, $name, $aOut, $aIn];
		}
	}

	function parse($html) {
		$oDom = new DOMDocument();
		$oDom->loadHTML($html);

		$aParsed = [];
		$oTable = simplexml_import_dom($oDom->documentElement)->body->table;
		foreach ($oTable->tbody->tr as $oTr) {
			if (!$oTr->td) continue;
			$name = trim($oTr->td[0]);
			$time = (int) $oTr->td[1];

			$aIn = []; $i = 0;
			foreach ($oTr->td[2]->b as $oB) {
				$cnt = (int) $oB;
				$nm = (string) $oTr->td[2]->span[$i*2]->a[1];
				#print_r([$cnt, $nm]);
				$aIn[$nm] = $cnt;
				$i++;
			};

			$aOut = []; $i = 0;
			foreach ($oTr->td[3]->b as $oB) {
				$cnt = (int) $oB;
				$nm = (string) $oTr->td[3]->span[$i*2]->a[1];
				#print_r([$cnt, $nm]);
				$aOut[$nm] = $cnt;
				$i++;
			};

			#print_r([$name, $time, $aIn, $aOut]);
			$aParsed[] = [
				'name' => $name,
				'time' => $time,
				'in' => $aIn,
				'out' => $aOut,
			];
		}
		#print_r($aParsed);
		return $aParsed;
	}
}
