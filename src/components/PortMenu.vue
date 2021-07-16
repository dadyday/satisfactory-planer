<template>
	<div class="card" :style="{ top, left }">
		<div><b>Port</b></div>
		<div><small>{{ name }}</small></div>
		<hr/>
		<div>
			<Select
				:list="itemList" listValue="name"
				v-model="itemValue"
			>
			</Select>
		</div>
	</div>
</template>

<script>
import { Item } from '../entity';

export default {
	props: {
		production: Object,
		portId: String,
		x: Number,
		y: Number,
	},
	data() {
		return {
			oProd: this.production,
			inOut: this.portId.substring(0,2) == 'in',
		};
	},
	computed: {
		left() { return this.x + 'px' },
		top() { return this.y + 'px' },

		name() {
			return this.oProd.oReceipe.name;
		},

		itemList() {
			const mRet = new Map;
			const map = this.inOut ? 'mInput' : 'mOutput';
			this.oProd.oReceipe[map].forEach((_, item) => {
				mRet.set(item, Item.get(item));
			})
			return mRet;
		},
		itemValue: {
			get() {
				return this.oProd.getPortItem(this.portId);
			},
			set(value) {
				this.oProd.setPortItem(this.portId, value);
				this.$emit('update', this.oProd);
			}
		}
	},
	methods: {
	},
};

</script>

<style lang="scss">
.card {
	position: absolute;
	z-index: 1000;
	display: inline-block;
	background: white;
	border-radius: 0.4em;
	border: solid 0.5px #ccc;
	box-shadow: 0.1em 0.1em 0.5em -0.2em #0008;
	padding: 0.2em;
	margin: 0.1em 0.2em;
	div {
		display: block;
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
