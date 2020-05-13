<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.nav-bar {
  height: $navh;
  line-height: $navh;
  text-align: center;
  display: flex;
  box-shadow: 0 px2rem(1) 1px2rem (1) rgba(100, 100, 100, 0.1);
}
.center {
  flex: 1;
}
.left,.right {
  width: px2rem(88);
  /* background-color: red; */
}
</style>