<template>
	<Entity>
		<div class="icon">
			<img :src="src" :alt="alt" />
		</div>
		<div class="name" v-if="!short">
			<span >{{ name }}</span>
		</div>
		<div class="times" @mousedown="startEditing">
			<input type="number"
				ref="edit"
				v-show="editable && editing"
				v-model="percentValue"
				:style="{width:'3em'}"
				@blur="endEditing"
			/>
			<span v-show="!editable || !editing">{{ percentValue }}</span>
			<span>%</span>
		</div>
		<div>
			<Item v-for="[item, count], i in oProd.oReceipe.mInput"
				:item="item" :count="oProd.productivity*count" short :key="'in'+i"/>
			&#10140;
			<Item v-for="[item, count], i in oProd.oReceipe.mOutput"
				:item="item" :count="oProd.productivity*count" short :key="'out'+i"/>
		</div>
		<div>
		</div>
	</Entity>
</template>

<script>
//import Production from '../lib/Production';

export default {
	props: {
		short: Boolean,
		obj: Object,
		label: String,
		editable: Boolean,
	},
	data() {
		return {
			oProd: this.obj,
			prodValue: 0,
			editing: false,
		};
	},
	computed: {
		name() {
			return this.label ?? this.oProd.oBuilding.name + ' - ' + this.oProd.name;
		},
		alt() {
			return this.oProd.name;
		},
		src() {
			return this.oProd.oBuilding.imageUrl();
		},
		percentValue: {
			get() {
				return (this.oProd.productivity * 100.0).toFixed(0);
			},
			set(value) {
				this.prodValue = parseFloat(value)/100.0;
			}
		},
	},
	methods: {
		startEditing() {
			this.editing = this.editable;
			setTimeout(() => {
				this.$refs.edit.focus();
			}, 100);
		},
		endEditing() {
			this.editing = false;
			this.$emit('update:productivity', this.prodValue);
		},
	},
}
</script>
