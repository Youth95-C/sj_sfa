<template>
  <div id="subcart">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">提交订单</h5>
    </NavBar>
    <div class="receive-info">
      <div class="consignee">
        <span>收货人：{{curOrderShop.bossName}}</span>
        <span>{{curOrderShop.phone}}</span>
      </div>
      <div class="address-wrap">
        <div class="address-icon">
          <i class="iconfont icon-ditu"></i>
        </div>
        <div class="address">{{curOrderShop.address}}</div>
      </div>
    </div>
    <div class="goods-wrap" v-for="warehouse in getCartWarehouse" :key="warehouse.warehouseId">
      <GoodsItem :warehouse="warehouse" />
      <div class="remark">备注：{{warehouse.remark}}</div>
    </div>
    <div class="total">
      <div class="total-price">
        <span>合计：</span>
        <span class="price">{{getTotalPrice}}元</span>
      </div>
      <div class="ok" @click="submitClick">确认</div>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import GoodsItem from "./childComps/GoodsItem";
import { mapState, mapGetters } from "vuex";
import { Toast } from "mint-ui";
export default {
  name: "SubCart",
  data() {
    return {
      goods: []
    };
  },
  created() {},
  computed: {
    ...mapGetters(["getCartWarehouse", "getTotalPrice"]),
    ...mapState(["curOrderShop"])
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    submitClick() {
      this.$store.commit("subOrderClear");
      Toast({
        message: "订单提交成功",
        position: "bottom",
        duration: 2000
      });
      this.$router.push('/home')
    }
  },
  components: {
    NavBar,
    GoodsItem
  }
};
</script>

<style lang="scss" scoped>
#subcart {
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
  .receive-info {
    width: 100%;
    padding: px2rem(20) px2rem(20);
    background-color: #fafafa;
    border-bottom: px2rem(1) solid #ccc;
    .consignee {
      font-size: $text-size-mid;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .address-wrap {
      display: flex;
      align-items: center;

      .address-icon {
        i {
          font-size: $text-size-mid;
        }
      }
      .address {
        flex: 1;
        font-size: $text-size;
        color: #757575;
      }
    }
  }
  .goods-wrap {
    .remark {
      line-height: px2rem(80);
      padding: 0 px2rem(20);
      font-size: $text-size;
      border-bottom: px2rem(1) solid #ccc;
    }
  }
  .total {
    width: 100%;
    font-size: $text-size-mid;
    padding: px2rem(20) px2rem(28);
    border-top: px2rem(1) solid #ccc;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .total-price {
      .price {
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
}
</style>