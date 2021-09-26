<?php
namespace Planer;

use Nette\Utils\Json;


class Database {

	var $aMapping = [];
	var $aEntity;

	function idOf($entity, $name) {
		if ($id = array_search($name, $this->aMapping[$entity] ?? [])) return $id;
		return is_numeric($name) ? (int) $name : preg_replace('~\W+~', '', \Convert::camel($name));
	}
	function nameOf($entity, $id) {
		if ($name = $this->aMapping[$entity][$id] ?? null) return $name;
		return is_numeric($id) ? "$entity $id" : $id;
	}
	function &getRepo($entity) {
		return $this->aEntity[$entity];
	}

	function setMapping($entity, $aMapping) {
		$this->aMapping[$entity] = $aMapping;
	}

	function export($path) {
		if (!is_dir($path)) mkdir($path, 0777, true);
		foreach ($this->aEntity as $entity => $aRepo) {
			$file = "$path/$entity.json";
			$aRepo = $this->getRepo($entity);
			file_put_contents($file, Json::encode($aRepo, Json::PRETTY));
		}
	}

	protected function uow($flags, $entity, $name, $aProp = []) {
		$repo =& $this->getRepo($entity);
		$id = $this->idOf($entity, $name);

		#read
		$oEntity = $repo[$id] ?? null;
		$op = $flags[0];

		if ($op == 'c' xor !$oEntity) {
			$op = $flags[1] ?? null;
		}

		switch ($op) {
			case 'g':
				break;
			case 'd':
				unset($repo[$id]);
				break;
			case 'u':
				$aProp = \array_merge((array) $oEntity ?? [], $aProp);
				$repo[$id] = $oEntity = (object) $aProp;
				break;
			case 'r':
			case 'c':
				$aProp = \array_merge(['id' => $id, 'name' => $this->nameOf($entity, $name)], $aProp);
				$repo[$id] = $oEntity = (object) $aProp;
				break;
			case '!':
				$attr = !$oEntity ? 'not' : 'already';
				throw new \Exception("Entity '$id' $attr exists");
			default:
				$oEntity = null;
		}
		return $oEntity;
	}

	# must exists
	function get($entity, $name) {
		return $this->uow('g', $entity, $name);
	}
	function getOrFail($entity, $name) {
		return $this->uow('g!', $entity, $name);
	}
	function getOrCreate($entity, $name, $aProp) {
		return $this->uow('gc', $entity, $name, $aProp);
	}

	# must not exists
	function create($entity, $name, $aProp) {
		return $this->uow('c', $entity, $name, $aProp);
	}
	function createOrFail($entity, $name, $aProp) {
		return $this->uow('c!', $entity, $name, $aProp);
	}
	function createOrReplace($entity, $name, $aProp) {
		return $this->uow('rc', $entity, $name, $aProp);
	}

	function replace($entity, $name, $aProp) {
		return $this->uow('r', $entity, $name, $aProp);
	}
	function replaceOrFail($entity, $name, $aProp) {
		return $this->uow('r!', $entity, $name, $aProp);
	}
	function replaceOrCreate($entity, $name, $aProp) {
		return $this->uow('rc', $entity, $name, $aProp);
	}

	# must exists
	function update($entity, $name, $aProp) {
		return $this->uow('u', $entity, $name, $aProp);
	}
	function updateOrFail($entity, $name, $aProp) {
		return $this->uow('u!', $entity, $name, $aProp);
	}
	function updateOrCreate($entity, $name, $aProp) {
		return $this->uow('uc', $entity, $name, $aProp);
	}

	function delete($entity, $name) {
		return $this->uow('d', $entity, $name);
	}
	function deleteOrFail($entity, $name) {
		return $this->uow('d!', $entity, $name);
	}

}
