<?php
require_once __DIR__.'/../vendor/autoload.php';

class Convert extends Jawira\CaseConverter\Convert {
	static function __callStatic($func, $aArg) {
		$func = 'to'.ucfirst($func);
		if (is_null($aArg[0])) return null;
		$oInst = new static($aArg[0]);
		return $oInst->$func();
	}
}

function array_reduce_assoc(array $array, callable $callback, $initial = null, ...$aParam) {
	foreach ($array as $key => $value) {
		$initial = $callback($initial, $key, $value, ...$aParam);
	}
	return $initial;
}

function array_sort(array &$array, $callback = null) {
	if (count($array) < 2) return;
	if (!is_callable($callback)) {
		if (is_string($callback)) $callback = [$callback];

		$aProp = [];
		foreach ($callback as $prop => $default) {
			if (is_numeric($prop)) {
				$prop = $default;
				$default = null;
			}
			$rev = 1;
			if ($prop[0] == '!') {
				$prop = substr($prop, 1);
				$rev = -1;
			}
			$aProp[$prop] = [$rev, $default];
		}

		$callback = function($a, $b) use ($aProp) {
			foreach ($aProp as $prop => $aOption) {
				[$rev, $default] = $aOption;
				$ret = strnatcmp($a->$prop ?? $default, $b->$prop ?? $default);
				if ($ret) return $ret;
			}
			return 0;
		};
	/*
		# inspect type of item
		$item = current($array);
		if (is_object($item)) {
			$cmp = function ($a, $b) use (&$prop, &$default) {
				return strnatcmp($a->$prop ?? $default, $b->$prop ?? $default);
			};
		}
		else throw new \Exception('unknown item type');

		# inspect callback type
		if (is_string($callback)) $callback = [$callback];
		if (is_array($callback)) {
			$aProp = [];
			foreach ($callback as $prop => $default) {
				if (is_numeric($prop)) {
					$prop = $default;
					$default = null;
				}
				if ($prop[0] == '!') {
					$prop = substr($prop, 1);
					$aProp[$prop] = function ($a, $b) use ($cmp) {
						return -$cmp($a, $b);
					};
				}
				else {
					$aProp[$prop] = $cmp;
				}
			}
			bdump($aProp);
			$callback = function ($a, $b) use ($aProp) {
				foreach ($aProp as $prop => $compare) {
					$ret = $compare($a, $b);
					if ($ret) return $ret;
				}
				return 0;
			};
		}
	*/
	}
	uasort($array, $callback);
}

Tracy\Debugger::enable();
Tracy\Debugger::$maxDepth = 8;
Tracy\Debugger::$maxLength = 1000;
Tracy\Debugger::$strictMode = false;
