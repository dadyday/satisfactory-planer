<?php
namespace Planer;

use Nette\Utils\Strings;
use Xparse\Parser;
use Xparse\Value;
use Convert;


class Importer {

	var
		$oDb,
		$aReport = [];

	function __construct($oDb = null) {
		$this->oDb = $oDb ?? new Database;
		$this->oDb->setMapping('building', [
			'construct' => 'Constructor',
		]);

		$this->aReport = [
			'items' => 0,
			'itemNotFound' => [],
			'receipes' => 0,
			'receipeNotFound' => [],
			'buildings' => 0,
			'buildingNotFound' => [],
		];
	}

	function runAll(array $aParam) {
		$oParam = (object) $aParam;
		$path = $oParam->path ?? __DIR__;

		$aBuilding = $oParam->buildings ?? [];
		foreach ($aBuilding as $building) {
			$file = Convert::snake($building);
			$html = file_get_contents($path."/receipe/$file.html");
			$aParsed = $this->parse($html, $oParam->receipeScheme);
			#dump($aParsed);
			$this->runBuilding($building, $aParsed);
		}

		$this->runTier(0, $oParam->initialTier ?? []);
		$aTier = $oParam->tiers ?? [];
		foreach ($aTier as $tier) {
			$html = file_get_contents($path."/milestone/tier$tier.html");
			$aParsed = $this->parse($html, $oParam->milestoneScheme);
			#dump($aParsed);
			$this->runTier($tier, $aParsed);
		}

		$aFluid = $oParam->fluids ?? [];
		foreach ($aFluid as $fluid) {
			$oItem = $this->oDb->get('item', $fluid);
			$oItem->portType = 'pipe';
		}

		$cmp = function($oA, $oB) {
			return
				($oA->milestone ?? 99999) - ($oB->milestone ?? 99999) ?:
				strcmp($oA->name, $oB->name)
			;
		};

		array_sort($this->oDb->getRepo('building'), 'milestone');
		array_sort($this->oDb->getRepo('receipe'), ['alt', 'milestone' => 99999]);
		#array_sort($this->oDb->getRepo('item'), ['milestone', 'ingredient', 'product']);
		array_sort($this->oDb->getRepo('item'), ['milestone' => 99999, 'ingredient', 'product', 'id']);
	}




	function runBuilding($building, $aParsed) {

		$oBuilding = $this->oDb->createOrFail('building', $building, [
			'receipes' => [],
		]);

		$addItem = function($aRet, $name, $count, $time, $out) {
			$oItem = $this->oDb->updateOrCreate('item', $name, [
				'portType' => 'belt',
				($out ? 'product' : 'ingredient') => true,
			]);

			$aRet[$oItem->id] = $count * (60/$time);
			return $aRet;
		};

		foreach($aParsed as $aData) {
			$oReceipe = $this->oDb->createOrFail('receipe', $aData['name'], [
				'alt' => $aData['alt'],
				'building' => $oBuilding->id,
				'out' => array_reduce_assoc($aData['out'], $addItem, [], $aData['time'], true),
				'in' => array_reduce_assoc($aData['in'], $addItem, [], $aData['time'], false),
			]);
			$oBuilding->receipes[] = $oReceipe->id;
		}
		#dump($this);
	}

	function runTier($tier, $aParsed) {

		$oTier = $this->oDb->getOrCreate('tier', $tier, [
			'name' => "Tier $tier",
			'milstones' => [],
		]);

		$relate = function ($oEntity, &$aCollection) use (&$oTier, &$milestoneId) {
			if (!$oEntity) return false;

			$is = $oEntity->milestone ?? 0;
			if (!$is || $is > $milestoneId) {
				$oEntity->tier = $oTier->id;
				$oEntity->milestone = $milestoneId;
				$aCollection[] = $oEntity->id;
			}
			return true;
		};

		foreach($aParsed as $aData) {
			$milestoneId = $oTier->id * 10 + $aData['no'];
			$oMilestone = $this->oDb->createOrFail('milestone', $milestoneId, [
				'name' => $aData['name'],
				'tier' => $oTier->id,
				#	'buildings' => [],
				#	'receipes' => [],
				#	'items' => [],
			]);

			foreach ($aData['scanner'] as $item) {
				$oItem = $this->oDb->get('item', $item);
				if ($relate($oItem, $oMilestone->items)) {
					$this->aReport['items']++;
				}
				else {
					$this->aReport['itemNotFound'][] = $item;
				}
			}

			foreach ($aData['receipes'] as $receipe) {
				$oReceipe = $this->oDb->get('receipe', $receipe);
				if ($relate($oReceipe, $oMilestone->receipes)) {
					foreach ($oReceipe->out as $item => $count) {
						$oItem = $this->oDb->get('item', $item);
						if ($relate($oItem, $oMilestone->items)) {
							$this->aReport['items']++;
						}
						else {
							$this->aReport['itemNotFound'][] = $item;
						}
					}
					$this->aReport['receipes']++;
				}
				else {
					$this->aReport['receipeNotFound'][] = $receipe;
				}
			}

			foreach ($aData['buildings'] as $building) {
				$oBuilding = $this->oDb->get('building', $building);
				if ($relate($oBuilding, $oMilestone->buildings)) {
					$this->aReport['buildings']++;
				}
				else {
					$this->aReport['buildingNotFound'][] = $building;
				}
			}
			$oTier->milstones[] = $milestoneId;
		}
	}

	function parse($html, $oScheme) {
		$oParser = new Parser($oScheme);
		$aParsed = $oParser->parseHtml($html);
		return $aParsed;
	}
}
