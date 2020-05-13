<template>
  <div class="tab-control">
    <div
      class="tab-control-item"
      :class="{'active':index==currentIndex}"
      v-for="(item,index) in titles"
      :key="index"
      @click="itemClick(index)"
    >{{item}}</div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  data() {
    return {
      titles: ["全部", "促销", "SKU-L", "SKU-L", "SKU-L"],
      currentIndex: 0
    };
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
  align-items: center;
  padding: px2rem(15) 0;
  border-bottom: px2rem(1) solid #ccc;
  background-color: #fafafa;
  .tab-control-item {
    flex: 1;
    line-height: px2rem(80);
    font-size: $text-size-mid;
    text-align: center;
    border-right: px2rem(1) solid #ccc;
    list-style-type: none;
  }
  .active {
    color: #04afeb;
  }
}
</style>