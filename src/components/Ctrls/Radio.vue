<template>
	<div>
		<label v-for="(item, key) in listData" :key="key">
			<input
				type="radio"
				:name="fieldName"
				:checked="key == value"
				@change="changeValue(key)"
			/>
			<span>{{ item.label }}</span>
		</label>
	</div>
</template>

<script>
export default {
	props: {
		name: String,
		value: null,

		options: null,
		optionValue: String,
		optionLabel: String,
	},
	data() {
		return {
			fieldName: this.name,
			selectedValue: this.selected,
			listData: this.options,
		};
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	created() {
		const list = Object.entries(this.listData);
		this.listData = list.reduce((oRet, item, key) => {
			//console.log('reduce', oRet, item, key);
			var retry = false;
			do {
				retry = false;
				switch (typeof item) {
					case "undefined":
					case "boolean":
					case "number":
					case "string":
					case "symbol":
					case "function":
					case "object":
					default:
						if (item == null) break;
						else if (Array.isArray(item)) {
							key = item[0];
							item = item[1];
							retry = true;
						}
						else {
							if (this.optionValue) key = item[this.optionValue];
							if (this.optionLabel) item = item[this.optionLabel];
						}
						//console.log('item', typeof item, item, key);
				}
			}
			while (retry)
			oRet[key] = { label: item };
			return oRet;
		}, {});
	},
	methods: {
		changeValue(value) {
			this.$emit('change', value);
		}
	}
}
</script>
