import Vue from 'vue'
import App from './App.vue'
// import 'normalize.css';
// import '@/scss/main.scss';
import _ from 'underscore';

Vue.config.productionTip = false
Vue.prototype.$dump = window.$dump = (arg) => { console.log(arg); return arg; };
Vue.prototype.$_ = window.$_ = _;


new Vue({
	render: h => h(App),
}).$mount('#app')
