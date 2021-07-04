<template>
	<Entity>
		<div class="icon">
			<img :src="src" :alt="alt" />
		</div>
		<div class="name" v-if="!short">
			<span >{{ name }}</span>
		</div>
		<div>
		</div>
	</Entity>
</template>

<script>
import { Building } from '../entity';

export default {
	props: {
		short: Boolean,
		type: String,
		obj: Object,
		label: String,
	},
	data() {
		return {
			oBuilding: this.obj ?? Building.get(this.type),
		};
	},
	computed: {
		name() {
			return this.label ?? this.oBuilding.name;
		},
		alt() {
			return this.oBuilding.type;
		},
		src() {
			return this.oBuilding.imageUrl();
		},
	},
}
</script>
