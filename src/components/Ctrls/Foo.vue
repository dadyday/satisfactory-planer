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
		foo: null,
	},
	model: {
		prop: 'foo',
		event: 'bar',
	},
}
</script>
