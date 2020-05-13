<template>
  <div id="shop-info">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">店内活动</h5>
    </NavBar>
    <div class="shop-info-bd">
      <p>{{shopInfo.name}}</p>
      <div class="month-sales-wrap">
        <div class="month-sales">
          <img src="../../assets/img/sales.png" alt />
          <span>本月至今销量</span>
        </div>
        <span>{{shopSale.MonthSales}}</span>
      </div>
      <div class="year-sales-wrap">
        <div class="year-sales">
          <img src="../../assets/img/year.png" alt />
          <span>过往半年月均销量</span>
        </div>
        <span>{{shopSale.MonthAvgSales}}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-hd">
          <div class="percent">
            <img src="../../assets/img/percent.png" alt />
            <span>核心分销完成率</span>
          </div>
          <span>{{shopSale.DivSalesPercent.toFixed(0)}}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-val" :style="{width:`${shopSale.DivSalesPercent}%`}"></div>
        </div>
      </div>
      <div class="history-remark-wrap">
        <div class="history-remark">
          <span>历史拜访备注：</span>
        </div>
        <textarea placeholder="点击填写历史备注~" class="history-txt-remark pdl28"></textarea>
      </div>
      <div class="btn-wrap">
        <div class="btn" @click="orderClick">下单</div>
        <div class="btn act" @click="signInBtnClick">商铺签到</div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import service from "../../network/request";
import { mapState } from "vuex";

export default {
  name: "ShopInfo",
  data() {
    return {
      shopInfo: null,
      shopSale: {
        DivSalesPercent: 0,
        MonthAvgSales: 0,
        MonthSales: 0
      }
    };
  },
  created() {
    //获取店铺的销售进度
    service.getShopInfo(this.$route.params.id).then(res => {
      console.log(res.data);
      this.shopSale.MonthAvgSales = res.data.MonthAvgSales;
      this.shopSale.MonthSales = res.data.MonthSales;
      gsap.to(this.$data.shopSale, {
        duration: 0.5,
        DivSalesPercent: res.data.DivSalesPercent
      });
    });
    //从vuex的store中获取当前店铺的信息
    this.shopInfo = this.shopsList.find(
      item => item.id == this.$route.params.id
      //把当前下订单的店铺信息放到vuex中
    );
    console.log(this.shopInfo);
    this.$store.commit("initCurOrderShop", this.shopInfo);
  },
  computed: {
    ...mapState(["shopsList"])
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    signInBtnClick() {
      this.$router.push("/shopsignin/" + this.$route.params.id);
    },
    orderClick() {
      this.$router.push("/order/" + this.$route.params.id);
    }
  },
  filters: {
    nameFormat(val) {
      let name = val.split(" ");
      return name[1];
    }
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#shop-info {
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

  .shop-info-bd {
    background-color: #fff;
    p {
      padding: px2rem(40) px2rem(20);
      color: #000;
      font-size: $text-size-mid;
      border-bottom: px2rem(1) solid #ccc;
    }
    .month-sales-wrap {
      padding: px2rem(40) px2rem(20);
      color: #000;
      font-size: $text-size-mid;
      border-bottom: px2rem(1) solid #ccc;
      display: flex;
      align-items: center;
      .month-sales {
        flex: 1;
        display: flex;
        align-items: center;
        img {
          width: px2rem(36);
          height: px2rem(36);
          margin-right: px2rem(20);
        }
      }
    }
    .year-sales-wrap {
      padding: px2rem(40) px2rem(20);
      color: #000;
      font-size: $text-size-mid;
      border-bottom: px2rem(1) solid #ccc;
      display: flex;
      align-items: center;
      .year-sales {
        flex: 1;
        display: flex;
        align-items: center;
        img {
          width: px2rem(36);
          height: px2rem(36);
          margin-right: px2rem(20);
        }
      }
    }
    .progress-wrap {
      padding: 0 px2rem(20) px2rem(20);
      border-bottom: px2rem(1) solid #ccc;
      .progress-hd {
        padding: px2rem(40) 0;
        color: #000;
        font-size: $text-size-mid;
        display: flex;
        align-items: center;
        .percent {
          flex: 1;
          display: flex;
          align-items: center;
          img {
            width: px2rem(36);
            height: px2rem(36);
            margin-right: px2rem(20);
          }
        }
      }
      .progress-bar {
        height: px2rem(12);
        width: 100%;
        border-radius: px2rem(6);
        background-color: #ccc;
        .progress-bar-val {
          height: px2rem(12);
          border-radius: px2rem(6);
          background: linear-gradient(to right, #868ce4, #57c988);
        }
      }
    }
    .history-remark-wrap {
      .history-remark {
        padding: px2rem(20) px2rem(20);
        font-size: $text-size;
        background-color: #fafafa;
      }
      .history-txt-remark {
        width: 100%;
        height: px2rem(200);
        line-height: 1.5;
        font-size: $text-size;
        background-color: #fff;
        border: none;
        outline: none;
        padding: px2rem(20) px2rem(20);
        border-top: px2rem(1) solid #ccc;
        border-bottom: px2rem(1) solid #ccc;
      }
    }
    .btn-wrap {
      margin-top: px2rem(100);
      .btn {
        height: px2rem(84);
        width: px2rem(480);
        line-height: px2rem(84);
        text-align: center;
        font-size: $text-size-imp;
        color: $act-color;
        border: px2rem(1) solid $act-color;
        margin: 0 auto px2rem(40);
      }
      .btn.act {
        color: #fff;
        background-color: $act-color;
      }
    }
  }
}
</style>