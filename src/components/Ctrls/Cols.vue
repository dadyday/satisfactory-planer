<template>
	<div class="cols">
		<slot />
	</div>
</template>

<style>
.cols {
	display: flex;
	flex-direction: row;
}
.cols > * {
	margin: 0 5px;
}
</style>