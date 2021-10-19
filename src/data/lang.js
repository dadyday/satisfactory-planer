import oLang from './lang.json';
import merge from 'deepmerge';

export default merge(oLang, {
	silentTranslationWarn: true,
	silentFallbackWarn: true,
	de: {
		name: 'Deutsch',
		foo: 'FuBar!',
		item: {
			null:      '- kein -',
			ironIngot: 'Eisenbarren ',
		},
	},
	en: {
		name: 'English',
		foo: 'FooBar!',
		item: {
			null: '- none -'
		},
	},
});
