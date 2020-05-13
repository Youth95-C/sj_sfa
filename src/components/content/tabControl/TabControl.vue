<template>
  <div class="tab-control">
    <div
      class="tab-item"
      v-for="(item,index) in title"
      :key="index"
      :class="{'active':index===currentIndex}"
      @click="itemClick(index)"
    >
      <div class="change" v-if="index===currentIndex"></div>
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  data() {
    return {
      currentIndex: 0
    };
  },
  props: {
    title: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit("tabClick", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-control {
  display: flex;
  text-align: center;
  background-color: #fff;
  height:px2rem(98);
  line-height:px2rem(98);
  .tab-item {
    flex: 1;
    position: relative;
    .change {
      width: 100%;
      height: px2rem(6);
      background-color: $act-color;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    span {
      font-size: $text-size-mid;
    }
  }
  .active {
    color: $act-color;
  }
}
</style>