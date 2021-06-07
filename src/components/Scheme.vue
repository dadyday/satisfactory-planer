<template>
  <g id="scheme">
    <rect x="0" y="0" width="200" height="200" fill="url(#foundation)" />
    <template v-for="aProd, name in aProduction">
      <Production v-for="oProd, i in aProd" v-bind:key="name+i" :data="oProd" />
    </template>
  </g>
</template>

<script>
export default {
  props: {
    data: Object,
  },
  data() {
    return {
    };
  },
  computed: {
    aProduction() {
      return this.data ? this.data.aProduction : {};
    },
  },
}
</script>

<style>
</style>