<template>
	<div class="entity">
		<slot />
	</div>
</template>

<style lang="scss">
.entity {
	display: inline-block;
	background: white;
	border-radius: 0.2em;
	border: solid 0.5px #ccc;
	box-shadow: 0.1em 0.1em 0.5em -0.2em #0008;
	padding: 0.2em;
	margin: 0.1em 0.2em;
	div {
		display: inline-block;
		margin: 0 0.2em;
		input, select, span {
			font-weight: bold;
			font-size: 10pt;
		}
		.entity {
			padding: 0.0em;
			box-shadow: none;
			margin: 0em 0.1em;
		}
	}
	img {
		width: 24px;
		height: 24px;
		vertical-align: middle;
		position: relative;
		top: -2px;
		margin: -4px 0;
	}
	button {
		border-radius: 5em;
		border: solid 0.5px;
		padding: 0 0.25em;
		vertical-align: text-bottom;
		&.red {
			border-color: #f44;
			background: #fee;
			color: red;
		}
	}
}
</style>
