<template>
	<select @change="change"
	>
		<option v-if="empty" :value="null">{{ empty }}</option>
		<option
			v-for="value, key in getList()"
			:key="key"
			:value="key"
			:selected="selected == key"
		>
			{{ value }}
		</option>
	</select>
</template>

<script>
export default {
	model: {
		prop: 'selected',
		event: 'change',
	},
	props: {
		list: null,
		listKey: String,
		listValue: String,
		selected: null,
		empty: String,
	},
	data() {
		return {
			listData: this.getList(),
		};
	},
	methods: {
		change(ev) {
			this.$emit('change', ev.target.value);
		},
		getList() {
			return this.$_.reduce(
				this.list instanceof Map ? Object.fromEntries(this.list) : this.list,
				(oRet, item, key) => {
					key = this.listKey ? item[this.listKey] : key;
					item = this.listValue ? item[this.listValue] : item;
					if (item && (key || key == 0)) oRet[key] = item;
					return oRet;
				},
				{}
			);
		},
	},
};
</script>
