<template>
  <div id="addshop">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">新增门店</h5>
    </NavBar>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
export default {
  name: "AddShop",
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#addshop {
  height: 100%;
  background-color: #fff;
  .nav-bar {
    background-color: $act-color;
    i {
      font-size: $text-size-imp;
      color: #fff;
    }
    h5 {
      color: #fff;
    }
    .right {
      color: #fff;
      font-size: $text-size-mid;
      padding: 0 px2rem(20);
    }
  }
}
</style>