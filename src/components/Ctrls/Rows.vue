<template>
	<div class="rows">
		<slot />
	</div>
</template>

<style>
.rows {
	display: flex;
	flex-direction: column;
}
.rows > * {
	margin: 5px 0;
}
</style>