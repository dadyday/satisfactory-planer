<template>
	<div class="card" :style="{ top, left }">
		<div><b>Produktion</b></div>
		<hr/>
		<div>
			<Select
				:list="buildingList" listKey="type" listValue="name"
				v-model="buildingValue"
			>
			</Select>
		</div>
		<div>
			<Select
				empty="- kein -"
				:list="receipeList" listKey="id" listValue="name"
				v-model="receipeValue"
			>
			</Select>
		</div>
	</div>
</template>

<script>
import { Production, Building, Receipe } from '../entity';

export default {
	props: {
		type: String,
		obj: Object,
		x: Number,
		y: Number,
	},
	data() {
		return {
			oProd: this.obj ?? new Production(this.type),
			selecting: false,
		};
	},
	computed: {
		left() { return this.x + 'px' },
		top() { return this.y + 'px' },

		buildingList() {
			return Building.getAll();
		},
		buildingValue: {
			get() {
				return this.oProd.oBuilding?.type ?? null;
			},
			set(value) {
				this.oProd.setBuilding(value);
				this.$emit('update', this.oProd);
			}
		},
		receipeList() {
			return Receipe.getByBuilding(this.oProd.oBuilding?.type ?? null);
		},
		receipeValue: {
			get() {
				return this.oProd.oReceipe?.id ?? null;
			},
			set(value) {
				this.oProd.oReceipe = Receipe.get(value);
				//this.$emit('production', value);
				this.$emit('update', this.oProd);
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
		},
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
