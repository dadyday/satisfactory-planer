<template>
	<Entity>
		<div class="icon">
			<img :src="src" :alt="alt" />
		</div>
		<div class="name" v-if="!short" @click="startSelecting">
			<select
				ref="select"
				v-show="selectable && selecting"
				v-model="receipeValue"
				@blur="selecting = false"
			>
				<option
					v-for="oReceipe in receipeList"
					:key="oReceipe.name"
					:value="oReceipe.name"
					:selected="oReceipe.name == oProd.oReceipe.name"
				>
					{{ oReceipe.name }}
				</option>
			</select>
			<span v-show="!selectable || !selecting">{{ name }}</span>
		</div>
		<div class="times" @mousedown="startEditing" :class="{full: oProd.full}">
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
		<div v-show="oProd.oReceipe.mInput.size || oProd.oReceipe.mOutput.size">
			<Item v-for="[item, count], i in oProd.oReceipe.mInput"
				:item="item" :count="oProd.productivity*count" short :key="'in'+i"/>
			&#10140;
			<Item v-for="[item, count], i in oProd.oReceipe.mOutput"
				:item="item" :count="oProd.productivity*count" short :key="'out'+i"/>
		</div>
		<div class="button" >
			<button class="add" v-if="addable" @click="add">&plus;</button>
			<button class="remove red" v-if="deletable" @click="del">&times;</button>
		</div>
	</Entity>
</template>

<script>
import { Receipe } from '../entity';

export default {
	props: {
		short: Boolean,
		obj: Object,
		label: String,
		editable: Boolean,
		selectable: Boolean,
		addable: Boolean,
		deletable: Boolean,
	},
	data() {
		return {
			oProd: this.obj,
			prodValue: 0,
			editing: false,
			selecting: false,
		};
	},
	watched: {
		oProd() {
			this.$forceUpdate();
		}
	},
	computed: {
		name() {
			return this.label ?? this.$t(this.oProd.getName());
			// return this.label ?? this.oProd.oBuilding.name + ' - ' + this.oProd.oReceipe.name;
		},
		alt() {
			return this.oProd.id;
		},
		src() {
			return this.oProd.oBuilding?.imageUrl() ?? '';
		},
		percentValue: {
			get() {
				return (this.oProd.productivity * 100.0).toFixed(0);
			},
			set(value) {
				this.prodValue = parseFloat(value)/100.0;
			}
		},
		receipeValue: {
			get: function() {
				return this.oProd.oReceipe.name;
			},
			set: function(value) {
				Receipe.getByBuilding(this.oProd.oBuilding.id).forEach((oReceipe) => {
					if (oReceipe.name == value) {
						this.oProd.oReceipe = oReceipe;
					}
				});
				//this.$emit('update:receipe', value);
			},
		},
		receipeList() {
			return Receipe.getByBuilding(this.oProd.oBuilding.id);
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
		startSelecting() {
			this.selecting = this.selectable;
			setTimeout(() => {
				this.$refs.select.focus();
			}, 100);
		},
		del() {
			this.prodValue = 0;
			this.$emit('delete', this.prodValue);
		},
		add() {
			this.$emit('add', [this.oProd, this.prodValue]);
		},
	},
}
</script>

<style>
.full {
	color: red;
}
</style>
