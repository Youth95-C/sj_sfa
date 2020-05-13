<template>
  <div class="total">
    <div class="checked-box-wrap">
      <CheckBox class="checked-box" :value="$store.state.checkedAll" @checkedClick="totalClick" />全选
    </div>
    <div class="total-price">
      合计：
      <span>{{$store.getters.getTotalPrice}}元</span>
    </div>
    <div class="ok" @click="submitClick">确认</div>
  </div>
</template>

<script>
import CheckBox from "./CheckBox";
export default {
  name: "Total",
  computed: {},

  props: {
    curShopCart: Object
  },
  computed: {
   
  },
  methods: {
    totalClick() {
      this.$store.commit("changeTotalChecked");
    },
    submitClick() {
      this.$router.push("/subcart");
    }
  },
  components: {
    CheckBox
  }
};
</script>

<style lang="scss" scoped>
.total {
  width: 100%;
  padding: px2rem(20) px2rem(20);
  font-size: $text-size-mid;
  color: #000;
  border-top: px2rem(1) solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  .checked-box-wrap {
    display: flex;
    align-items: center;
    .checked-box {
      margin-right: px2rem(20);
    }
  }
  .total-price {
    span {
      font-size: $text-size-imp;
      color: #ff0000;
    }
  }
  .ok {
    width: px2rem(168);
    height: px2rem(70);
    color: #fff;
    line-height: px2rem(70);
    text-align: center;

    background-color: $act-color;
  }
}
</style>