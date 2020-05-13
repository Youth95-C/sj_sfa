<template>
  <div id="visit-shop">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">进店拜访</h5>
    </NavBar>
    <TabControl :title="['计划内','计划外']" class="tab-controll" />
    <!--搜索-->
    <div class="search">
      <div class="search-box">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="点击进行搜索~" v-model="val" @keydown.enter="searchShops(false)" />
      </div>
    </div>
    <Scroll :pullUpLoad="true" @pullingUp="loadMore" ref="shopScroll" class="scroll-tap">
      <ul class="mes-wrap">
        <li v-for="(item,index) in shopsList" :key="index" @click="shopClick(item.id)">
          <div class="mes-top">
            <p>{{item.name}}</p>
            <div>
              <i class="iconfont icon-ditu"></i>
              <span>&lt;{{item.distance}}米</span>
            </div>
          </div>
          <div class="mes-center">
            <div>
              <span>ID：{{item.id}}</span>
              <span>创建时间：{{item.subon | dateFormat}}</span>
            </div>
            <div class="more">
              <i class="iconfont icon-gengduo"></i>
            </div>
          </div>
          <div class="mes-bottom">
            <p class="boss">{{item.bossName | bossFormat}}</p>
            <div>
              <i class="iconfont icon-shouji"></i>
              <span>{{item.phone}}</span>
            </div>
          </div>
        </li>
      </ul>
    </Scroll>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import TabControl from "../../components/content/tabControl/TabControl";
import service from "../../network/request";
import Scroll from "../../components/common/scroll/Scroll";
import { mapMutations, mapState } from "vuex";

export default {
  name: "VisitShop",
  data() {
    return {
      //换成vuex统一管理后不再需要
      // shopsList: [],
      val: "",
      lng: "",
      lat: "",
      page: 1
    };
  },
  created() {
    this.getLocation()
      .then(() => {
        this.searchShops(true);
      })
      .catch(() => {
        this.searchShops(true);
      });
  },
  computed: {
    ...mapState(["shopsList"])
  },
  methods: {
    ...mapMutations(["initShops", "appendShops"]),
    backBtnClick() {
      this.$router.go(-1);
    },
    getLocation() {
      return new Promise((resolve, reject) => {
        var geolocation = new qq.maps.Geolocation(
          "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77",
          "myapp"
        );
        geolocation.getLocation(
          position => {
            console.log(position);
            this.lng = position.lng;
            this.lat = position.lat;
            //发送ajax请求，获取当前的店铺信息
            resolve(position);
            // service.getShops({ lng: this.lng, lat: this.lat }).then(res => {
            //   console.log(res.data);
            //   this.shopsList = res.data;
            // });
          },
          err => {
            reject("定位失败");
          },
          {}
        );
      });
    },
    searchShops(isAppend) {
      service
        .getShops({
          lng: this.lng,
          lat: this.lat,
          val: this.val,
          page: this.page
        })
        .then(res => {
          console.log(res.data);
          if (isAppend) {
            //如果是加载更多，就要向shopsList里添加商铺信息
            // this.shopsList.push(...res.data);
            //换成vuex统一管理
            this.appendShops(res.data);
          } else {
            //如果是搜索查询，直接替换把shopsList替换
            // this.shopsList = res.data;
            //换成vuex统一管理
            this.initShops(res.data);
          }
        });
    },
    shopClick(shopId) {
      this.$router.push(`/visitshop/${shopId}`);
    },
    loadMore() {
      this.page += 1;
      this.searchShops(true);
      //加载完成后，必须重新计算列表的高度
      this.$refs.shopScroll.finishPullUp();
    }
  },
  components: {
    NavBar,
    TabControl,
    Scroll
  },
  filters: {
    nameFormat(val) {
      let name = val.split(" ");
      return name[1];
    },
    dateFormat(val) {
      let date = new Date(val);
      return `${date.getFullYear()}年 ${date.getMonth() +
        1}月 ${date.getDate()}日`;
    },
    bossFormat(val) {
      let boss = val.split(" ");
      return `${boss[0]}${boss[1]}`;
    }
  }
};
</script>

<style lang="scss" scoped>
#visit-shop {
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
    .search-box {
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
  }
  .scroll-tap {
    height: calc(100% - 288px);
    overflow: hidden;
    .mes-wrap {
      li {
        display: flex;
        flex-direction: column;
        padding: px2rem(20) px2rem(20);
        border-bottom: 1px solid #ccc;
        .mes-top {
          display: flex;

          align-items: center;
          p {
            flex: 1;
            font-size: $text-size-mid;
            color: #000;
          }
          div {
            display: flex;
            align-items: center;
            margin-right: px2rem(40);
            i {
              font-size: $text-size-imp;
              margin-right: px2rem(5);
              color: #000;
            }
            span {
              font-size: $text-size-mid;
              color: #000;
            }
          }
        }
        .mes-center {
          display: flex;
          justify-content: space-between;
          align-items: center;
          div {
            span {
              font-size: $text-size;
              color: #757575;
              margin-right: px2rem(40);
            }
          }
          .more {
            i {
              font-size: $text-size-mid;
              color: #757575;
            }
          }
        }
        .mes-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .boss {
            font-size: $text-size;
            color: #757575;
          }
          div {
            display: flex;
            align-items: center;
            i {
              font-size: $text-size-imp;
              margin-right: px2rem(5);
              color: #757575;
            }
            span {
              color: $act-color;
              font-size: $text-size;
              margin-right: px2rem(40);
            }
          }
        }
      }
    }
  }
}
</style>