import Vue from 'vue';

export default {
	createComponent: (elParent, Component, oProp = {}, oEvent = {}) => {
		const ComponentClass = Vue.extend(Component);
		const oObj = new ComponentClass({ propsData: oProp });

		oObj.$mount();
		elParent.appendChild(oObj.$el);
		for (var event in oEvent) {
			oObj.$on(event, oEvent[event]);
		}

		return oObj;
	},
	destroyComponent: (oObj) => {
		oObj.$destroy();
		oObj.$el.remove();
	}
};
