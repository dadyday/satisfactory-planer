<template>
	<Entity>
		<div class="icon">
			<img :src="src" :alt="alt" />
		</div>
		<div class="name" v-if="!short">
			<span >{{ name }}</span>
		</div>
		<div class="times" >
			<span>{{ percentValue }}</span>
			<span>%</span>
		</div>
		<div>
			<Item v-for="[item, count], i in oProd.oReceipe.mInput"
				:item="item" :count="oProd.productivity*count" short :key="'in'+i+rdm"/>
			&#10140;
			<Item v-for="[item, count], i in oProd.oReceipe.mOutput"
				:item="item" :count="oProd.productivity*count" short :key="'out'+i+rdm"/>
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
	},
	data() {
		return {
			oProd: this.obj,
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
		percentValue() {
			return (this.oProd.productivity * 100.0).toFixed(0);
		}
	},
}
</script>
