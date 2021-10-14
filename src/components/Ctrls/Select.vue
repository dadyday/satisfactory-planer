<template>
	<multiselect
		ref="el"
		v-model="value"
		:options="options"
		:group-label="groupName"
		:group-values="groupValues"
		track-by="key"
		label="label"
		:placeholder="empty"
		clearOnSelect
		@close="close"
		@select="change"
	>
	<template slot="singleLabel" slot-scope="{ option }">
		{{ option.label }}
	</template>
	<template slot="option" slot-scope="{ option }">
		<div v-if="option.$isLabel" class="option__group">
			<div>{{ option.$groupLabel }}</div>
		</div>
		<div v-else class="option__desc">
			<img v-if="option.image" :src="option.image">
			<span class="option__title">{{ option.label }}</span>
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
		listImage: String,
		groupBy: String,
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
			return Object.values(this.listData);
		},
		value: {
			get() {
				return this.listData[this.selectedValue];
			},
			set(item) {
				this.selectedValue = item.key;
				this.change();
				this.close();
			},
		},
		groupName() {
			if (!this.groupBy) return null;
			return 'label';
		},
		groupValues() {
			if (!this.groupBy) return null;
			return 'items';
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
		change() {
			this.$emit('change', this.selectedValue);
		},
		prepareList() {
			const groupedData = {};
			for (var item of this.list.values()) {
				const group = this.groupBy ? item[this.groupBy] : 0;
				if (!groupedData[group]) {
					groupedData[group] = { label: 'Tier '+group, items: [] };
				}
				groupedData[group].items.push({
					id: item[this.listKey],
					label: item.name,
					image: item.imageUrl(),
				});
			}
			const retData = this.groupBy ? groupedData : groupedData[0].items;
			//console.log(retData);
			return Object.values(retData);
		},
		getList() {
			const handler = this.groupBy ?
				(oRet, item, key) => {
					const group = this.groupBy ? item[this.groupBy] : 0;
					const image = this.listImage ? item[this.listImage] : null;
					key = this.listKey ? item[this.listKey] : key;
					item = this.listValue ? item[this.listValue] : item;
					if (!oRet[group]) oRet[group] = { label: 'Tier '+group, items: [] };
					oRet[group].items.push({ key, label: item, image });
					return oRet;
				} :
				(oRet, item, key) => {
					key = this.listKey ? item[this.listKey] : key;
					item = this.listValue ? item[this.listValue] : item;
					if (item && (key || key == 0)) oRet[key] = item;
					return oRet;
				};
			const retData = this.$_.reduce(
				this.list instanceof Map ? Object.fromEntries(this.list) : this.list,
				handler,
				{}
			);
			//console.log(retData);
			return retData
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
			padding: 0 0.5em;

			.option__group {
				text-align: right;
				display: inline;
				div {
					line-height: 0.5em;
					position: relative;

					font-style: italic;
					font-weight: normal;
					font-size: 90%;
					background: white;
				}
			}

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
