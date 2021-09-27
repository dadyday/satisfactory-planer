<template>
	<div class="entity">
		<div v-if="icon" class="icon">
			<img :src="icon" :alt="icon" />
		</div>
		<div v-if="name" class="name" @click="startSelecting">
			<select
				ref="select"
				v-show="selecting"
				v-model="nameValue"
				@blur="endSelecting"
			>
				<option
					v-for="value, key in list"
					:key="key"
					:value="value"
					:selected="name == value"
				>
					{{ value }}
				</option>
			</select>
			<span v-show="!selecting">{{ name }}</span>
		</div>
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		icon: String,
		name: String,
		list: {},
		listKey: null, // key from item property, otherwise list key
		listValue: null, // value from item property, otherwise item itself
	},
	data() {
		return {
			nameVal: name,
			selecting: false,
		};
	},
	computed: {
		nameValue: {
			get() {
				return this.nameVal;
			},
			set(value) {
				this.nameVal = value;
			}
		}
	},
	methods: {
		startSelecting() {
			this.selecting = true;
			setTimeout(() => {
				this.$refs.select.focus();
			}, 100);
		},
		endSelecting() {
			this.selecting = false;
		}
	},
}
</script>

<style lang="scss">
.entity {
	display: inline-block;
	background: white;
	border-radius: 0.2em;
	border: solid 0.5px #ccc;
	box-shadow: 0.1em 0.1em 0.5em -0.2em #0008;
	padding: 0.2em;
	margin: 0.1em 0.2em;
	> div {
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
	> .icon > img {
		width: 24px;
		height: 24px;
		vertical-align: middle;
		position: relative;
		top: -2px;
		margin: -4px 0;
	}
	> .button > button {
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
