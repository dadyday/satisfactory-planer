import Vue from 'vue';
import App from './App.vue';
import _ from 'underscore';
import numberFormat from './utils/numberFormat';
// import 'normalize.css';
// import '@/scss/main.scss';

window.isFunction = function(val) {
 return val && {}.toString.call(val) === '[object Function]';
};
window.isObject = function(val) {
	return typeof val === 'object' &&
		!Array.isArray(val) &&
		val !== null
	;
};

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

/*deepMerge = function (source) {
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object) {
			this[key].deepMerge(source[key]);
		}
	}
	Object.assign(this || {}, source)
};*/


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

const missed = { de:{}, en:{} };
var tm;
const i18n = new VueI18n({
  locale: 'de',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
	silentFallbackWarn: true,
	missing: (locale, message, ctx, args) => {
		missed[locale][message] = message;
		clearTimeout(tm);
		tm = setTimeout(() => {
			console.log(JSON.stringify(missed[locale], null, '	'));
		}, 5000);
		return message;
	},
  messages,
});

import initData from './data';
initData(i18n);

// https://optimizely.github.io/vuejs.org/guide/directives.html
/*
Vue.directive('trl', {
	//isFn: true, // important!
	isLiteral: true,
	bind: (el, ctx, vnode, vnode2, ...args) => {
		console.log(this, el, ctx, vnode, vnode2, ...args);
		const tr = (value) => 'translated ' + value;
		if (ctx.arg) {
			vnode.componentInstance[ctx.arg] = tr(ctx.value);
			//Vue.set(vnode2.componentInstance, ctx.arg, tr(ctx.value));
			//vnode.componentInstance.$options.propsData[ctx.arg] = tr(ctx.value);
			//const opts = {};
			//opts[ctx.arg] = tr(ctx.value);
			//Vue.util.mergeOptions(vnode, opts);
		}
		else if (isObject(ctx.value)) {
			for (prop in ctx.value) {
				vnode.$set(prop, tr(ctx.value[prop]));
			}
		}
	}
/*
	update: (el, ctx, vnode, vnode2, ...args) => {
		console.log(this, el, ctx, vnode, vnode2, ...args);
		if (ctx.arg) {
			vnode2.componentInstance[ctx.arg] = 'translated '+ctx.value;
		}
	}
/*  bind: function (el, binding, vnode) {
		if (binding.arg) {
			const tr = 'translated '+binding.value;
			vnode._props[binding.arg] = tr;
			console.log(el, binding, vnode);
			Vue.set(el.__vue__._props[binding.arg], tr);
		}
		//return VueI18n.t(el, binding, vnode);
	}
})
*/

new Vue({
	i18n,
	render: h => h(App),
}).$mount('#app')
