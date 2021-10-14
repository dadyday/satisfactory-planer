<?php
require_once __DIR__.'/cfg.php';

use Planer\Entity;

class Collection extends ArrayObject {
	function sort(...$aArg) {

	}

	function add($oEntity) {
		$this->append($oEntity);
	}
}

class ArrayDriver {

	var $aEntity = [];

	function registerEntity($class) {
		$this->aEntity[$class] = [];
	}

	function save($class, $id, $oEntity) {
		if (!isset($this->aEntity[$class])) {
			throw new \Exception("entity '$class' not registered");
		}
		if (is_null($id)) $id = count($this->aEntity[$class])+1;
		$this->aEntity[$class][$id] = (array) $oEntity;
	}

	function findBy($class, $field, $op, $value) {
		$oRet = new Collection;

		$compare = function($aData, $value) use ($field, $op) {
			switch ($op) {
				case '=': return $aData[$field] == $value;
				case '!=':
				case '<>': return $aData[$field] != $value;
				case '<': return $aData[$field] < $value;
				case '<=': return $aData[$field] <= $value;
				case '>=': return $aData[$field] >= $value;
				case '>': return $aData[$field] > $value;
				case 'has': return in_array($value, $aData[$field]);
				case 'in': return in_array($aData[$field], $value);
			}
			throw new \Exception("operation '$op' not defined");
		};

		if (!isset($this->aEntity[$class])) {
			throw new \Exception("entity '$class' not registered");
		}
		foreach ($this->aEntity[$class] as $aData) {
			if ($compare($aData, $value)) {
				$oEntity = (object) $aData;
				$oRet->add($oEntity);
			}
		}
		return $oRet;
	}
}

$oDriver = new ArrayDriver;
Entity\Item::registerDriver($oDriver);
Entity\Receipe::registerDriver($oDriver);

$oItem = new Entity\Item;
$oItem->_id = 'water';
$oItem->tier = 0;
$oItem->save();

$oItem2 = new Entity\Item;
$oItem2->_id = 'ice';
$oItem->tier = 0;
$oItem2->save();

$oReceipe = new Entity\Receipe;
$oReceipe->_id = 'freeze';
$oReceipe->input['water'] = 4;
$oReceipe->output['ice'] = 5;
$oReceipe->save();

$oItems = $oItem->find('tier', 0);
dump($oItems);

dump($oItem->needed);
dump($oItem2->receipes);
dump($oDriver);
