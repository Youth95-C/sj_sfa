<template>
  <div id="goods-select">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">产品选择</h5>
    </NavBar>
    <div class="goods-mes">
      <div class="img-left">
        <img :src="goods.img" alt />
      </div>
      <div class="content-right">
        <p class="title">{{goods.title}}</p>
        <div class="params">
          <span>编码：{{goods.serial}}</span>
          <span>规格：{{goods.packageDimensions}}</span>
        </div>
        <div class="bottom">
          <div class="price">价格：{{goods.monery}}</div>
        </div>
      </div>
    </div>
    <div class="storehouse">
      <div class="left">仓库</div>
      <div class="right">
        <span>{{warehouseName}}</span>
        <i class="iconfont icon-gengduo"></i>
      </div>
    </div>
    <div class="stock">
      <div class="left">库存</div>
      <div class="right">{{goods.number}}</div>
    </div>
    <div class="quantity">
      <div class="left">数量</div>
      <div class="right">
        <div class="jian" @click="subtractCount">
          <i class="iconfont icon-jian"></i>
        </div>
        <div class="count">
          <input type="text" v-model.number="count" />
        </div>
        <div class="jia" @click="addCount">
          <i class="iconfont icon-jia"></i>
        </div>
      </div>
    </div>
    <div class="bottom-nav">
      <div class="cancel" @click="$router.go(-1)">取消</div>
      <div @click="addToCart">加入购物车</div>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import service from "../../network/request";
import { Toast } from "mint-ui";
export default {
  name: "GoodsSelect",
  data() {
    return {
      goods: {},
      //仓库名称
      warehouseName: "",
      count: 1
    };
  },
  created() {
    this.goods = this.$store.state.goodsList.find(
      item => item.id == this.$route.params.id
    );
    console.log(this.goods);
    //通过仓库的id拿到仓库的名称
    //仓库id:this.goods.warehouseId
    service
      .loadWareHouse()
      .then(res => {
        console.log(res.data);
        this.$store.commit("initWarehouse", res.data);
        this.warehouseName = this.$store.state.warehouse.find(
          item => item.id == this.goods.warehouseId
        ).reponame;
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {},
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    addCount() {
      this.count++;
      if (this.count > this.goods.number) {
        this.count = this.goods.number;
      }
    },
    subtractCount() {
      this.count--;
      if (this.count < 1) {
        this.count = 1;
      }
    },
    addToCart() {
      //把购物车相关需要的数据放到vuex中
      let product = {
        shopId: this.$store.state.curOrderShop.id,
        warehouseName: this.warehouseName,
        count: this.count,
        goods: this.goods,
        warehouseId: this.goods.warehouseId
      };
      this.$store.dispatch("addCart", product).then(res => {
        Toast({
          message: res,
          position: "center",
          duration: 2000
        });
      });
      this.$router.push(`/cart/${this.$route.params.id}`);
    }
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#goods-select {
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
  .goods-mes {
    padding: px2rem(20) px2rem(28);
    display: flex;
    align-items: center;
    border-bottom: px2rem(1) solid #ccc;
    .img-left {
      width: px2rem(124);
      height: px2rem(124);
      border: px2rem(1) solid #ccc;
      // margin-right: px2rem(28);
      img {
        width: px2rem(124);
        height: px2rem(124);
      }
    }
    .content-right {
      height: px2rem(124);
      width: 100%;
      margin-left: px2rem(28);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: $text-size-mid;
        color: #000;
      }
      .params {
        color: #757575;
        font-size: $text-size;
        span {
          margin-right: px2rem(60);
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .price {
          flex: 1;
          font-size: $text-size;
          color: #757575;
        }
        .stock {
          display: flex;
          align-items: center;
          span {
            font-size: $text-size;
            color: #757575;
            margin-right: px2rem(20);
          }
          i {
            font-size: $text-size-imp;
            color: #000;
          }
        }
      }
    }
  }
  .storehouse {
    padding: px2rem(28) px2rem(20);
    display: flex;
    align-items: center;
    border-bottom: px2rem(1) solid #ccc;
    .left {
      flex: 1;
      font-size: $text-size-mid;
      color: #000;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        font-size: $text-size;
        color: #000;
      }
      i {
        font-size: $text-size-imp;
      }
    }
  }
  .stock {
    padding: px2rem(28) px2rem(20);
    display: flex;
    align-items: center;
    border-bottom: px2rem(1) solid #ccc;
    .left {
      flex: 1;
      font-size: $text-size-mid;
      color: #000;
    }
    .right {
      font-size: $text-size-mid;
      color: #000;
    }
  }
  .quantity {
    padding: px2rem(28) px2rem(20);
    display: flex;
    align-items: center;
    border-bottom: px2rem(1) solid #ccc;
    .left {
      flex: 1;
      font-size: $text-size-mid;
      color: #000;
    }
    .right {
      font-size: $text-size-mid;
      color: #000;
      display: flex;
      align-items: center;
      div {
        border: px2rem(1) solid #ccc;
      }
      .jian,
      .jia {
        width: px2rem(54);
        height: px2rem(54);
        line-height: px2rem(54);
        text-align: center;
      }
      .count {
        width: px2rem(100);
        height: px2rem(54);
        margin: 0 px2rem(20);
        text-align: center;
        overflow: hidden;
        input {
          outline: none;
          border: none;
          width: px2rem(70);
          height: px2rem(54);
          font-size: $text-size-mid;
          margin: 0 auto;
        }
      }
    }
  }
  .bottom-nav {
    width: 100%;
    height: px2rem(90);
    line-height: px2rem(90);
    display: flex;
    align-items: center;
    border-top: px2rem(1) solid #ccc;
    position: fixed;
    bottom: 0;
    div {
      width: 50%;
      text-align: center;
      font-size: $text-size-imp;
      color: $act-color;
    }
    .cancel {
      border-right: px2rem(1) solid #ccc;
      color: red;
    }
  }
}
</style>