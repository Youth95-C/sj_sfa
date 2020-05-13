<template>
  <div id="order">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">下单</h5>
      <div slot="right">
        <i class="iconfont icon-gouwuche"></i>
      </div>
    </NavBar>
    <div class="search">
      <div class="search-box">
        <i class="iconfont icon-sousuo" @click="searchGoods"></i>
        <input type="text" placeholder="点击进行搜索~" v-model="q" @keydown.enter="searchGoods" />
      </div>
      <div class="erweima">
        <i class="iconfont icon-saoma"></i>
      </div>
    </div>
    <div class="tab-control">
      <ul>
        <li :class="{act: isOnSales}" @click="isOnSalesClick">促销</li>
        <li :class="{act: isAll }" @click="selectAll">全部</li>
        <li>SKU-L</li>
        <li>SKU-L</li>
        <li>SKU-L</li>
      </ul>
    </div>
    <!--商品列表-->
    <div class="goods-list-wrap">
      <div class="goods-he">
        <div class="fl">{{cur}}/{{total}}</div>
        <div class="fr">
          <ul>
            <li>{{getFilterGoods}}</li>
          </ul>
          <div @click="showSelectGoodsType=true">
            <i class="iconfont icon-guolv"></i>
          </div>
        </div>
      </div>
      <ul
        class="goods-bd"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <li v-for="(item,index) in goodsList" :key="index" @click="goodsClick(item.id)">
          <div class="img-left">
            <img :src="item.img" alt />
          </div>
          <div class="content-right">
            <p class="title">{{item.title}}</p>
            <div class="params">
              <span>编码：{{item.serial}}</span>
              <span>规格：{{item.packageDimensions}}</span>
            </div>
            <div class="bottom">
              <div class="price">价格：{{item.monery}}</div>
              <div class="stock">
                <span>库存：{{item.number}}</span>
                <i class="iconfont icon-shuaxin"></i>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <Popup v-model="showSelectGoodsType" pop-transition="popup-fade">
      <div class="popup-select">
        <Checklist
          class="check"
          v-model="filterGoosType"
          :options="['食品','日化','宝洁']"
          title="请选择商品类型"
        ></Checklist>
        <Button @click="showSelectGoodsType=false" type="primary">确定</Button>
      </div>
    </Popup>
  </div>
</template>

<script>
import Vue from "vue";
import NavBar from "../../components/common/navbar/NavBar";
import service from "../../network/request";
import { Popup, Checklist, Button, Toast, InfiniteScroll } from "mint-ui";
import { mapMutations, mapState } from "vuex";
Vue.use(InfiniteScroll);

export default {
  name: "Order",
  data() {
    return {
      currentIndex: 0,
      cur: 0,
      total: 0,
      goods: [],
      showSelectGoodsType: false,
      filterGoosType: ["食品", "日化", "宝洁"],
      q: "",
      curPage: 1,
      loading: false,
      isOnSales: false,
      isAll: false
    };
  },
  created() {
    this.loadGoods();
  },
  computed: {
    ...mapState(["goodsList"]),
    getFilterGoods() {
      return this.filterGoosType.join("/");
    }
  },
  methods: {
    ...mapMutations(["appendGoods", "initGoods"]),
    backBtnClick() {
      this.$router.go(-1);
    },
    searchGoods() {
      // this.goods = [];
      this.initGoods([]);
      this.curPage = 1;
      this.loadGoods();
    },
    loadGoods() {
      let params = {
        _page: this.curPage,
        _limit: 20,
        q: this.q
      };
      if (!this.isAll) {
        params.onsales = this.isOnSales;
      }
      service
        .loadGoods(params)
        .then(res => {
          console.log(res.data);
          // this.goods.push(...res.data);
          this.appendGoods(res.data);
          this.total = res.headers["x-total-count"];
          this.cur = this.total;
        })
        .catch(err => {
          Toast({
            message: "加载数据失败",
            position: "bottom",
            duration: 2000
          });
        });
    },
    loadMore() {
      this.loading = true;
      this.curPage++;
      this.loadGoods();
      this.p = false;
    },
    isOnSalesClick() {
      this.isOnSales = true;
      this.isAll = false;
      // this.goods = [];
      this.initGoods([]);
      this.curPage = 1;
      this.loadGoods();
    },
    selectAll() {
      this.isOnSales = false;
      this.isAll = true;
      // this.goods = [];
      this.initGoods([]);
      this.curPage = 1;
      this.loadGoods();
    },
    goodsClick(id) {
      this.$router.push(`/selectgoods/${id}`);
    }
  },
  components: {
    NavBar,
    Popup,
    Checklist,
    Button
  }
};
</script>

<style  lang="scss" scoped>
#order {
  height: 100%;
  padding-top: px2rem(300);
  background-color: #fff;
  .nav-bar {
    width: 100%;
    background-color: $act-color;
    position: fixed;
    top: 0;

    i {
      font-size: $text-size-imp;
      color: #fff;
    }
    h5 {
      color: #fff;
    }
  }
  .search {
    padding: px2rem(20) px2rem(20);
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    width: 100%;
    position: fixed;
    top: px2rem(88);
    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      i {
        font-size: $text-size-imp;
      }
      input {
        flex: 1;
        height: px2rem(60);
        font-size: $text-size-mid;
        color: #000;
        background: none;
        outline: none;
        border: none;
        margin-left: px2rem(20);
      }
    }
    .erweima {
      height: px2rem(60);
      width: px2rem(60);
      text-align: center;
      i {
        font-size: px2rem(56);
      }
    }
  }
  .tab-control {
    width: 100%;
    position: fixed;
    top: px2rem(190);
    ul {
      display: flex;
      align-items: center;
      padding: px2rem(15) 0;
      border-bottom: px2rem(1) solid #ccc;
      background-color: #fafafa;
      li {
        flex: 1;
        line-height: px2rem(80);
        font-size: $text-size-mid;
        text-align: center;
        border-right: px2rem(1) solid #ccc;
        list-style-type: none;
      }
      .act {
        color: #04afeb;
      }
    }
  }
  .goods-list-wrap {
    background-color: #fff;
    .goods-he {
      display: flex;
      align-items: center;
      padding: px2rem(20) px2rem(28);
      border-bottom: px2rem(1) solid #ccc;
      .fl {
        flex: 1;
        font-size: $text-size-mid;
        color: #757575;
      }
      .fr {
        display: flex;
        align-items: center;
        ul {
          flex: 1;
          list-style: none;
          display: flex;
          align-items: center;
          margin-right: px2rem(20);
          font-size: $text-size-mid;
          color: #757575;
        }
        i {
          font-size: $text-size-imp;
        }
      }
    }
    .goods-bd {
      li {
        padding: px2rem(20) px2rem(28);
        display: flex;
        align-items: center;
        border-bottom: px2rem(1) solid #ccc;
        .img-left {
          width: px2rem(124);
          height: px2rem(124);
          border: px2rem(1) solid #ccc;
          margin-right: px2rem(28);
          img {
            width: px2rem(124);
            height: px2rem(124);
          }
        }
        .content-right {
          height: px2rem(124);
          width: 100%;
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
    }
  }
  .popup-select {
    width: px2rem(400);
    height: px2rem(300);
    padding: px2rem(50);
  }
}
</style>