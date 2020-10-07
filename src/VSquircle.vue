<template>
  <div class="v-squircle active" :style="style">
    <div class="v-squircle--background">
      <div class="v-squircle--segment v-squircle--segment--top-left"></div>
      <div class="v-squircle--filler"></div>
      <div class="v-squircle--segment v-squircle--segment--top-right"></div>
      <div class="v-squircle--filler"></div>
      <div class="v-squircle--filler"></div>
      <div class="v-squircle--filler"></div>
      <div class="v-squircle--segment v-squircle--segment--bottom-left"></div>
      <div class="v-squircle--filler"></div>
      <div class="v-squircle--segment v-squircle--segment--bottom-right"></div>
    </div>
    <div class="v-squircle--slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-squircle",
  props: {
    radius: {
      type: String,
      default: '25px'
    },
    smoothing: {
      type: Number,
      default: 4
    },
    padding: {
      type: String,
      default: '25px'
    },
    background: {
      type: String,
      default: 'hsla(0,0%,0%,0.5)'
    }
  },
  data() {
    return {
      polygon: [],
      active: null,
    }
  },
  methods: {
    squircle(r) {
      return function (theta) {
        let x = Math.pow(Math.abs(Math.cos(theta)), 2 / r) * 50 * Math.sign(Math.cos(theta)) + 50;
        let y = Math.pow(Math.abs(Math.sin(theta)), 2 / r) * 50 * Math.sign(Math.sin(theta)) + 50;
        return {x,y};
      }
    },
    to_radians(deg) {
      return deg * Math.PI / 180;
    }
  },
  mounted() {
    this.polygon = (new Array(91))
     .fill(0)
     .map((x, i) => i)
     .map(this.to_radians) // Defined as deg => deg * Math.PI / 180 elsewhere
     .map(this.squircle(this.smoothing)) // We'll use a border-radius of 4
     .map(({ x, y }) => ({ x: Math.round(x * 10)/10, y: Math.round(y * 10)/10 })) // Round to the ones place
     .map(({ x, y }) => `${(x-50)*2}% ${(y-50)*2}%`);
    this.polygon.push('0% 0%');
    this.active = 'v-squircle--active';
  },
  computed: {
    style () {
      return{
        '--v-squircle-radius': this.radius,
        '--v-squircle-smoothing': this.smoothing,
        '--v-squircle-padding': this.padding,
        '--v-squircle-polygon': 'polygon(' + this.polygon + ')',
        '--v-squircle-background': this.background
      }
    }
  }
};
//  from https://medium.com/@zubryjs/squircles-bringing-ios-7s-solution-to-rounded-rectangles-to-css-9fc35779aa65
</script>

<style lang="css" scoped>
.v-squircle {
  display: grid;
}
.v-squircle--background {
  display: grid;
  grid-template: var(--v-squircle-radius) auto var(--v-squircle-radius) / var(--v-squircle-radius) auto var(--v-squircle-radius);
}
.v-squircle--segment {
  width: var(--v-squircle-radius);
  height: var(--v-squircle-radius);
  clip-path: var(--v-squircle-polygon);
}
.v-squircle--filler, .v-squircle--segment {
  background-color: var(--v-squircle-background);
}
.v-squircle--segment--bottom-left {
  transform: rotate(90deg);
}
.v-squircle--segment--top-left {
  transform: rotate(180deg);
}
.v-squircle--segment--top-right {
  transform: rotate(270deg);
}
.v-squircle--slot, .v-squircle--background {
  grid-area: 1 / 1 / 1 / 1;
}
.v-squircle--slot {
  padding: var(--v-squircle-padding);
}
</style>
