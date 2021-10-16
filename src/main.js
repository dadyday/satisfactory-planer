import Vue from 'vue';
import App from './App.vue';
import _ from 'underscore';
import numberFormat from './utils/numberFormat';
// import 'normalize.css';
// import '@/scss/main.scss';

Map.prototype.getInit = function (key, initValue = null) {
	if (!this.has(key)) this.set(key, initValue);
	return this.get(key);
};
Map.prototype.setDefault = function (key, defaultValue = null) {
	if (!this.has(key)) this.set(key, defaultValue);
};
const compareValue = (item, property) => {
	var value = null;
	switch (typeof property) {
		case 'function':
			value = property(item);
			break;
		case 'string':
		case 'integer':
			value = item[property];
			if (typeof value == 'undefined') {
				console.error(`item has no property '${property}'`, item);
			}
			else {
				value = typeof value  == 'function' ? value.apply(item) : value;
			}
			break;
	}
	return value;
};

const compare =	(oL, oR, properties) => {
	for (var property of properties) {
		var rev = false;
		switch (typeof property) {
			case 'string':
				rev = property.substring(0,1) == '!';
				property = rev ? property.substring(1) : property;
				break;
		}
		oL = compareValue(oL, property);
		oR = compareValue(oR, property);
		if (oL != oR) {
			const ret = rev ^ oL > oR ? -1 : 1;
			return ret;
		}
	}
	return 0;
};

Map.prototype.sortBy = function (properties) {
	const aTemp = Array.from(this.entries());
	aTemp.sort((l, r) => compare(l[1], r[1], properties));
	return new Map(aTemp);
};

Array.prototype.sortBy = function (properties) {
	console.log(properties, this);
	return this.sort((l, r) => compare(l, r, properties));
};
// Object.prototype.sort = function (properties) {
// 	const aTemp = Array.from(this.values());
// 	aTemp.sort((l, r) => compare(l, r, properties));
// 	return new Object(aTemp);
// };


Number.prototype.minMax = function (min, max) {
	return Math.min(Math.max(this, min), max);
}
Number.prototype.rationalize = function (epsilon = 0.001) {
	return numberFormat.precise(this, 2);
}

Vue.config.productionTip = false
Vue.prototype.$dump = window.$dump = console.log;
//(...arg) => {
/*
	var origPrepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	var stack = (new Error()).stack[1];
	Error.prepareStackTrace = origPrepareStackTrace

	console.log(stack.getFileName())
	//console.log(().stack.split("\n"))
	const [, filepath, line, column] = /\((.*):(\d+):(\d+)\)$/.exec((new Error()).stack.split("\n")[3]);
	console.log(filepath+'#'+line, ...arg);
*/
//	console.log(...arg);
//	return arg[0];
//};
Vue.prototype.$_ = window.$_ = _;
Vue.prototype.$log = (...args) => { console.log(args); return args[0]; };

import Wrap from "./utils/wrap.js";
Vue.component("Wrap", Wrap);
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
Vue.component("Split", Splitpanes);
Vue.component("Pane", Pane);

import messages from './data/lang';
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'de',
  fallbackLocale: 'en',
  messages,
});

import initData from './data';
initData(i18n);

new Vue({
	i18n,
	render: h => h(App),
}).$mount('#app')
