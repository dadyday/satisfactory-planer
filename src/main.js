import Vue from 'vue';
import App from './App.vue';
import initData from './data';
import _ from 'underscore';
import bigRat from 'big-rational';
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
			value = typeof item[property] == 'function' ? item[property]() : item[property];
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

	var num = this;
	if (num < epsilon && num > -epsilon) return 0;
	num = num.toPrecision(2);
	return num;

	// if (num >= 5) return Math.round(num);
	// return bigRat(num).toString();

	if (num < 10) {
		num = Math.round(num * 60);
		return '1/ ' + Math.floor(num / 60) + ':' + (num % 60) + ' min';
	}
	return Math.round(num) + '× /min';

	// // pro minute
	// //if (num >= 1) return num;
	// var sec = Math.round(60 * (1/num));

	// var min = Math.floor(sec / 60);
	// sec -= min * 60;
	// return min+':'+sec;

	// var r = bigRat(num);
	// if (r.denom == 1) return r.num;

	// return r.toString();

	// float
	// return this.toFixed(2);

	// rational or int, but with large denominators
	// const c = Math.round(1 / num);
	// if (c > 1) return '1/'+c;
	// return Math.round(num);

	// rational or int but buggy on < 1
	// const int = parseInt(num);
	// var rest = num - int;
	// if (rest < epsilon) return int;
	// if (rest > -epsilon) return int+1;
	// rest = Math.round(1 / rest);
	// return int + ' 1/' + rest;

	var r = bigRat(num);
	var denom = 0, err = 1;
	// do {
	// 	denom ++;
	// 	num = Math.round((r.numerator * denom) / r.denominator);
	// 	err = Math.abs(r.minus(num / denom));
	// }
	// while (err > epsilon);

	const aDenom = [1, 2, 3, 4, 5, 6, 10];
	for (denom of aDenom) {
		num = Math.round((r.numerator * denom) / r.denominator);
		err = Math.abs(r.minus(num / denom));
		if (err <= epsilon) break;
	};

	if (denom == 1) return num;
	return bigRat(num, denom).toString();
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

import Wrap from "./utils/wrap.js";
Vue.component("Wrap", Wrap);
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
Vue.component("Split", Splitpanes);
Vue.component("Pane", Pane);

initData();

new Vue({
	render: h => h(App),
}).$mount('#app')
