import Vue from 'vue'
import App from './App.vue'
// import 'normalize.css';
// import '@/scss/main.scss';
import _ from 'underscore';

Vue.config.productionTip = false
Vue.prototype.$dump = (...args) => { console.log(...args); return args[0]; };
Vue.prototype.$_ = _;


new Vue({
	render: h => h(App),
}).$mount('#app')
