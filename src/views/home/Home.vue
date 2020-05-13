<template>
  <div id="home">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui1"></i>
      </div>
      <h5 slot="center">SFA</h5>
      <div slot="right" @click="$router.push('/user')">
        <i class="iconfont icon-user" @click="userBtnClick"></i>
      </div>
    </NavBar>
    <div class="date">{{getYearMonth}}</div>
    <div class="charts">
      <Progress class="chart" title="当前月进度" :val="getDayOfMonth" :isShowPercent="true" />
      <Progress class="chart" title="月销售完成度" :val="mouthSealePercent" :isShowPercent="true" />
      <Progress class="chart" title="有效商店数" :val=" shops" :isShowPercent="false" />
    </div>
    <div class="menu-wrap">
      <MenuList
        v-for="(menu,index) in menuList"
        :key="index"
        :imgUrl="menu.imgUrl"
        :menuUrl="menu.url"
        :menuName="menu.menuName"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import Progress from "./childComps/Progress";
import MenuList from "./childComps/MenuList";
import service from "../../network/request";
export default {
  name: "Home",
  data() {
    return {
      menuList: [
        {
          menuName: "公司通告",
          imgUrl: require("@/assets/img/gstg.png"),
          url: "/notice"
        },
        {
          menuName: "进店拜访",
          imgUrl: require("@/assets/img/jdbf.png"),
          url: "/visitshop"
        },
        {
          menuName: "电话订单",
          imgUrl: require("@/assets/img/dhdd.png"),
          url: "/phoneorder"
        },
        {
          menuName: "订单状态",
          imgUrl: require("@/assets/img/ddzt.png"),
          url: "/orders"
        },
        {
          menuName: "培训资料",
          imgUrl: require("@/assets/img/pxzl.png"),
          url: "/training"
        },
        {
          menuName: "消息中心",
          imgUrl: require("@/assets/img/xxzx.png"),
          url: "/message"
        },
        {
          menuName: "新增门店",
          imgUrl: require("@/assets/img/xzmd.png"),
          url: "/addshop"
        },
        {
          menuName: "数据同步",
          imgUrl: require("@/assets/img/sjtb.png"),
          url: "/asyncdata"
        }
      ],
      mouthSealePercent: 0,
      shops: 0
    };
  },
  created() {
    service.getUserProgress().then(res => {
      console.log(res.data);
      this.mouthSealePercent = parseInt(res.data.monthPercent * 100);
      this.shops = res.data.totalShops;
    });
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    userBtnClick() {
      this.$router.push("/user");
    }
  },
  computed: {
    getYearMonth() {
      let date = new Date();
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    },
    getDayOfMonth() {
      let date = new Date();
      return parseInt((date.getDay() / 30) * 100);
    }
  },
  components: {
    NavBar,
    Progress,
    MenuList
  }
};
</script>

<style lang="scss" scoped>
#home {
  background-color: #fff;
  height: 100%;
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
  .date {
    text-align: center;
    font-size: $text-size-imp;
    padding: px2rem(40) 0;
    color: #000;
  }
  .charts {
    display: flex;
    .chart {
      flex: 1;
    }
  }
  .menu-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: px2rem(80);
    border-top: 1px solid #ccc;
    :nth-child(3n){
      border-right:none;
    }
  }
}
</style>