<template>
  <div id="cart">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">{{shopName}}</h5>
    </NavBar>
    <Warehouse
      v-for="(warehouse,index) in curShopCart.warehouse"
      :key="index"
      :warehouse="warehouse"
    />
    <Total :curShopCart="curShopCart" />
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import Warehouse from "./childComps/Warehouse";
import Total from "./childComps/Total";
import { mapState } from "vuex";
export default {
  name: "Cart",
  data() {
    return {
      shopName: "",
      curShopCart: null
    };
  },
  created() {
    this.shopName = this.$store.state.curOrderShop.name;
    this.curShopCart = this.cart.find(
      item => item.shopId == this.curOrderShop.id
    );
    console.log(this.curShopCart);
  },
  computed: {
    ...mapState(["cart", "curOrderShop"])
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    }
  },
  components: {
    NavBar,
    Warehouse,
    Total
  }
};
</script>

<style lang="scss" scoped>
#cart {
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