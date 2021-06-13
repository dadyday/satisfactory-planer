<template>
	<div id="dropdown">
		<button id="button" type="button" @click="toggle">
			{{ label }}
		</button>
		<div id="content" :style="{ display: open ? 'block' : 'none' }">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		label: String,
	},
	data() {
		return {
			open: false,
		};
	},
	methods: {
		toggle() {
			this.open = !this.open;
		}
	},
}
</script>

<style scoped lang="scss">
#dropdown {
	position:relative;
}
#button:after {
	display: inline-block;
	margin-left: .255em;
	vertical-align: .255em;
	content: "";
	border-top: .3em solid;
	border-right: .3em solid transparent;
	border-bottom: 0;
	border-left: .3em solid transparent;
}
#content {
	position: absolute;
}
</style>