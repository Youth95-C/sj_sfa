<template>
  <div class="check-box" @click="$emit('checkedClick')">
    <div class="inner" v-show="value"></div>
  </div>
</template>

<script>
export default {
  name: "CheckBox",
  props: {
      value:Boolean
  }
};
</script>

<style lang="scss" scoped>
.check-box {
  height: px2rem(28);
  width: px2rem(28);
  border-radius: 50%;
  border: px2rem(1) solid #333;
  position: relative;
  .inner {
    border-radius: 50%;
    height: px2rem(18);
    width: px2rem(18);
    margin: 0 auto;
    background-color: #00a2eb;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>