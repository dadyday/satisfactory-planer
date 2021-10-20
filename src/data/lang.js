import oLang from './lang.json';
import merge from 'deepmerge';

export default merge(oLang, {
	de: {
		name: 'Deutsch',
		foo: 'FuBar!',
		"Erzeuge fehlende Produktion": "Erzeuge fehlende Produktion",
		"Berechnen": "Berechnen",
		"in Digramm übernehmen": "in Digramm übernehmen",
		"Verfügbar": "Verfügbar",
		"Benötigt": "Benötigt",
		"Gegenstände": "Gegenstände",
		"Produktion": "Produktion",
		"Überschuss": "Überschuss",
		"Produziert": "Produziert",
		"Verarbeitet": "Verarbeitet",
		item: {
			null:      '- kein -',
			ironIngot: 'Eisenbarren ',
		},
		receipe: {
			copperOre: "Kupfererz",
			crudeOil: "Rohöl",
		},
	},
	en: {
		name: 'English',
		foo: 'FooBar!',
		"Erzeuge fehlende Produktion": "Create missing production",
		"Berechnen": "Render",
		"in Digramm übernehmen": "Draw diagram",
		"Verfügbar": "Supply",
		"Benötigt": "Demand",
		"Gegenstände": "Items",
		"Produktion": "Production",
		"Überschuss": "Overflow",
		"Produziert": "Produced",
		"Verarbeitet": "Consumed",
		item: {
			null: '- none -'
		},
		receipe: {
			copperOre: "copper ore",
			crudeOil: "crude oil",
		},
	},
});
