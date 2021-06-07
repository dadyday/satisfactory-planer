<template>
  <g id="prod" :transform="transform">
    <rect x="0" y="0" width="40" height="40" fill="url(#foundation)" rx="5"/>
    <foreignObject x="0" y="0" width="160" height="160" >
    <div class="title">
      <label>{{ name }}</label>
      <div>{{ productivity }}</div>
    </div>
    </foreignObject>
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
    name() {
      return this.data.name;
    },
    productivity() {
      return (this.data.productivity * 100).toFixed(1)+'%';
    },
    transform() {
      const x = Math.floor(Math.random() * 600);
      const y = Math.floor(Math.random() * 300);
      return `translate(${x} ${y})`;
    },
  },
}
</script>

<style>
#prod .title {
  padding: 5px;
  border: 2px dashed red;
}
</style>