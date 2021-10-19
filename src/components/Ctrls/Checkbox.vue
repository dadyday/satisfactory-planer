<template>
	<div><label>
		<input type="checkbox" :checked="value" @change="changeValue($event)" />
		<span><slot>{{ label }}</slot></span>
	</label>
	</div>
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
