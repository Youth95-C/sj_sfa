<template>
  <div id="notice-detail">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui1"></i>
      </div>
      <h5 slot="center">公告信息</h5>
    </NavBar>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
export default {
  name: "NoticeDetail",
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    }
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#notice-detail {
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
  }
}
</style>