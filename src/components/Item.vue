<template>
	<div id="item">
		<div class="icon">
			<img :src="src" :alt="itemValue" />
		</div>
		<div class="times" v-show="hasCount" @click="startEditing">
			<span>&times;</span>
			<input type="text"
				ref="edit" 
				v-show="editable && editing"
				v-model="countValue" 
				:style="{width:inputWidth}"
				@blur="endEditing"
			/>
			<span v-show="!editable || !editing">{{ countValue }}</span>
		</div>
		<div class="name" v-if="!short" @click="startSelecting">
			<select
				ref="select" 
				v-show="selectable && selecting"
				v-model="itemValue" 
				:style="{width:getWidth(this.$el, name)}"
				@blur="selecting = false"
			>
				<option 
					v-for="oSub, subItem in aItemList" 
					:key="subItem" 
					:value="subItem" 
					:selected="subItem == itemValue"
				>
					{{ oSub.name }}
				</option>
			</select>
			<span v-show="!selectable || !selecting">{{ name }}</span>
		</div>
		<div class="button" >
			<button class="add" v-if="addable" @click="addItem">&plus;</button>
			<button class="remove" v-if="deletable" @click="deleteItem">&times;</button>
		</div>
	</div>
</template>

<style lang="scss">
#item {
	display: inline-block;
	border: solid 0.5px #ccc;
	border-radius: 0.2em;
	box-shadow: 0.1em 0.1em 0.2em 0px #0008;
	div {
		display: inline-block;
		line-height: 1.5em;
		margin: 0 0.2em;
		input, select, span {
			font-weight: bold;
			font-size: 10pt;
		}
	}
	.icon img {
		width: 24px;
		height: 24px;
		vertical-align: middle;
		position: relative;
		top: -1px;
	}
	.button button {
		border-radius: 5em;
		border: solid 0.5px;
		padding: 0 0.25em;
		vertical-align: text-bottom;
		&.remove {
			border-color: #f44;
			background: #fee;
			color: red;
		}
	}
}
</style>


<script>
import Item from '../lib/Item';

var	inputSize = 0;
const inputOffset = 0;
function log(...args) { 
	console.log(...args);
	return args[0];
}
log('-----------')

export default {
	props: {
		item: String,
		short: Boolean,
		count: Number,
		label: String,
		editable: Boolean,
		selectable: Boolean,
		deletable: Boolean,
		addable: Boolean
	},
	emits: [
		'update:count',
		'update:item',
		'update',
		'delete',
	],
	data() {
		return {
			countVal: 0,
			itemVal: this.item,
			oItem: Item.get(this.item),
			
			editing: false,
			selecting: false,
		};
	},
	computed: {
		hasCount() {
			return this.editing || !isNaN(this.count);
		},
		inputWidth() {
			const val = ''+parseInt(this.countVal || 0);
			const l = Math.max(val.length, 1);
			return (l * inputSize + inputOffset) + 'px';
		},
		itemValue: {
			get: function() {
				return this.itemVal;
			},
			set: function(value) {
				this.itemVal = value;
				this.oItem = Item.get(value),
				this.$emit('update:item', value);
			},
		},
		countValue: {
			get: function() {
				return this.countVal;
			},
			set: function(value) {
				this.countVal = parseInt(value) || 0;
			},
		},
		name() {
			return this.label ?? this.oItem.name;
		},
		src() {
			return this.oItem.imageUrl();
		},
		aItemList() {
			return Item.getAll();
		},
	},
	mounted() {
		this.countVal = Math.ceil(this.count || 0).toFixed();
		if (!inputSize) {
			inputSize = log(this.getTextWidth(this.$refs.edit, '0123456789') / 10);
		}
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
			this.$emit('update:count', this.countValue);
		},
		startSelecting() {
			this.selecting = this.selectable;
			setTimeout(() => { 
				this.$refs.select.focus();
			}, 100);
		},
		getWidth(el, text) {
			return this.getTextWidth(el, text);
		},
		deleteItem() {
			this.countValue = 0;
			this.$emit('delete', this.itemVal);
		},
		addItem() {
			this.$emit('add', [this.itemVal, this.countVal]);
		},
		getTextWidth(el, text) {
			if (!el) return;
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			context.font = getComputedStyle(el).font;
			return context.measureText(text).width;
		},
	},
}
</script>

