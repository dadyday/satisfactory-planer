<template>
	<label>
		<input type="checkbox" :checked="value" @change="changeValue($event)" />
		<span>{{ label }}</span>
	</label>
</template>

<script>
export default {
	props: {
		value: Boolean,
		label: String,
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	methods: {
		changeValue(ev) {
			this.$emit('change', ev.target.checked);
		}
	}
}
</script>
