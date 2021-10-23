<template>
	<div id="foo">
		<span @click="$emit('bar')">foo?: {{ foo }}</span>
	</div>
</template>

<style>
#foo {
	background: white;
}
</style>

<script>
export default {
	props: {
		foo: String,
	},
	model: {
		prop: 'foo',
		event: 'bar',
	},
}
</script>
