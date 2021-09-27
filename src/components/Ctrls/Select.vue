<template>
	<multiselect
		ref="el"
		v-model="value"
		:options="options"
		x-group-label="tier"
		x-group-values="items"
		label="name"
		track-by="id"
		:placeholder="empty"
		clearOnSelect
		@close="close"
		@select="emit('change')"
	>
		<template slot="singleLabel" slot-scope="{ option }">
			{{ option.name }}
		</template>
		<template slot="option" slot-scope="props">
			<div class="option__desc">
				<img :src="props.option.imageUrl()">
				<span class="option__title">{{ props.option.name }}</span>
			</div>
		</template>
	</multiselect>

	<!--select
		@change="change"
		@blur="$emit('blur')"
		@focus="$emit('focus')"
		:style="{width}"
	>
		<option v-if="empty" :value="null">{{ empty }}</option>
		<option
			v-for="value, key in getList()"
			:key="key"
			:value="key"
			:selected="selected == key"
		>
			{{ value }}
		</option>
	</select-->
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
	components: { Multiselect },
	model: {
		prop: 'selected',
		event: 'change',
	},
	props: {
		list: null,
		listKey: String,
		listValue: String,
		selected: null,
		empty: String,
		width: String,
	},
	data() {
		return {
			selectedValue: this.selected,
			listData: this.getList(),
		};
	},
	computed: {
		options() {
			return Array.from(this.list.values());
		},
		value: {
			get() {
				return this.listData[this.selectedValue];
			},
			set(value) {
				this.$emit('change', this.selectedValue = value.id);
				this.$emit('close');
			},
		},
	},
	methods: {
		open() {
			setTimeout(() => {
				this.$refs.el.$refs.search.focus();
			}, 1);

		},
		close() {
			this.$emit('close');
			setTimeout(() => {
				document.activeElement.blur();
			}, 1);
		},
		change(ev) {
			this.$emit('change', ev.target.value);
		},
		getList() {
			return this.$_.reduce(
				this.list instanceof Map ? Object.fromEntries(this.list) : this.list,
				(oRet, item, key) => {
					key = this.listKey ? item[this.listKey] : key;
					item = this.listValue ? item[this.listValue] : item;
					if (item && (key || key == 0)) oRet[key] = item;
					return oRet;
				},
				{}
			);
		},
	},
};
</script>

<style lang="scss">
.multiselect__tags {
	display: block !important;
	input.multiselect__input {
		min-width: 100px;
		width: inherit !important;
	}
}
.multiselect__content-wrapper {
	position: absolute;
	max-height: 300px;
	z-index: 10000;
	background: #fff;
	border: solid 1px black;
	overflow-y: scroll;
	ul.multiselect__content {
		display: block;
		padding: 0;
		li.multiselect__element {
			text-indent: 0;

			&::marker {
				content: ""
			}
			img {
				width: 20px;
				height: 20px;
				vertical-align: middle;
				position: relative;
				top: -1px;
				margin: 0px 5px;
			}
			&:hover {
				background: #eee;
				cursor: pointer;
			}
		}
	}
}
</style>
