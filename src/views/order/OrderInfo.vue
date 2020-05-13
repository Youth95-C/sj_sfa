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
    <TabControl @tabClick="tabClick" />
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
    </div>
    <Scroll :pullUpLoad="true" @pullingUp="loadMore" ref="orderScroll" class="scroll-tap">
      <ul>
        <li v-for="(item,index) in showGoods" :key="index" @click="goodsClick(item.id)">
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
                <span>库存：{{item.warehouseId}}</span>
                <i class="iconfont icon-shuaxin"></i>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </Scroll>
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
import TabControl from "./childComps/TabControl";
import service from "../../network/request";
import { Popup, Checklist, Button, Toast } from "mint-ui";
import Scroll from "../../components/common/scroll/Scroll";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Order",
  data() {
    return {
      filterGoosType: ["食品", "日化", "宝洁"],
      q: "",
      cur: 0,
      total: 0,
      goods: {
        whole: {
          _page: 0,
          onSales: false,
          list: []
        },
        sell: {
          _page: 0,
          onSales: true,
          list: []
        }
      },
      currentType: "whole",
      showSelectGoodsType: false
    };
  },
  created() {
    this.loadGoods("whole");
    this.loadGoods("sell");
  },
  computed: {
    ...mapState(["goodsList"]),
    showGoods() {
      return this.goods[this.currentType].list;
    },
    getFilterGoods() {
      return this.filterGoosType.join("/");
    }
  },
  methods: {
    ...mapMutations(["appendGoods"]),
    backBtnClick() {
      this.$router.go(-1);
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "whole";
          break;
        case 1:
          this.currentType = "sell";
          break;
      }
    },
    loadGoods(type) {
      const page = this.goods[type]._page + 1;
      const onSales = this.goods[type].onSales;
      let params = {
        _page: page,
        _limit: 10,
        onsales: onSales
      };
      service
        .loadGoods(params)
        .then(res => {
          console.log(res.data);
          this.goods[type].list.push(...res.data);
          this.appendGoods(res.data);
          this.total = res.headers["x-total-count"];
          this.cur = this.total;
          this.goods[type]._page += 1;
          this.$refs.orderScroll.finishPullUp();
        })
        .catch(err => {
          // console.log(err)
          Toast({
            message: "加载数据失败",
            position: "bottom",
            duration: 2000
          });
        });
    },
    loadMore() {
      this.loadGoods(this.currentType);
      this.$refs.orderScroll.refresh();
    },
    searchGoods() {
      this.goods[this.currentType].list = [];
      this.goods[this.currentType]._page = 0;

      this.loadGoods(this.currentType);
    },
    goodsClick(id) {
      this.$router.push(`/selectgoods/${id}`);
    }
  },
  components: {
    NavBar,
    TabControl,
    Scroll,
    Popup,
    Checklist,
    Button,
    Toast
  }
};
</script>

<style lang="scss" scoped>
#order {
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
  .search {
    padding: px2rem(20) px2rem(20);
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      i {
        font-size: $text-size-mid;
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
  }
  .scroll-tap {
    height: calc(100% - 396px);
    overflow: hidden;
    ul {
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