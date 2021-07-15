import Vue from 'vue';
import App from './App.vue';
import initData from './data';
import _ from 'underscore';
// import 'normalize.css';
// import '@/scss/main.scss';

Map.prototype.getInit = function (key, initValue = null) {
	if (!this.has(key)) this.set(key, initValue);
	return this.get(key);
};
Map.prototype.setDefault = function (key, defaultValue = null) {
	if (!this.has(key)) this.set(key, defaultValue);
};

Number.prototype.minMax = function (min, max) {
	return Math.min(Math.max(this, min), max);
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
