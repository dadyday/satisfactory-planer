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

Number.prototype.minMax = function (min, max) {
	return Math.min(Math.max(this, min), max);
}

Vue.config.productionTip = false
Vue.prototype.$dump = window.$dump = (...arg) => { console.log(...arg); return arg[0]; };
Vue.prototype.$_ = window.$_ = _;

initData();

new Vue({
	render: h => h(App),
}).$mount('#app')
